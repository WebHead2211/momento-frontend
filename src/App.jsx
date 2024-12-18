import { useEffect } from "react";
import { useHomeContext } from "./hooks/useHomeContext";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

//styles
import "./styles/index.css";
import "./styles/fonts.css";
import "./styles/animations.css";

//pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import User from "./pages/User";
import Post from "./pages/Post";
import EditUser from "./pages/EditUser";
import Create from "./pages/Create";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import CustomError from "./pages/CustomError";

//layouts
import RootLayout from "./layouts/RootLayout";

function App() {
  const { dispatch: homeDispatch } = useHomeContext();
  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom) {
      homeDispatch({ type: "PAGE" });
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />} errorElement={<CustomError />}>
          <Route index element={<Home />} />
          <Route path="/error" element={<CustomError />} />
          <Route path="search" element={<Search />} />
          <Route path="new" element={<Create />} />
          <Route path="/user/:username" element={<User />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/editUser" element={<EditUser />} />
          <Route path="/accounts">
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>

          {/* Any unknown path */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
