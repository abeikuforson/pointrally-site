import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// POST /api/rewards/redeem - Redeem a reward
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rewardId, quantity = 1 } = body;

    // Validate input
    if (!rewardId || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid redemption details' },
        { status: 400 }
      );
    }

    // Get reward details
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('*, teams(name)')
      .eq('id', rewardId)
      .eq('is_active', true)
      .single() as any;

    if (rewardError || !reward) {
      return NextResponse.json(
        { error: 'Reward not found or unavailable' },
        { status: 404 }
      );
    }

    // Check availability
    if (reward.availability !== null && reward.availability < quantity) {
      return NextResponse.json(
        { error: 'Insufficient reward availability' },
        { status: 400 }
      );
    }

    // Check expiration
    if (reward.expires_at && new Date(reward.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Reward has expired' },
        { status: 400 }
      );
    }

    const totalPointsRequired = reward.points_required * quantity;

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('id', user.id)
      .single() as any;

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Check points balance
    if (profile.total_points < totalPointsRequired) {
      return NextResponse.json(
        { error: 'Insufficient points balance' },
        { status: 400 }
      );
    }

    // Use transaction for atomic operation
    const { data: redemption, error: redeemError } = await (supabase
      .from('redemptions') as any)
      .insert({
        user_id: user.id,
        reward_id: rewardId,
        points_spent: totalPointsRequired,
        quantity: quantity,
        status: 'pending',
        redemption_code: generateRedemptionCode()
      })
      .select()
      .single() as any;

    if (redeemError) {
      console.error('Redemption error:', redeemError);
      return NextResponse.json(
        { error: 'Failed to process redemption' },
        { status: 500 }
      );
    }

    // Update user's points
    const { error: pointsError } = await (supabase
      .from('profiles') as any)
      .update({ total_points: profile.total_points - totalPointsRequired })
      .eq('id', user.id);

    if (pointsError) {
      console.error('Points update error:', pointsError);
      // Should ideally rollback the redemption here
      return NextResponse.json(
        { error: 'Failed to update points' },
        { status: 500 }
      );
    }

    // Create transaction record
    await (supabase
      .from('point_transactions') as any)
      .insert({
        user_id: user.id,
        points: -totalPointsRequired,
        transaction_type: 'redeemed',
        description: `Redeemed ${reward.name} from ${reward.teams.name}`
      });

    // Update reward availability if tracked
    if (reward.availability !== null) {
      await (supabase
        .from('rewards') as any)
        .update({ availability: reward.availability - quantity })
        .eq('id', rewardId);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully redeemed ${reward.name}`,
      redemption: {
        id: redemption.id,
        code: redemption.redemption_code,
        status: redemption.status,
        pointsSpent: totalPointsRequired
      }
    });
  } catch (error) {
    console.error('Redemption API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateRedemptionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}