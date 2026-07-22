export type EmotionCode =
  | "good"
  | "calm"
  | "warm"
  | "excited"
  | "okay"
  | "neutral"
  | "mixed"
  | "anxious"
  | "sad"
  | "angry"
  | "tired"
  | "lonely";

export type UserProfile = {
  id: string;
  nickname: string | null;
  created_at: string;
  updated_at: string;
};

export type DiaryEntry = {
  id: string;
  user_id: string;
  emotion_code: EmotionCode;
  emotion_label: string;
  content: string;
  ai_comment: string | null;
  entry_date: string;
  migration_key: string | null;
  created_at: string;
  updated_at: string;
};

export type DiaryInsert = {
  emotion_code: EmotionCode;
  emotion_label: string;
  content: string;
  ai_comment?: string | null;
  entry_date?: string;
  migration_key?: string | null;
};

export type DiaryUpdate = Partial<Pick<DiaryInsert, "emotion_code" | "emotion_label" | "content" | "ai_comment" | "entry_date">>;

export type UserConsent = {
  id: string;
  user_id: string;
  terms_version: string;
  privacy_version: string;
  terms_agreed_at: string;
  privacy_agreed_at: string;
  marketing_agreed: boolean;
  marketing_agreed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: {
          id: string;
          nickname?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nickname?: string | null;
          updated_at?: string;
        };
      };
      diary_entries: {
        Row: DiaryEntry;
        Insert: {
          id?: string;
          user_id: string;
          emotion_code: EmotionCode;
          emotion_label: string;
          content: string;
          ai_comment?: string | null;
          entry_date?: string;
          migration_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          emotion_code?: EmotionCode;
          emotion_label?: string;
          content?: string;
          ai_comment?: string | null;
          entry_date?: string;
          migration_key?: string | null;
          updated_at?: string;
        };
      };
      user_consents: {
        Row: UserConsent;
        Insert: {
          id?: string;
          user_id: string;
          terms_version: string;
          privacy_version: string;
          terms_agreed_at?: string;
          privacy_agreed_at?: string;
          marketing_agreed?: boolean;
          marketing_agreed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          marketing_agreed?: boolean;
          marketing_agreed_at?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
