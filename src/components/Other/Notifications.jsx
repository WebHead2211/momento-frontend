import React, { useEffect, useState } from "react";
import "../../styles/Notifications.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";
import { backendUrl } from "../../constants";
import { Link, useNavigate } from "react-router-dom";

const Notification = ({ notification, setShowNoti, index }) => {
  const [user, setUser] = useState();
  const [post, setPost] = useState();
  const type =
    notification.type === "follow" ? (
      <p>followed you!</p>
    ) : (
      <Link>liked your post!</Link>
    );

  const deleteNotification = async () => {
    setShowNoti(false);
    const response = await axios.delete(
      `${backendUrl}/api/v1/users/deleteNotification`,
      {
        data: {
          user: notification.user,
          type: notification.type,
          post: notification.post ? notification.post : "",
        },
      }
    );
  };

  useEffect(() => {
    const getNotification = async () => {
      const response = await axios.get(
        `${backendUrl}/api/v1/users/getNotification/${notification._id}`
      );
      setUser(response.data.data.user);
      setPost(response.data.data.post);
    };
    getNotification();
  }, []);
  return (
    <>
      {user && (
        <li key={index}>
          <Link
            to={`/user/${user.username}`}
            onClick={() => {
              deleteNotification();
            }}
          >
            <img
              src={user.avatar}
              alt={user.username}
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            />
            <p>{user.username}</p>
          </Link>
          {type}
        </li>
      )}
    </>
  );
};

export default function Notifications({ showNoti, setShowNoti }) {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [button, setButton] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      setNotifications(user.notifications);
    }
  }, [user]);
  const clearNotifications = async () => {
    setButton("clearing");
    try {
      const response = await axios.delete(
        `${backendUrl}/api/v1/users/clearNotifications`
      );
    } catch (error) {
      console.log(error);
    }
    setButton("");
    navigate(0);
  };
  return (
    <>
      {user && (
        <>
          <div className={`noti-overlay ${showNoti ? "active" : ""}`}>
            <div
              className={`noti-box custom-scroll ${showNoti ? "active" : ""}`}
            >
              <div
                className="noti-close btn-secondary"
                onClick={() => {
                  setShowNoti(false);
                }}
              >
                X
              </div>
              {notifications && notifications.length > 0 && (
                <>
                  <button
                    className={`btn-secondary ${button}`}
                    onClick={clearNotifications}
                  >
                    Clear all
                  </button>
                  <ul className="notifications-list">
                    {notifications.map((item, index) => (
                      <Notification
                        notification={item}
                        setShowNoti={setShowNoti}
                        key={index}
                      />
                    ))}
                  </ul>
                </>
              )}
              {notifications && notifications.length === 0 && (
                <p>No notifications</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
