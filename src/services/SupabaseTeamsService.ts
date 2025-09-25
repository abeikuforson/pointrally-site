import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase.types';

type Team = Database['public']['Tables']['teams']['Row'];
type UserTeam = Database['public']['Tables']['user_teams']['Row'];
type UserTeamInsert = Database['public']['Tables']['user_teams']['Insert'];
type UserTeamUpdate = Database['public']['Tables']['user_teams']['Update'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class SupabaseTeamsService {
  private supabase = createClient();

  async getAllTeams(): Promise<Team[]> {
    const { data, error } = await this.supabase
      .from('teams')
      .select('*')
      .order('sport', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }

    return data || [];
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    const { data, error } = await this.supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (error) {
      console.error('Error fetching team:', error);
      return null;
    }

    return data;
  }

  async getTeamsBySport(sport: 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'MLS'): Promise<Team[]> {
    const { data, error } = await this.supabase
      .from('teams')
      .select('*')
      .eq('sport', sport)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching teams by sport:', error);
      return [];
    }

    return data || [];
  }

  async getUserTeams(userId: string): Promise<(UserTeam & { team: Team })[]> {
    const { data, error } = await this.supabase
      .from('user_teams')
      .select(`
        *,
        team:teams(*)
      `)
      .eq('user_id', userId)
      .order('connected_at', { ascending: false });

    if (error) {
      console.error('Error fetching user teams:', error);
      return [];
    }

    return data || [];
  }

  async connectTeam(userId: string, teamId: string, apiCredentials?: Record<string, unknown>): Promise<UserTeam | null> {
    const { data, error } = await (this.supabase
      .from('user_teams') as any)
      .insert({
        user_id: userId,
        team_id: teamId,
        points_balance: 0,
        api_credentials: apiCredentials || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error connecting team:', error);
      throw new Error(error.message);
    }

    return data;
  }

  async disconnectTeam(userId: string, teamId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('user_teams')
      .delete()
      .eq('user_id', userId)
      .eq('team_id', teamId);

    if (error) {
      console.error('Error disconnecting team:', error);
      return false;
    }

    return true;
  }

  async syncTeamPoints(userId: string, teamId: string, newPointsBalance: number): Promise<UserTeam | null> {
    const { data, error } = await (this.supabase
      .from('user_teams') as any)
      .update({
        points_balance: newPointsBalance,
        last_synced_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('team_id', teamId)
      .select()
      .single();

    if (error) {
      console.error('Error syncing team points:', error);
      return null;
    }

    // Update total points in profile
    await this.updateUserTotalPoints(userId);

    return data;
  }

  async getTotalUserPoints(userId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('user_teams')
      .select('points_balance')
      .eq('user_id', userId);

    if (error || !data) {
      console.error('Error calculating total points:', error);
      return 0;
    }

    return data.reduce((total, team) => total + ((team as any).points_balance || 0), 0);
  }

  private async updateUserTotalPoints(userId: string): Promise<void> {
    const totalPoints = await this.getTotalUserPoints(userId);

    // Determine tier based on total points
    let tier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
    if (totalPoints >= 10000) tier = 'platinum';
    else if (totalPoints >= 5000) tier = 'gold';
    else if (totalPoints >= 1000) tier = 'silver';

    const { error } = await (this.supabase
      .from('profiles') as any)
      .update({
        total_points: totalPoints,
        tier: tier
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user total points:', error);
    }
  }

  // Real-time subscription to user teams
  subscribeToUserTeams(userId: string, callback: (payload: any) => void) {
    const subscription = this.supabase
      .channel(`user_teams:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_teams',
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