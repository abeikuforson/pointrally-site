import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// POST /api/points/transfer - Transfer points between users
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientEmail, amount, note } = body;

    // Validate input
    if (!recipientEmail || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid transfer details' },
        { status: 400 }
      );
    }

    // Get sender's profile
    const { data: senderProfile, error: senderError } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('id', user.id)
      .single() as any;

    if (senderError || !senderProfile) {
      return NextResponse.json(
        { error: 'Sender profile not found' },
        { status: 404 }
      );
    }

    // Check sufficient balance
    if (senderProfile.total_points < amount) {
      return NextResponse.json(
        { error: 'Insufficient points balance' },
        { status: 400 }
      );
    }

    // Get recipient's profile
    const { data: recipientUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', recipientEmail)
      .single() as any;

    if (!recipientUser) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // For now, manually handle the transfer until RPC function is created
    // This should be replaced with a proper database transaction

    // Deduct from sender
    const { error: deductError } = await (supabase
      .from('profiles') as any)
      .update({ total_points: senderProfile.total_points - amount })
      .eq('id', user.id);

    if (deductError) {
      console.error('Transfer deduct error:', deductError);
      return NextResponse.json(
        { error: 'Transfer failed' },
        { status: 500 }
      );
    }

    // Add to recipient
    const { data: recipientProfile } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('id', recipientUser.id)
      .single() as any;

    const { error: addError } = await (supabase
      .from('profiles') as any)
      .update({ total_points: (recipientProfile?.total_points || 0) + amount })
      .eq('id', recipientUser.id);

    const transferError = addError;

    if (transferError) {
      console.error('Transfer error:', transferError);
      return NextResponse.json(
        { error: 'Transfer failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully transferred ${amount} points to ${recipientEmail}`
    });
  } catch (error) {
    console.error('Points transfer API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}