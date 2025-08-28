export type User = {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
  public_key_jwk?: JsonWebKey;
};

export type AccessManagedUser = {
  id: string;
  isViewer: boolean;
  isEditor: boolean;
};
