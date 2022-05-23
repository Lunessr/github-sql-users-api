export interface UserParameters {
  filterBy: 'email' | 'first_name' | 'last_name';
  filterText: string;
  sortBy: 'first_name' | 'email' | 'phone_number';
  direction: 'ASC' | 'DESC';
  limit: number;
  skip: number;
}
