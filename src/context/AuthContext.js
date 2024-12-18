import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
import { backendUrl } from "../constants";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  // console.log("Auth context state updated: ", state);

  useEffect(() => {
    const findUser = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/users/currentUser`,
          {
            withCredentials: true,
          }
        );
        console.log("Current User: ", response.data.user);
        dispatch({ type: "LOGIN", payload: response.data.user });
      } catch (error) {
        dispatch({ type: "LOGOUT" });
        console.log(error.response.data);
      }
    };
    findUser();
  }, []);

  useEffect(() => {
    if (
      state.user &&
      state.user.notifications &&
      state.user.notifications.length > 0
    ) {
      document.title = `(${state.user.notifications.length}) Momento`;
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
