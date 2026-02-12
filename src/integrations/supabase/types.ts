export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      case_studies: {
        Row: {
          client_name: string | null
          created_at: string
          display_order: number | null
          id: string
          problem: string
          result: string
          solution: string
          title: string
          updated_at: string
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          problem: string
          result: string
          solution: string
          title: string
          updated_at?: string
        }
        Update: {
          client_name?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          problem?: string
          result?: string
          solution?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          page_source: string | null
          phone: string | null
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          page_source?: string | null
          phone?: string | null
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          page_source?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      hero_settings: {
        Row: {
          cta_primary_link: string | null
          cta_primary_text: string | null
          cta_secondary_link: string | null
          cta_secondary_text: string | null
          description: string | null
          heading: string
          heading_highlight: string
          heading_line2: string
          id: string
          overlay_opacity: number | null
          tagline: string | null
          updated_at: string
          video_enabled: boolean
          video_url: string | null
        }
        Insert: {
          cta_primary_link?: string | null
          cta_primary_text?: string | null
          cta_secondary_link?: string | null
          cta_secondary_text?: string | null
          description?: string | null
          heading?: string
          heading_highlight?: string
          heading_line2?: string
          id?: string
          overlay_opacity?: number | null
          tagline?: string | null
          updated_at?: string
          video_enabled?: boolean
          video_url?: string | null
        }
        Update: {
          cta_primary_link?: string | null
          cta_primary_text?: string | null
          cta_secondary_link?: string | null
          cta_secondary_text?: string | null
          description?: string | null
          heading?: string
          heading_highlight?: string
          heading_line2?: string
          id?: string
          overlay_opacity?: number | null
          tagline?: string | null
          updated_at?: string
          video_enabled?: boolean
          video_url?: string | null
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          contact_email: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_admin_listing: boolean
          is_featured: boolean
          price: number
          status: Database["public"]["Enums"]["listing_status"]
          submitted_by_user_id: string | null
          thumbnail_url: string | null
          updated_at: string
          website_name: string
          website_url: string
        }
        Insert: {
          contact_email: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_admin_listing?: boolean
          is_featured?: boolean
          price: number
          status?: Database["public"]["Enums"]["listing_status"]
          submitted_by_user_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          website_name: string
          website_url: string
        }
        Update: {
          contact_email?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_admin_listing?: boolean
          is_featured?: boolean
          price?: number
          status?: Database["public"]["Enums"]["listing_status"]
          submitted_by_user_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          website_name?: string
          website_url?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          created_at: string
          file_size: number | null
          file_type: string | null
          id: string
          name: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_enabled: boolean
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_enabled?: boolean
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_enabled?: boolean
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: Database["public"]["Enums"]["project_category"]
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          name: string
          project_link: string | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["project_category"]
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          name: string
          project_link?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["project_category"]
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          name?: string
          project_link?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          cta_text: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_enabled: boolean
          price: string | null
          tag: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_text?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_enabled?: boolean
          price?: string | null
          tag?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_text?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_enabled?: boolean
          price?: string | null
          tag?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          client_company: string | null
          client_name: string
          client_role: string | null
          created_at: string
          display_order: number | null
          id: string
          is_featured: boolean | null
          review: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          client_company?: string | null
          client_name: string
          client_role?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          review: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          client_company?: string | null
          client_name?: string
          client_role?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          review?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      listing_status: "pending" | "approved" | "rejected"
      project_category: "web-design" | "branding" | "e-commerce" | "ui-ux"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      listing_status: ["pending", "approved", "rejected"],
      project_category: ["web-design", "branding", "e-commerce", "ui-ux"],
    },
  },
} as const
