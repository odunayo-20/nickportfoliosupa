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
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_email: string | null
          author_name: string | null
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          parent_id: string | null
          post_id: string | null
          project_id: string | null
        }
        Insert: {
          author_email?: string | null
          author_name?: string | null
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          parent_id?: string | null
          post_id?: string | null
          project_id?: string | null
        }
        Update: {
          author_email?: string | null
          author_name?: string | null
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          parent_id?: string | null
          post_id?: string | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      folders: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          }
        ]
      }
      media: {
        Row: {
          created_at: string
          folder_id: string | null
          hash: string | null
          id: string
          name: string
          size: number
          storage_path: string
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          folder_id?: string | null
          hash?: string | null
          id?: string
          name: string
          size: number
          storage_path: string
          type: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          folder_id?: string | null
          hash?: string | null
          id?: string
          name?: string
          size?: number
          storage_path?: string
          type?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          cover_image_id: string | null
          created_at: string
          detail_image_id: string | null
          featured_image_id: string | null
          id: string
          published_at: string | null
          slug: string
          status: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          visibility: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image_id?: string | null
          created_at?: string
          detail_image_id?: string | null
          featured_image_id?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          visibility?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image_id?: string | null
          created_at?: string
          detail_image_id?: string | null
          featured_image_id?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_featured_image_id_fkey"
            columns: ["featured_image_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_cover_image_id_fkey"
            columns: ["cover_image_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_detail_image_id_fkey"
            columns: ["detail_image_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          is_owner: boolean | null
          name: string | null
          resume_name: string | null
          resume_url: string | null
          skills: string[] | null
          social_links: Json | null
          title: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id: string
          is_owner?: boolean | null
          name?: string | null
          resume_name?: string | null
          resume_url?: string | null
          skills?: string[] | null
          social_links?: Json | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_owner?: boolean | null
          name?: string | null
          resume_name?: string | null
          resume_url?: string | null
          skills?: string[] | null
          social_links?: Json | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          app_store_url: string | null
          category: string | null
          content: string | null
          created_at: string
          description: string | null
          featured_image: string | null
          github_url: string | null
          id: string
          is_featured: boolean | null
          live_url: string | null
          media_ids: string[] | null
          play_store_url: string | null
          slug: string
          status: string | null
          tech_stack: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          app_store_url?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          live_url?: string | null
          media_ids?: string[] | null
          play_store_url?: string | null
          slug: string
          status?: string | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          app_store_url?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean | null
          live_url?: string | null
          media_ids?: string[] | null
          play_store_url?: string | null
          slug?: string
          status?: string | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_featured_image_fkey"
            columns: ["featured_image"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          }
        ]
      }
      settings: {
        Row: {
          id: string
          logo: string | null
          seo: Json | null
          site_description: string | null
          site_title: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          logo?: string | null
          seo?: Json | null
          site_description?: string | null
          site_title?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          logo?: string | null
          seo?: Json | null
          site_description?: string | null
          site_title?: string | null
          updated_at?: string
        }
        Relationships: []
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
