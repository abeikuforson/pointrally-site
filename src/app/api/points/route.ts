import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/points - Get user's points balance and history
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's profile with points
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_points, tier')
      .eq('id', user.id)
      .single() as any;

    if (profileError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get points transactions history
    const { data: transactions, error: transError } = await supabase
      .from('point_transactions')
      .select(`
        id,
        points,
        transaction_type,
        description,
        created_at,
        user_teams (
          teams (
            id,
            name,
            logo_url
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50) as any;

    if (transError) {
      console.error('Error fetching transactions:', transError);
    }

    return NextResponse.json({
      balance: profile.total_points,
      tier: profile.tier,
      transactions: transactions || []
    });
  } catch (error) {
    console.error('Points API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}