import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type UserTeamUpdate = Database['public']['Tables']['user_teams']['Update'];

export class SupabasePointsService {
  private supabase = createClient();

  async getTransactionHistory(
    userId: string,
    limit = 50,
    offset = 0
  ): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return data || [];
  }

  async getTransactionsByTeam(
    userId: string,
    teamId: string,
    limit = 50
  ): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching team transactions:', error);
      return [];
    }

    return data || [];
  }

  async createTransaction(
    transaction: Omit<TransactionInsert, 'id' | 'created_at'>
  ): Promise<Transaction | null> {
    const { data, error } = await (this.supabase
      .from('transactions') as any)
      .insert(transaction)
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw new Error(error.message);
    }

    // Update user team points balance if team_id is provided
    if (transaction.team_id && transaction.user_id) {
      await this.updateTeamPointsBalance(
        transaction.user_id,
        transaction.team_id,
        transaction.amount
      );
    }

    return data;
  }

  async earnPoints(
    userId: string,
    teamId: string,
    amount: number,
    description: string,
    metadata?: Record<string, unknown>
  ): Promise<Transaction | null> {
    const currentBalance = await this.getCurrentBalance(userId);
    const newBalance = currentBalance + amount;

    return this.createTransaction({
      user_id: userId,
      team_id: teamId,
      type: 'earned',
      amount: amount,
      balance_after: newBalance,
      description,
      metadata: (metadata as any) || null
    });
  }

  async redeemPoints(
    userId: string,
    amount: number,
    description: string,
    teamId?: string,
    metadata?: Record<string, unknown>
  ): Promise<Transaction | null> {
    const currentBalance = await this.getCurrentBalance(userId);

    if (currentBalance < amount) {
      throw new Error('Insufficient points balance');
    }

    const newBalance = currentBalance - amount;

    return this.createTransaction({
      user_id: userId,
      team_id: teamId || null,
      type: 'redeemed',
      amount: -amount,
      balance_after: newBalance,
      description,
      metadata: (metadata as any) || null
    });
  }

  async transferPoints(
    fromUserId: string,
    toUserId: string,
    amount: number,
    description?: string
  ): Promise<{ fromTransaction: Transaction | null; toTransaction: Transaction | null }> {
    const fromBalance = await this.getCurrentBalance(fromUserId);

    if (fromBalance < amount) {
      throw new Error('Insufficient points balance');
    }

    const toBalance = await this.getCurrentBalance(toUserId);

    // Create debit transaction
    const fromTransaction = await this.createTransaction({
      user_id: fromUserId,
      type: 'transferred',
      amount: -amount,
      balance_after: fromBalance - amount,
      description: description || `Points transferred to user`,
      metadata: { to_user_id: toUserId }
    });

    // Create credit transaction
    const toTransaction = await this.createTransaction({
      user_id: toUserId,
      type: 'transferred',
      amount: amount,
      balance_after: toBalance + amount,
      description: description || `Points received from user`,
      metadata: { from_user_id: fromUserId }
    });

    return { fromTransaction, toTransaction };
  }

  async expirePoints(
    userId: string,
    teamId: string,
    amount: number,
    reason: string
  ): Promise<Transaction | null> {
    const currentBalance = await this.getCurrentBalance(userId);
    const newBalance = Math.max(0, currentBalance - amount);

    return this.createTransaction({
      user_id: userId,
      team_id: teamId,
      type: 'expired',
      amount: -amount,
      balance_after: newBalance,
      description: reason,
      metadata: { expired_at: new Date().toISOString() }
    });
  }

  async getCurrentBalance(userId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('total_points')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching current balance:', error);
      return 0;
    }

    return (data as any).total_points || 0;
  }

  private async updateTeamPointsBalance(
    userId: string,
    teamId: string,
    pointsChange: number
  ): Promise<void> {
    const { data: currentTeam, error: fetchError } = await this.supabase
      .from('user_teams')
      .select('points_balance')
      .eq('user_id', userId)
      .eq('team_id', teamId)
      .single();

    if (fetchError) {
      console.error('Error fetching team balance:', fetchError);
      return;
    }

    const newBalance = ((currentTeam as any)?.points_balance || 0) + pointsChange;

    const { error: updateError } = await (this.supabase
      .from('user_teams') as any)
      .update({ points_balance: Math.max(0, newBalance) })
      .eq('user_id', userId)
      .eq('team_id', teamId);

    if (updateError) {
      console.error('Error updating team balance:', updateError);
    }

    // Update total points in profile
    await this.updateProfileTotalPoints(userId);
  }

  private async updateProfileTotalPoints(userId: string): Promise<void> {
    const { data: teams, error: teamsError } = await this.supabase
      .from('user_teams')
      .select('points_balance')
      .eq('user_id', userId);

    if (teamsError || !teams) {
      console.error('Error fetching team balances:', teamsError);
      return;
    }

    const totalPoints = teams.reduce((sum, team) => sum + ((team as any).points_balance || 0), 0);

    // Determine tier
    let tier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
    if (totalPoints >= 10000) tier = 'platinum';
    else if (totalPoints >= 5000) tier = 'gold';
    else if (totalPoints >= 1000) tier = 'silver';

    const { error: updateError } = await (this.supabase
      .from('profiles') as any)
      .update({ total_points: totalPoints, tier })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile points:', updateError);
    }
  }

  // Real-time subscription to transactions
  subscribeToTransactions(userId: string, callback: (payload: any) => void) {
    const subscription = this.supabase
      .channel(`transactions:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
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