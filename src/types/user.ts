export type User = {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
};

export type AccessManagedUser = {
  id: string;
  isViewer: boolean;
  isEditor: boolean;
};
