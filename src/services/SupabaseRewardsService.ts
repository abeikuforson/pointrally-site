import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase.types';

type Reward = Database['public']['Tables']['rewards']['Row'];
type Redemption = Database['public']['Tables']['redemptions']['Row'];
type RedemptionInsert = Database['public']['Tables']['redemptions']['Insert'];
type RewardUpdate = Database['public']['Tables']['rewards']['Update'];
type RedemptionUpdate = Database['public']['Tables']['redemptions']['Update'];

export class SupabaseRewardsService {
  private supabase = createClient();

  async getAllRewards(
    filters?: {
      category?: string;
      teamId?: string;
      maxPoints?: number;
      availability?: 'available' | 'limited' | 'soldout';
    }
  ): Promise<Reward[]> {
    let query = this.supabase.from('rewards').select('*');

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.teamId) {
      query = query.eq('team_id', filters.teamId);
    }

    if (filters?.maxPoints) {
      query = query.lte('points_cost', filters.maxPoints);
    }

    if (filters?.availability) {
      query = query.eq('availability', filters.availability);
    }

    const { data, error } = await query.order('points_cost', { ascending: true });

    if (error) {
      console.error('Error fetching rewards:', error);
      return [];
    }

    return data || [];
  }

  async getRewardById(rewardId: string): Promise<Reward | null> {
    const { data, error } = await this.supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .single();

    if (error) {
      console.error('Error fetching reward:', error);
      return null;
    }

    return data;
  }

  async getAffordableRewards(userId: string): Promise<Reward[]> {
    // Get user's total points
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('total_points')
      .eq('id', userId)
      .single();

    const userPoints = (profile as any)?.total_points || 0;

    const { data, error } = await this.supabase
      .from('rewards')
      .select('*')
      .lte('points_cost', userPoints)
      .neq('availability', 'soldout')
      .order('points_cost', { ascending: false });

    if (error) {
      console.error('Error fetching affordable rewards:', error);
      return [];
    }

    return data || [];
  }

  async redeemReward(
    userId: string,
    rewardId: string
  ): Promise<{ redemption: Redemption | null; success: boolean; message: string }> {
    // Get reward details
    const reward = await this.getRewardById(rewardId);

    if (!reward) {
      return { redemption: null, success: false, message: 'Reward not found' };
    }

    if (reward.availability === 'soldout') {
      return { redemption: null, success: false, message: 'Reward is sold out' };
    }

    // Check user points
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('total_points')
      .eq('id', userId)
      .single();

    const userPoints = (profile as any)?.total_points || 0;

    if (userPoints < reward.points_cost) {
      return { redemption: null, success: false, message: 'Insufficient points' };
    }

    // Create redemption
    const redemptionData: RedemptionInsert = {
      user_id: userId,
      reward_id: rewardId,
      points_used: reward.points_cost,
      status: 'pending',
      redemption_code: this.generateRedemptionCode()
    };

    const { data: redemption, error } = await (this.supabase
      .from('redemptions') as any)
      .insert(redemptionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating redemption:', error);
      return { redemption: null, success: false, message: 'Failed to process redemption' };
    }

    // Deduct points (create transaction)
    const { SupabasePointsService } = await import('./SupabasePointsService');
    const pointsService = new SupabasePointsService();

    await pointsService.redeemPoints(
      userId,
      reward.points_cost,
      `Redeemed: ${reward.name}`,
      reward.team_id || undefined,
      { redemption_id: (redemption as any)?.id, reward_id: rewardId }
    );

    // Update reward stock if applicable
    if (reward.stock !== null && reward.stock > 0) {
      const newStock = reward.stock - 1;
      await (this.supabase
        .from('rewards') as any)
        .update({
          stock: newStock,
          availability: newStock === 0 ? 'soldout' : reward.availability
        })
        .eq('id', rewardId);
    }

    return {
      redemption,
      success: true,
      message: 'Reward redeemed successfully!'
    };
  }

  async getUserRedemptions(
    userId: string,
    status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  ): Promise<(Redemption & { reward: Reward })[]> {
    let query = this.supabase
      .from('redemptions')
      .select(`
        *,
        reward:rewards(*)
      `)
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user redemptions:', error);
      return [];
    }

    return data || [];
  }

  async updateRedemptionStatus(
    redemptionId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled',
    processedAt?: string
  ): Promise<Redemption | null> {
    const updateData: any = { status };

    if (processedAt) {
      updateData.processed_at = processedAt;
    }

    const { data, error } = await (this.supabase
      .from('redemptions') as any)
      .update(updateData)
      .eq('id', redemptionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating redemption status:', error);
      return null;
    }

    return data;
  }

  async getFeaturedRewards(limit = 6): Promise<Reward[]> {
    const { data, error } = await this.supabase
      .from('rewards')
      .select('*')
      .eq('availability', 'available')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured rewards:', error);
      return [];
    }

    return data || [];
  }

  private generateRedemptionCode(): string {
    const prefix = 'PR';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  // Real-time subscription to new rewards
  subscribeToNewRewards(callback: (payload: any) => void) {
    const subscription = this.supabase
      .channel('rewards:new')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rewards'
        },
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  // Real-time subscription to user redemptions
  subscribeToUserRedemptions(userId: string, callback: (payload: any) => void) {
    const subscription = this.supabase
      .channel(`redemptions:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'redemptions',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}