import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { backendUrl } from "../constants";

export const HomeContext = createContext();

export const homeReducer = (state, action) => {
  switch (action.type) {
    case "POSTS":
      if (action.payload.length === 0) {
        return { ...state, end: true };
      }
      if (!action.payload.includes(state.posts[state.posts.length - 1])) {
        return { ...state, posts: [...state.posts, ...action.payload] };
      } else {
        return { ...state, end: true };
      }
    case "PAGE":
      if (!state.end) {
        return { ...state, page: state.page + 1 };
      } else {
        return { ...state, end: true };
      }
    case "REFRESH":
      window.scrollTo(0, 0);
      return { posts: [], page: 0, end: false };
    default:
      return { posts: [], page: 0 };
  }
};

export const HomeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(homeReducer, {
    posts: [],
    page: 0,
    end: false,
  });

  const { user } = useAuthContext();

  const getHomeFeed = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/posts/homeFeed/${state.page}`,
        {
          withCredentials: true,
        }
      );
      dispatch({ type: "POSTS", payload: response.data.data });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    dispatch({ type: "REFRESH" });
    if (state.posts.length === 0) {
      if (user) {
        getHomeFeed();
      }
    }
  }, [user]);

  useEffect(() => {
    if (state.page > 0) {
      getHomeFeed();
    }
  }, [state.page]);

  return (
    <HomeContext.Provider value={{ ...state, dispatch }}>
      {children}
    </HomeContext.Provider>
  );
};
