export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          total_points: number
          tier: 'bronze' | 'silver' | 'gold' | 'platinum'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          total_points?: number
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          total_points?: number
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          code: string
          sport: 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'MLS'
          logo_url: string | null
          city: string
          primary_color: string
          secondary_color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          sport: 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'MLS'
          logo_url?: string | null
          city: string
          primary_color: string
          secondary_color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          sport?: 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'MLS'
          logo_url?: string | null
          city?: string
          primary_color?: string
          secondary_color?: string | null
          created_at?: string
        }
      }
      user_teams: {
        Row: {
          id: string
          user_id: string
          team_id: string
          points_balance: number
          connected_at: string
          last_synced_at: string | null
          api_credentials: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          team_id: string
          points_balance?: number
          connected_at?: string
          last_synced_at?: string | null
          api_credentials?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          team_id?: string
          points_balance?: number
          connected_at?: string
          last_synced_at?: string | null
          api_credentials?: Json | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          team_id: string | null
          type: 'earned' | 'redeemed' | 'transferred' | 'expired'
          amount: number
          balance_after: number
          description: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          team_id?: string | null
          type: 'earned' | 'redeemed' | 'transferred' | 'expired'
          amount: number
          balance_after: number
          description: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          team_id?: string | null
          type?: 'earned' | 'redeemed' | 'transferred' | 'expired'
          amount?: number
          balance_after?: number
          description?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          name: string
          description: string
          category: 'tickets' | 'merchandise' | 'experiences' | 'food' | 'digital'
          points_cost: number
          image_url: string | null
          team_id: string | null
          availability: 'available' | 'limited' | 'soldout'
          stock: number | null
          expires_at: string | null
          terms: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: 'tickets' | 'merchandise' | 'experiences' | 'food' | 'digital'
          points_cost: number
          image_url?: string | null
          team_id?: string | null
          availability?: 'available' | 'limited' | 'soldout'
          stock?: number | null
          expires_at?: string | null
          terms?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: 'tickets' | 'merchandise' | 'experiences' | 'food' | 'digital'
          points_cost?: number
          image_url?: string | null
          team_id?: string | null
          availability?: 'available' | 'limited' | 'soldout'
          stock?: number | null
          expires_at?: string | null
          terms?: string[] | null
          created_at?: string
        }
      }
      redemptions: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          points_used: number
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          redemption_code: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          points_used: number
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          redemption_code?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          points_used?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          redemption_code?: string | null
          processed_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}