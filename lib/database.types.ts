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
          role: 'patient' | 'doctor'
          full_name: string | null
          phone_number: string | null
          date_of_birth: string | null
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'patient' | 'doctor'
          full_name?: string | null
          phone_number?: string | null
          date_of_birth?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'patient' | 'doctor'
          full_name?: string | null
          phone_number?: string | null
          date_of_birth?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      doctors: {
        Row: {
          id: string
          specialization: string
          experience_years: number
          consultation_fee: number
          available_days: string[]
          available_hours: Json
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          specialization: string
          experience_years?: number
          consultation_fee?: number
          available_days?: string[]
          available_hours?: Json
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          specialization?: string
          experience_years?: number
          consultation_fee?: number
          available_days?: string[]
          available_hours?: Json
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}