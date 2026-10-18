export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          avatar_url: string | null;
          plan: "free" | "premium";
          subscription_status: "none" | "active" | "canceled" | "past_due";
          expires_at: string | null;
          role: "user" | "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "premium";
          subscription_status?: "none" | "active" | "canceled" | "past_due";
          expires_at?: string | null;
          role?: "user" | "admin";
        };
        Update: {
          email?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "premium";
          subscription_status?: "none" | "active" | "canceled" | "past_due";
          expires_at?: string | null;
          role?: "user" | "admin";
        };
        Relationships: [];
      };
      templates: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: string;
          preview_image: string | null;
          component_key: string;
          is_active: boolean;
          is_premium: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["templates"]["Row"]> & {
          name: string;
          slug: string;
          component_key: string;
        };
        Update: Partial<Database["public"]["Tables"]["templates"]["Row"]>;
        Relationships: [];
      };
      invitations: {
        Row: {
          id: string;
          user_id: string;
          template_id: string;
          slug: string;
          groom_name: string;
          bride_name: string;
          event_type: string;
          event_date: string;
          event_time: string;
          venue_name: string;
          address: string;
          map_url: string | null;
          cover_image: string | null;
          music_url: string | null;
          show_countdown: boolean;
          show_rsvp: boolean;
          show_messages: boolean;
          show_gallery: boolean;
          show_music: boolean;
          published: boolean;
          visits_count: number;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
          settings: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id: string;
          slug: string;
          groom_name: string;
          bride_name: string;
          event_type?: string;
          event_date?: string;
          event_time?: string;
          venue_name?: string;
          address?: string;
          map_url?: string | null;
          cover_image?: string | null;
          music_url?: string | null;
          show_countdown?: boolean;
          show_rsvp?: boolean;
          show_messages?: boolean;
          show_gallery?: boolean;
          show_music?: boolean;
          published?: boolean;
          expires_at?: string | null;
          settings?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["invitations"]["Insert"]>;
        Relationships: [];
      };
      invitation_gallery: {
        Row: {
          id: string;
          invitation_id: string;
          image_url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          invitation_id: string;
          image_url: string;
          sort_order?: number;
        };
        Update: {
          image_url?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      rsvps: {
        Row: {
          id: string;
          invitation_id: string;
          guest_name: string;
          attending: boolean;
          created_at: string;
        };
        Insert: {
          invitation_id: string;
          guest_name: string;
          attending: boolean;
        };
        Update: {
          attending?: boolean;
          guest_name?: string;
        };
        Relationships: [];
      };
      subscription_payments: {
        Row: {
          id: string;
          user_id: string;
          amount_egp: number;
          wallet_number: string;
          sender_phone: string;
          transaction_ref: string;
          status: "pending" | "approved" | "rejected";
          created_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          user_id: string;
          amount_egp?: number;
          wallet_number?: string;
          sender_phone: string;
          transaction_ref: string;
          status?: "pending" | "approved" | "rejected";
        };
        Update: {
          status?: "pending" | "approved" | "rejected";
          reviewed_at?: string | null;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          invitation_id: string;
          guest_name: string;
          message: string;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          invitation_id: string;
          guest_name: string;
          message: string;
          approved?: boolean;
        };
        Update: {
          approved?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      touch_invitation_visit: {
        Args: { p_slug: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
  };
}
