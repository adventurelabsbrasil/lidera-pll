export type UserRole = "end_user" | "tenant_admin" | "super_admin";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  tenant_id: string | null;
  client_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentGroup {
  id: string;
  tenant_id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  content_group_id: string;
  title: string;
  slug: string;
  type: "video" | "text";
  video_url: string | null;
  body: string | null;
  instructor_notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ClientContentAccess {
  id: string;
  client_id: string;
  content_group_id: string;
  created_at: string;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  content_item_id: string;
  completed: boolean;
  student_notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: "light" | "dark" | "system";
  notifications_enabled: boolean;
  avatar_url: string | null;
  organization_logo_url: string | null;
  created_at: string;
  updated_at: string;
}
