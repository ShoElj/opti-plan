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
    PostgrestVersion: "14.17"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bank_connection_tokens: {
        Row: {
          connected_account_id: string
          created_at: string
          encrypted_access_token: string
          encrypted_refresh_token: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_account_id: string
          created_at?: string
          encrypted_access_token: string
          encrypted_refresh_token?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_account_id?: string
          created_at?: string
          encrypted_access_token?: string
          encrypted_refresh_token?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_connection_tokens_connected_account_id_fkey"
            columns: ["connected_account_id"]
            isOneToOne: true
            referencedRelation: "connected_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_occurrences: {
        Row: {
          bill_id: string
          created_at: string
          due_date: string
          expected_amount: number
          id: string
          period_key: string | null
          status: string
          user_id: string
        }
        Insert: {
          bill_id: string
          created_at?: string
          due_date: string
          expected_amount: number
          id?: string
          period_key?: string | null
          status?: string
          user_id: string
        }
        Update: {
          bill_id?: string
          created_at?: string
          due_date?: string
          expected_amount?: number
          id?: string
          period_key?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bill_occurrence_parent"
            columns: ["bill_id", "user_id"]
            isOneToOne: false
            referencedRelation: "tracked_recurring_expenses"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      bill_payment_links: {
        Row: {
          bill_occurrence_id: string
          created_at: string
          id: string
          payment_date: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          bill_occurrence_id: string
          created_at?: string
          id?: string
          payment_date?: string
          transaction_id: string
          user_id: string
        }
        Update: {
          bill_occurrence_id?: string
          created_at?: string
          id?: string
          payment_date?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bill_payment_occ"
            columns: ["bill_occurrence_id", "user_id"]
            isOneToOne: false
            referencedRelation: "bill_occurrences"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "fk_bill_payment_tx"
            columns: ["transaction_id", "user_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      connected_accounts: {
        Row: {
          account_name: string
          connection_status: string
          consent_expires_at: string | null
          consent_granted_at: string
          created_at: string
          currency_code: string
          id: string
          institution_name: string
          last_successful_sync_at: string | null
          last_sync_cursor: string | null
          masked_account_identifier: string
          provider: string
          provider_account_reference: string
          provider_connection_reference: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          connection_status?: string
          consent_expires_at?: string | null
          consent_granted_at?: string
          created_at?: string
          currency_code?: string
          id?: string
          institution_name: string
          last_successful_sync_at?: string | null
          last_sync_cursor?: string | null
          masked_account_identifier: string
          provider?: string
          provider_account_reference: string
          provider_connection_reference: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          connection_status?: string
          consent_expires_at?: string | null
          consent_granted_at?: string
          created_at?: string
          currency_code?: string
          id?: string
          institution_name?: string
          last_successful_sync_at?: string | null
          last_sync_cursor?: string | null
          masked_account_identifier?: string
          provider?: string
          provider_account_reference?: string
          provider_connection_reference?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goal_contributions: {
        Row: {
          created_at: string
          goal_id: string
          id: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_id: string
          id?: string
          transaction_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_id?: string
          id?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_goal_contrib_goal"
            columns: ["goal_id", "user_id"]
            isOneToOne: false
            referencedRelation: "savings_goals"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "fk_goal_contrib_tx"
            columns: ["transaction_id", "user_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      monthly_check_ins: {
        Row: {
          completed_at: string
          debt_snapshot: number
          expense_snapshot: number
          id: string
          income_snapshot: number
          money_left_snapshot: number
          period_key: string
          persona_id: string
          savings_snapshot: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          debt_snapshot: number
          expense_snapshot: number
          id?: string
          income_snapshot: number
          money_left_snapshot: number
          period_key: string
          persona_id: string
          savings_snapshot: number
          user_id: string
        }
        Update: {
          completed_at?: string
          debt_snapshot?: number
          expense_snapshot?: number
          id?: string
          income_snapshot?: number
          money_left_snapshot?: number
          period_key?: string
          persona_id?: string
          savings_snapshot?: number
          user_id?: string
        }
        Relationships: []
      }
      monthly_spending_plans: {
        Row: {
          created_at: string
          currency_code: string
          id: string
          period_key: string
          savings_target: number | null
          spending_limit: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency_code?: string
          id?: string
          period_key: string
          savings_target?: number | null
          spending_limit: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          id?: string
          period_key?: string
          savings_target?: number | null
          spending_limit?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_webhook_events: {
        Row: {
          event_id: string
          id: string
          payload: Json
          processed_at: string
          provider: string
        }
        Insert: {
          event_id: string
          id?: string
          payload: Json
          processed_at?: string
          provider?: string
        }
        Update: {
          event_id?: string
          id?: string
          payload?: Json
          processed_at?: string
          provider?: string
        }
        Relationships: []
      }
      product_subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          currency_code: string
          id: string
          persona: string
          theme: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code?: string
          id: string
          persona?: string
          theme?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          id?: string
          persona?: string
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          created_at: string
          currency_code: string
          id: string
          name: string
          status: string
          target_amount: number
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency_code?: string
          id?: string
          name: string
          status?: string
          target_amount: number
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          id?: string
          name?: string
          status?: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tracked_recurring_expenses: {
        Row: {
          category: string
          created_at: string
          currency_code: string
          due_day_of_month: number | null
          expected_amount: number
          frequency: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          currency_code?: string
          due_day_of_month?: number | null
          expected_amount: number
          frequency?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          currency_code?: string
          due_day_of_month?: number | null
          expected_amount?: number
          frequency?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          classification: string
          classification_status: string
          client_mutation_id: string | null
          connected_account_id: string | null
          created_at: string
          currency_code: string
          external_transaction_reference: string | null
          id: string
          imported_at: string | null
          note: string | null
          provider_reference: string | null
          source_type: string
          transaction_date: string
          type: string
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          amount: number
          category: string
          classification: string
          classification_status?: string
          client_mutation_id?: string | null
          connected_account_id?: string | null
          created_at?: string
          currency_code?: string
          external_transaction_reference?: string | null
          id?: string
          imported_at?: string | null
          note?: string | null
          provider_reference?: string | null
          source_type?: string
          transaction_date?: string
          type: string
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          amount?: number
          category?: string
          classification?: string
          classification_status?: string
          client_mutation_id?: string | null
          connected_account_id?: string | null
          created_at?: string
          currency_code?: string
          external_transaction_reference?: string | null
          id?: string
          imported_at?: string | null
          note?: string | null
          provider_reference?: string | null
          source_type?: string
          transaction_date?: string
          type?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_connected_account_id_fkey"
            columns: ["connected_account_id"]
            isOneToOne: false
            referencedRelation: "connected_accounts"
            referencedColumns: ["id"]
          },
        ]
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
