import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// POST /api/teams/sync - Sync points from external team APIs
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { teamId } = body;

    // Get user's team connection with API credentials
    const { data: userTeam, error: teamError } = await supabase
      .from('user_teams')
      .select(`
        id,
        team_id,
        api_key,
        external_account_id,
        points,
        last_sync_at,
        teams (
          id,
          name,
          api_endpoint
        )
      `)
      .eq('user_id', user.id)
      .eq('team_id', teamId)
      .single() as any;

    if (teamError || !userTeam) {
      return NextResponse.json(
        { error: 'Team connection not found' },
        { status: 404 }
      );
    }

    if (!userTeam.api_key) {
      return NextResponse.json(
        { error: 'Team API key not configured' },
        { status: 400 }
      );
    }

    // Mock external API call (replace with actual team API integration)
    const mockExternalPoints = Math.floor(Math.random() * 500) + 100;
    const pointsDifference = mockExternalPoints;

    // Update user team points
    const { error: updateError } = await (supabase
      .from('user_teams') as any)
      .update({
        points: userTeam.points + pointsDifference,
        last_sync_at: new Date().toISOString()
      })
      .eq('id', userTeam.id) as any;

    if (updateError) {
      console.error('Error updating team points:', updateError);
      return NextResponse.json(
        { error: 'Failed to sync points' },
        { status: 500 }
      );
    }

    // Create transaction record
    const { error: transError } = await (supabase
      .from('point_transactions') as any)
      .insert({
        user_id: user.id,
        user_team_id: userTeam.id,
        points: pointsDifference,
        transaction_type: 'earned',
        description: `Points synced from ${userTeam.teams.name}`
      });

    if (transError) {
      console.error('Error creating transaction:', transError);
    }

    // Update total points in profile manually until RPC is created
    // Calculate new total from all user teams
    const { data: allUserTeams } = await supabase
      .from('user_teams')
      .select('points')
      .eq('user_id', user.id) as any;

    const newTotal = allUserTeams?.reduce((sum: number, team: any) => sum + team.points, 0) || 0;

    const { error: profileError } = await (supabase
      .from('profiles') as any)
      .update({ total_points: newTotal })
      .eq('id', user.id);

    if (profileError) {
      console.error('Error updating total points:', profileError);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${pointsDifference} points from ${userTeam.teams.name}`,
      pointsAdded: pointsDifference,
      newTeamTotal: userTeam.points + pointsDifference
    });
  } catch (error) {
    console.error('Teams sync API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}