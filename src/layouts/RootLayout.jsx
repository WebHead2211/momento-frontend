import { Outlet } from "react-router-dom";
import Nav from "../components/Other/Nav";

const Footer = () => {
  return <footer>Made by Aayush</footer>;
};

export default function RootLayout() {
  return (
    <div className="root-layout">
      <header>
        <Nav />
      </header>
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
