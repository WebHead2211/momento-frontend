import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { backendUrl } from "../constants";

export default function Create() {
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    caption: "",
  });
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [postButton, setPostButton] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setPostImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    if (!user) {
      navigate("/");
    }
    e.preventDefault();
    setPostButton(true);
    const data = new FormData();
    data.append("caption", formData.caption);
    data.append("postImage", postImage);

    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/posts/post`,
        data,
        {
          withCredentials: true,
        }
      );
      setSuccess(true);
      navigate(`/user/${user.username}`);
      setMessage(response.data.message);
    } catch (error) {
      setSuccess(false);
      setMessage(error.response.data.error);
    }
    setPostButton(false);

    // await signup(data);
    if (!success) {
      setFormData({
        caption: "",
      });
    }
  };

  const { user } = useAuthContext();

  return (
    <div id="register-page-container" style={{ margin: "auto" }}>
      <div className="register-container-body">
        <h1 className="title">Create New Post</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="file-upload" className="custom-file-upload">
              Upload Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              style={{ padding: "0" }}
            />
          </div>
          {imagePreview && (
            <>
              <div>
                <img src={imagePreview} alt="Preview" />
              </div>
            </>
          )}
          <div>
            <input
              type="text"
              name="caption"
              placeholder="Caption"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className={`btn-secondary ${postButton ? "inactive" : ""}`}
            id="post-button"
          >
            <p>{!postButton ? "Create Post" : "Posting"}</p>
            <div></div>
          </button>
        </form>
        {message && (
          <p
            className="error-message"
            style={{
              color: success ? "rgb(114, 255, 79)" : "rgb(255, 79, 79)",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
