import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [formState, setFormState] = useState({});
  const [file, setFile] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.userState);
  const fileRef = useRef("");


  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/delete-user/${currentUser.userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append("image", file); 
    }
    if (formState.username) {
      formData.append("username", formState.username); 
    }
    if (formState.email) {
      formData.append("email", formState.email); 
    }
  
    const response = await fetch(
      `http://localhost:5000/api/users/update-user/${currentUser.userId}`,
      {
        method: "PATCH",
        body: formData,
      }
    );
  
    const data = await response.json();
    dispatch(loginSuccess(data));

  };

  if (currentUser) {
    return (
      <div className="mt-7 flex flex-col items-center gap-4">
        <h1 className="text-center font-semibold text-4xl">Profile</h1>

        <form className="flex flex-col gap-4 align-middle" onSubmit={handleSubmit}>
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="w-42 flex justify-center">
            <img
              onClick={() => fileRef.current.click()}
              className="rounded-full -mt-1 w-24 h-24"
              src={file ? URL.createObjectURL(file) : currentUser.image}
              alt="Profile"
            />
          </div>
          <input
            className="border p-2.5 rounded-lg w-42 border-none"
            placeholder="Please enter a username"
            type="text"
            id="username"
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
          <input
            className="p-2.5 rounded-lg w-42 border-none"
            placeholder="Please enter an email"
            type="email"
            id="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <button className="bg-slate-700 text-white rounded-lg px-52 py-2.5 -mt-1">
            UPDATE
          </button>
          <button className="bg-green-700 text-white rounded-lg px-50 py-2.5 -mt-1">
            <Link to="/create-estate-listing"> CREATE AN ESTATE LISTING </Link> 
          </button>
        </form>
        <div className="flex justify-between w-2/5 mb-5 text-red-700">
          <button onClick={handleDelete}>Delete Account</button>
          <button onClick={handleLogOut}>Log Out</button>
        </div>
      </div>
    );
  }

  return null;
};

export default Profile;

