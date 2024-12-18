import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/Nav.css";
import LogoutButton from "./LogoutButton";
import Notifications from "./Notifications";
export default function Nav() {
  const { user } = useAuthContext();

  const NavUser = () => {
    const [showNoti, setShowNoti] = useState(false);
    useEffect(() => {
        if (showNoti) {
          document.querySelector("body").style.overflow = "hidden";
        } else {
          document.querySelector("body").style.overflow = "auto";
        }
      }, [showNoti]);
    return (
      <>
        {user && (
          <>
            {/* {showNoti && <>
          
          </>} */}
            <Notifications showNoti={showNoti} setShowNoti={setShowNoti} />
            <li title="Create new post">
              <NavLink to={`/new`}>
                <div>
                  <i className="fa-regular fa-square-plus"></i>
                </div>
                <div>
                  <h2>Create</h2>
                </div>
              </NavLink>
            </li>
            <li style={{ position: "relative" }}>
              <div
                className={`${showNoti ? "color-secondary" : ""} btn-noti`}
                onClick={() => {
                  setShowNoti((prev) => !prev);
                }}
              >
                <div>
                  <i className="fa-solid fa-heart">
                    {user.notifications.length > 0 && (
                      <>
                        <span className={showNoti ? "" : "show"}>
                          {user.notifications.length}
                        </span>
                      </>
                    )}
                  </i>
                </div>
                <div>
                  <h2>Notifications</h2>
                </div>
              </div>
            </li>
            <li>
              <NavLink to={`/user/${user.username}`}>
                <div>
                  <img src={user.avatar} alt="" id="nav-user-avatar" />
                </div>
                <div>
                  <h2>Profile</h2>
                </div>
              </NavLink>
            </li>
            <li>
              <LogoutButton />
            </li>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <ul className="navlink-list">
        <li>
          <NavLink to="/">
            <div>
              {" "}
              <img
                src="https://res.cloudinary.com/aayushcloudinary/image/upload/v1733832361/momento-icon-white_xkfqff.png"
                alt="Momento Icon"
                className="momento-icon"
              />
            </div>
            <div>
              <h1 className="title" style={{ color: "white" }}>
                Momento
              </h1>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink to="/search">
            <div>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <div>
              <h2>Search</h2>
            </div>
          </NavLink>
        </li>
        <NavUser />
      </ul>
    </>
  );
}
