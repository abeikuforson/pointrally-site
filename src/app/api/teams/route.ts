import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/teams - Get all available teams or user's connected teams
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const userTeamsOnly = searchParams.get('connected') === 'true';

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userTeamsOnly) {
      // Get user's connected teams
      const { data: userTeams, error } = await supabase
        .from('user_teams')
        .select(`
          id,
          points,
          status,
          connected_at,
          teams (
            id,
            name,
            sport,
            city,
            logo_url,
            primary_color,
            secondary_color
          )
        `)
        .eq('user_id', user.id)
        .order('connected_at', { ascending: false }) as any;

      if (error) {
        console.error('Error fetching user teams:', error);
        return NextResponse.json(
          { error: 'Failed to fetch teams' },
          { status: 500 }
        );
      }

      return NextResponse.json(userTeams || []);
    } else {
      // Get all available teams
      const { data: teams, error } = await supabase
        .from('teams')
        .select('*')
        .order('name') as any;

      if (error) {
        console.error('Error fetching teams:', error);
        return NextResponse.json(
          { error: 'Failed to fetch teams' },
          { status: 500 }
        );
      }

      return NextResponse.json(teams || []);
    }
  } catch (error) {
    console.error('Teams API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/teams - Connect a new team
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { teamId, apiKey, accountId } = body;

    // Validate input
    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    // Check if team exists
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name')
      .eq('id', teamId)
      .single() as any;

    if (teamError || !team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Check if already connected
    const { data: existing } = await supabase
      .from('user_teams')
      .select('id')
      .eq('user_id', user.id)
      .eq('team_id', teamId)
      .single() as any;

    if (existing) {
      return NextResponse.json(
        { error: 'Team already connected' },
        { status: 409 }
      );
    }

    // Create user-team connection
    const { data: userTeam, error: connectError } = await (supabase
      .from('user_teams') as any)
      .insert({
        user_id: user.id,
        team_id: teamId,
        points: 0,
        status: apiKey ? 'connected' : 'pending',
        api_key: apiKey || null,
        external_account_id: accountId || null
      })
      .select()
      .single() as any;

    if (connectError) {
      console.error('Error connecting team:', connectError);
      return NextResponse.json(
        { error: 'Failed to connect team' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully connected to ${team.name}`,
      userTeam
    });
  } catch (error) {
    console.error('Teams connect API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}