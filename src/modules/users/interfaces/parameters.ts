export interface UserParameters {
  // optional parameters TS
  filter?: {
    user_role?: 'Admin' | 'Customer';
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  sortBy?: 'first_name' | 'email' | 'phone_number';
  direction?: 'ASC' | 'DESC';
  limit?: number;
  skip?: number;
}
