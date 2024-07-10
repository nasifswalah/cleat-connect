import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { ErrorToast, successToast } from "../../constants/toast.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateUser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    role: "",
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserCreation = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/admin/create-user", userData);
      const data = await res.data;
      if (data.success === false) {
        ErrorToast(data.message);

        return;
      }
      successToast(data.message);
      navigate("/profile");
    } catch (error) {
      ErrorToast(error.message);
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="turf-creation-container add-user-form">
        <div className="turf-creation-form-container">
          <form>
            <h3>Add New User</h3>
            <input
              type="text"
              placeholder="Name"
              name="name"
              className="creation-box"
              value={userData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="creation-box"
              value={userData.email}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Contact Number"
              name="contactNumber"
              className="creation-box"
              value={userData.contactNumber}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="creation-box"
              value={userData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              className="creation-box"
              value={userData.confirmPassword}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Role"
              name="role"
              className="creation-box"
              value={userData.role}
              onChange={handleChange}
            />
            <input
              type="submit"
              className="btn create"
              value="Create"
              onClick={handleUserCreation}
            />
            <input
              type="button"
              className="btn cancel"
              value="Cancel"
              onClick={() => navigate("/profile")}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateUser;
