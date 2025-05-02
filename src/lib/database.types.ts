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
          name: string
          avatar_url: string | null
          role: string
          created_at: string | null
          updated_at: string | null
          location: Json | null
          phone: string | null
          bio: string | null
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          role?: string
          created_at?: string | null
          updated_at?: string | null
          location?: Json | null
          phone?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          role?: string
          created_at?: string | null
          updated_at?: string | null
          location?: Json | null
          phone?: string | null
          bio?: string | null
        }
      }
      restaurant_managers: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          description: string
          cuisine: string
          price_range: number
          address: Json
          contact_info: Json
          hours: Json
          images: string[]
          manager_id: string | null
          is_approved: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          cuisine: string
          price_range: number
          address: Json
          contact_info: Json
          hours: Json
          images?: string[]
          manager_id?: string | null
          is_approved?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          cuisine?: string
          price_range?: number
          address?: Json
          contact_info?: Json
          hours?: Json
          images?: string[]
          manager_id?: string | null
          is_approved?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          restaurant_id: string
          user_id: string
          date: string
          time: string
          party_size: number
          status: string
          special_requests: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          restaurant_id: string
          user_id: string
          date: string
          time: string
          party_size: number
          status: string
          special_requests?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          restaurant_id?: string
          user_id?: string
          date?: string
          time?: string
          party_size?: number
          status?: string
          special_requests?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          restaurant_id: string
          user_id: string
          rating: number
          comment: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          restaurant_id: string
          user_id: string
          rating: number
          comment: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          restaurant_id?: string
          user_id?: string
          rating?: number
          comment?: string
          created_at?: string | null
          updated_at?: string | null
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