interface Users {
    id: string;
    email: string;
    name: string;
    created_at: string;
    updated_at: string;
    token_balance: number;
    projects: string[];
    user_metadata: {
      full_name: string;
      avatar_url: string;
    };
}