import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/profile - Get user profile
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single() as any;

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get connected teams count
    const { count: teamsCount } = await supabase
      .from('user_teams')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'connected') as any;

    // Get recent achievements
    const { data: achievements } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false })
      .limit(5) as any;

    return NextResponse.json({
      ...profile,
      email: user.email,
      connectedTeams: teamsCount || 0,
      recentAchievements: achievements || []
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate and sanitize input
    const allowedFields = ['display_name', 'photo_url', 'bio', 'preferences'];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update profile
    updates.updated_at = new Date().toISOString();

    const { data: profile, error: updateError } = await (supabase
      .from('profiles') as any)
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Update auth metadata if display_name changed
    if (updates.display_name) {
      await supabase.auth.updateUser({
        data: { display_name: updates.display_name }
      });
    }

    return NextResponse.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Profile update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/profile - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify deletion request (could add additional verification like password confirmation)
    const body = await request.json();
    if (!body.confirmDelete) {
      return NextResponse.json(
        { error: 'Deletion not confirmed' },
        { status: 400 }
      );
    }

    // Delete user data (cascade delete should handle related records)
    const { error: deleteError } = await (supabase
      .from('profiles') as any)
      .delete()
      .eq('id', user.id);

    if (deleteError) {
      console.error('Profile deletion error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete profile' },
        { status: 500 }
      );
    }

    // Delete auth user
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
      user.id
    );

    if (authDeleteError) {
      console.error('Auth deletion error:', authDeleteError);
    }

    return NextResponse.json({
      success: true,
      message: 'Account successfully deleted'
    });
  } catch (error) {
    console.error('Profile delete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}