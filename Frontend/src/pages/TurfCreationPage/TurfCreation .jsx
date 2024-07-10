import React, { useState } from "react";
import "./TurfCreation.css";
import editIcon from "../../assets/editIcon.svg";
import deleteIcon from "../../assets/deleteIcon.svg";
import Navbar from "../../components/Navbar/Navbar";
import { ErrorToast, successToast } from "../../constants/toast.js";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../constants/firebase.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const TurfCreation = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [imageFiles, setImageFiles] = useState([]);
  const [newTurfData, setNewTurfData] = useState({
    imageUrls: [],
    name: "",
    location: "",
    contactNumber: "",
    description: "",
    turfType: "",
    manager: "",
    createdBy: "",
  });
  const [openDisplay, setOpenDisplay] = useState(false);
  const [createdTurfData, setCreatedTurfData] = useState([]);

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageUpload = () => {
    if (
      imageFiles.length > 0 &&
      imageFiles.length + newTurfData.imageUrls.length < 7
    ) {
      const promises = [];

      for (let i = 0; i < imageFiles.length; i++) {
        promises.push(storeImage(imageFiles[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setNewTurfData({
            ...newTurfData,
            imageUrls: newTurfData.imageUrls.concat(urls),
          });
        })
        .catch((err) => {
          ErrorToast("Image upload failed");
          console.log(err);
        });
    } else {
      ErrorToast("Upload less than 7 images");
    }
  };

  const handleTurfCreationChange = (e) => {
    setNewTurfData({
      ...newTurfData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRemoveImge = (index) => {
    setNewTurfData({
      ...newTurfData,
      imageUrls: newTurfData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleTurfCreation = async (e) => {
    e.preventDefault();
    try {
      if (newTurfData.imageUrls.length < 1) {
        ErrorToast("Upload at least one image");
        return;
      }

      const res = await axios.post("/api/admin/create-turf", {
          ...newTurfData,
          createdBy: currentUser.data._id,
      });
      const data = await res.data;
      if (data.success === false) {
        ErrorToast(data.message);
        console.log(data);
        return;
      }
      successToast(data.message);
      navigate("/profile");
    } catch (error) {
      ErrorToast(error.message);
      console.log(error);
    }
  };

  const handleTurfDisplay = async () => {
    try {
      setOpenDisplay(true);
      const res = await axios.get("/api/admin/get-my-turf");
      const data = await res.data;
      if (data.success === false) {
        ErrorToast(data.message);
        console.log(data);
        return;
      }
      setCreatedTurfData(data.data);
    } catch (error) {
      ErrorToast(error.message);
    }
  };

  const handleTurfDeletion = async (turfId) => {
    try {
      const res = await axios.delete(`/api/admin/delete-turf/${turfId}`);
      const data = await res.data;
      if (data.success === false) {
        ErrorToast(data.message);
        return;
      }
      successToast(data.message);
      setCreatedTurfData((prev) =>
        prev.filter((listing) => listing._id !== turfId)
      );
    } catch (error) {
      ErrorToast(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="turf-creation-container">
        <div className="turf-creation-form-container">
          <form>
            <h3>Create New Turf</h3>
            <input
              type="text"
              placeholder="Turf name"
              name="name"
              className="creation-box"
              value={newTurfData.name}
              onChange={handleTurfCreationChange}
            />
            <input
              type="text"
              placeholder="Location"
              name="location"
              className="creation-box"
              value={newTurfData.location}
              onChange={handleTurfCreationChange}
            />
            <input
              type="number"
              placeholder="Contact Number"
              name="contactNumber"
              className="creation-box"
              value={newTurfData.contactNumber}
              onChange={handleTurfCreationChange}
            />
            <input
              type="text"
              placeholder="Type (eg: cricket, football, etc..)"
              name="turfType"
              className="creation-box"
              value={newTurfData.turfType}
              onChange={handleTurfCreationChange}
            />
            <textarea
              type="textarea"
              placeholder="Description"
              name="description"
              className="creation-box"
              value={newTurfData.description}
              onChange={handleTurfCreationChange}
            />
            <input
              type="text"
              placeholder="Manager Email"
              name="manager"
              className="creation-box"
              value={newTurfData.manager}
              onChange={handleTurfCreationChange}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              name="images"
              className="creation-box"
              onChange={(e) => setImageFiles(e.target.files)}
            />
            <input
              type="button"
              className="btn create"
              onClick={handleImageUpload}
              value="Upload image"
            />
            <input
              type="submit"
              className="btn create"
              onClick={handleTurfCreation}
              value="Create"
            />
            <input
              type="submit"
              className="btn cancel"
              value="Cancel"
              onClick={() => navigate("/profile")}
            />
          </form>
        </div>
        {newTurfData.imageUrls.length > 0 &&
          newTurfData.imageUrls.map((url, index) => (
            <div key={url} className="image-display-container">
              <img src={url} alt="listing image" className="uploaded-image" />
              <span>
                <img
                  src={deleteIcon}
                  alt="manage icons"
                  className="delete-icon"
                  onClick={() => handleRemoveImge(index)}
                />
              </span>
            </div>
          ))}

        <div className="turf-creation-display">
          <h4 className="list-btn" onClick={handleTurfDisplay}>
            Show turf
          </h4>
          {openDisplay && (
            <table className="turf-creation-display-table">
              <thead>
                <tr>
                  <th>Turf image</th>
                  <th>Turf name</th>
                  <th>Turf location</th>
                  <th colSpan="2">Manage</th>
                </tr>

                {createdTurfData &&
                  createdTurfData.map((turf, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={turf.imageUrls[1]}
                          alt="turf tumb image"
                          height="100"
                        />
                      </td>
                      <td>{turf.name}</td>
                      <td>{turf.location}</td>
                      <td colSpan="2" className="manage-btns">
                        <Link to={`/update-turf/${turf._id}`}>
                          <img src={editIcon} alt="manage icons" />
                        </Link>
                        <span>
                          <img
                            src={deleteIcon}
                            onClick={() => handleTurfDeletion(turf._id)}
                            alt="manage icons"
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
              </thead>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default TurfCreation;
