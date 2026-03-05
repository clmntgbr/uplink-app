export interface User {
  email?: string;
  firstname?: string;
  lastname?: string;
  picture?: string;
  roles?: string[];
  id?: string;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export type UserAction = { type: "SET_USER"; payload: User } | { type: "SET_ERROR"; payload: string } | { type: "SET_LOADING"; payload: boolean };
