import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/rewards - Get available rewards
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);

    const teamId = searchParams.get('teamId');
    const category = searchParams.get('category');
    const maxPoints = searchParams.get('maxPoints');

    // Build query
    let query = supabase
      .from('rewards')
      .select(`
        id,
        name,
        description,
        points_required,
        category,
        image_url,
        availability,
        expires_at,
        teams (
          id,
          name,
          logo_url
        )
      `)
      .eq('is_active', true);

    // Apply filters
    if (teamId) {
      query = query.eq('team_id', teamId);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (maxPoints) {
      query = query.lte('points_required', parseInt(maxPoints));
    }

    // Order by points required
    query = query.order('points_required', { ascending: true });

    const { data: rewards, error } = await query as any;

    if (error) {
      console.error('Error fetching rewards:', error);
      return NextResponse.json(
        { error: 'Failed to fetch rewards' },
        { status: 500 }
      );
    }

    return NextResponse.json(rewards || []);
  } catch (error) {
    console.error('Rewards API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}