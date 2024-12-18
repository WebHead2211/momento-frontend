// ConfirmationPopup.js
import React, { useState } from "react";
import "../../styles/DeleteWithConfirmation.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../constants";
import ConfirmationPopup from "./ConfirmationPopup";

const DeleteWithConfirmation = ({ id }) => {
  const navigate = useNavigate();
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setPopupOpen(true);
  };

  const handleClosePopup = (e) => {
    e.stopPropagation();
    setPopupOpen(false);
  };

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    await axios.delete(`${backendUrl}/api/v1/posts/deletePost/${id}`);
    setPopupOpen(false);
    navigate(0);
  };

  return (
    <>
      <div className="delete">
        <button
          className="btn-delete"
          onClick={(e) => {
            handleDeleteClick(e);
          }}
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
      <ConfirmationPopup
        isOpen={isPopupOpen}
        onClose={(e) => {
          handleClosePopup(e);
        }}
        onConfirm={(e) => {
          handleConfirmDelete(e);
        }}
        type={"Post"}
      />
    </>
  );
};

export default DeleteWithConfirmation;
