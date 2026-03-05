"use client";

import { useCallback, useEffect, useReducer } from "react";
import { handleGetUser } from "./api";
import { UserContext } from "./context";
import { userReducer } from "./reducer";
import { UserState } from "./types";

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const getUser = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const user = await handleGetUser();
      dispatch({ type: "SET_USER", payload: user });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch user" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        getUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
