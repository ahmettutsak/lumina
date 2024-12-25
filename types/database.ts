export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "admin" | "user";
          status: "active" | "inactive";
          join_date: string;
          last_login: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          email: string;
          role?: "admin" | "user";
          status?: "active" | "inactive";
        };
        Update: {
          name?: string;
          email?: string;
          role?: "admin" | "user";
          status?: "active" | "inactive";
          last_login?: string;
        };
      };
      artworks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          artist: string;
          price: number;
          image_url: string | null;
          category: "abstract" | "landscape" | "portrait" | "modern" | "other";
          status: "available" | "sold" | "reserved";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string;
          artist: string;
          price: number;
          image_url?: string;
          category: "abstract" | "landscape" | "portrait" | "modern" | "other";
          status?: "available" | "sold" | "reserved";
        };
        Update: {
          title?: string;
          description?: string;
          artist?: string;
          price?: number;
          image_url?: string;
          category?: "abstract" | "landscape" | "portrait" | "modern" | "other";
          status?: "available" | "sold" | "reserved";
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          artwork_id: string;
          amount: number;
          status: "pending" | "completed" | "cancelled";
          payment_method: string | null;
          transaction_id: string | null;
          shipping_address: {
            street: string;
            city: string;
            country: string;
            postal_code: string;
          } | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          artwork_id: string;
          amount: number;
          status?: "pending" | "completed" | "cancelled";
          payment_method?: string;
          transaction_id?: string;
          shipping_address?: {
            street: string;
            city: string;
            country: string;
            postal_code: string;
          };
        };
        Update: {
          status?: "pending" | "completed" | "cancelled";
          payment_method?: string;
          transaction_id?: string;
          shipping_address?: {
            street: string;
            city: string;
            country: string;
            postal_code: string;
          };
        };
      };
    };
  };
}
