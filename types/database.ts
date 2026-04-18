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
      allowed_users: {
        Row: {
          id: string
          created_at: string
          email: string
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
        }
      }
      folders: {
        Row: {
          id: string
          created_at: string
          name: string
          parent_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          parent_id?: string | null
        }
      }
      media: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          type: string
          size: number
          url: string
          storage_path: string
          folder_id: string | null
          hash: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          type: string
          size: number
          url: string
          storage_path: string
          folder_id?: string | null
          hash?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          type?: string
          size?: number
          url?: string
          storage_path?: string
          folder_id?: string | null
          hash?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          message: string
          is_read: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          message: string
          is_read?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          message?: string
          is_read?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string | null
          title: string | null
          bio: string | null
          avatar_url: string | null
          resume_url: string | null
          skills: string[] | null
          social_links: Json | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          name?: string | null
          title?: string | null
          bio?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          social_links?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          title?: string | null
          bio?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          social_links?: Json | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          description: string | null
          content: string | null
          category: string | null
          tech_stack: string[] | null
          github_url: string | null
          live_url: string | null
          app_store_url: string | null
          play_store_url: string | null
          status: string
          is_featured: boolean
          featured_image: string | null
          media_ids: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          description?: string | null
          content?: string | null
          category?: string | null
          tech_stack?: string[] | null
          github_url?: string | null
          live_url?: string | null
          app_store_url?: string | null
          play_store_url?: string | null
          status?: string
          is_featured?: boolean
          featured_image?: string | null
          media_ids?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          description?: string | null
          content?: string | null
          category?: string | null
          tech_stack?: string[] | null
          github_url?: string | null
          live_url?: string | null
          app_store_url?: string | null
          play_store_url?: string | null
          status?: string
          is_featured?: boolean
          featured_image?: string | null
          media_ids?: string[] | null
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          summary: string | null
          content: string | null
          status: string
          published_at: string | null
          featured_image_id: string | null
          author_id: string | null
          visibility: string
          category: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          summary?: string | null
          content?: string | null
          status?: string
          published_at?: string | null
          featured_image_id?: string | null
          author_id?: string | null
          visibility?: string
          category?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          summary?: string | null
          content?: string | null
          status?: string
          published_at?: string | null
          featured_image_id?: string | null
          author_id?: string | null
          visibility?: string
          category?: string | null
          tags?: string[] | null
        }
      }
      settings: {
        Row: {
          id: string
          updated_at: string
          site_title: string | null
          site_description: string | null
          logo: string | null
          seo: Json | null
        }
        Insert: {
          id?: string
          updated_at?: string
          site_title?: string | null
          site_description?: string | null
          logo?: string | null
          seo?: Json | null
        }
        Update: {
          id?: string
          updated_at?: string
          site_title?: string | null
          site_description?: string | null
          logo?: string | null
          seo?: Json | null
        }
      }
      comments: {
        Row: {
          id: string
          created_at: string
          post_id: string | null
          project_id: string | null
          author_name: string | null
          author_email: string | null
          content: string
          is_approved: boolean
          parent_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          post_id?: string | null
          project_id?: string | null
          author_name?: string | null
          author_email?: string | null
          content: string
          is_approved?: boolean
          parent_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          post_id?: string | null
          project_id?: string | null
          author_name?: string | null
          author_email?: string | null
          content?: string
          is_approved?: boolean
          parent_id?: string | null
        }
      }
    }
  }
}
