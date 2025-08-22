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
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      apartments: {
        Row: {
          id: string
          user_id: string
          size: number
          rooms: number
          pets_allowed: boolean
          smoking_allowed: boolean
          has_parking: boolean
          has_balcony: boolean
          cost: number
          arnona: number
          city: string
          street: string
          neighborhood: string
          floor: number
          has_elevator: boolean
          bomb_shelter: string
          rental_type: string
          phone_number: string
          entry_date: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          size: number
          rooms: number
          pets_allowed?: boolean
          smoking_allowed?: boolean
          has_parking?: boolean
          has_balcony?: boolean
          cost: number
          arnona?: number
          city: string
          street: string
          neighborhood: string
          floor?: number
          has_elevator?: boolean
          bomb_shelter?: string
          rental_type: string
          phone_number: string
          entry_date: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          size?: number
          rooms?: number
          pets_allowed?: boolean
          smoking_allowed?: boolean
          has_parking?: boolean
          has_balcony?: boolean
          cost?: number
          arnona?: number
          city?: string
          street?: string
          neighborhood?: string
          floor?: number
          has_elevator?: boolean
          bomb_shelter?: string
          rental_type?: string
          phone_number?: string
          entry_date?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      apartment_images: {
        Row: {
          id: string
          apartment_id: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          apartment_id: string
          url: string
          created_at?: string
        }
        Update: {
          id?: string
          apartment_id?: string
          url?: string
          created_at?: string
        }
      }
      apartment_furniture: {
        Row: {
          id: string
          apartment_id: string
          item: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          apartment_id: string
          item: string
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          apartment_id?: string
          item?: string
          quantity?: number
          created_at?: string
        }
      }
      apartment_likes: {
        Row: {
          id: string
          apartment_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          apartment_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          apartment_id?: string
          user_id?: string
          created_at?: string
        }
      }
      open_houses: {
        Row: {
          id: string
          apartment_id: string
          date: string
          time: string
          created_at: string
        }
        Insert: {
          id?: string
          apartment_id: string
          date: string
          time: string
          created_at?: string
        }
        Update: {
          id?: string
          apartment_id?: string
          date?: string
          time?: string
          created_at?: string
        }
      }
      open_house_registrations: {
        Row: {
          id: string
          open_house_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          open_house_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          open_house_id?: string
          user_id?: string
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