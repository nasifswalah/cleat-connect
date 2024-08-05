// Import with TurfCreation.css for styles
import "./TurfCreation.css";

// Import the neccessary hooks and components
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../../constants/firebase.js";

// Import axios for making HTTP requests
import axios from "axios";

// Import neccessary methods from firebase storage
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

// import setLoader action creator from user slice 
import { setLoader } from "../../redux/generalSlice.js";

// Import ErrorToast and successToast to manage notifications 
import { ErrorToast, successToast } from "../../constants/toast.js";

// Import neccessary icons from assets folder
import editIcon from "../../assets/editIcon.svg";
import deleteIcon from "../../assets/deleteIcon.svg";


const TurfCreation = () => {

  // Get the dispatch function from useDispatch hook
  const dispatch = useDispatch();

  // Destructuring darkMode and currentUser from the user slice of Redux state
  const { currentUser } = useSelector((state) => state.user);
  const {  darkMode } = useSelector((state) => state.general);

  // Get the navigate function from useNavigate hook
  const navigate = useNavigate();

  // useState hook to manage images
  const [imageFiles, setImageFiles] = useState([]);

  // useState hook to manage new turf data
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

  // useState hook to manage opening and closing of turf listing
  const [openDisplay, setOpenDisplay] = useState(false);

  // useState hook to manage existing turf data
  const [createdTurfData, setCreatedTurfData] = useState([]);

  // Function to handle image storing into firebase
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

  // Function to handle image uploading
  const handleImageUpload = () => {
    dispatch(setLoader(true))
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
          dispatch(setLoader(false))
        })
        .catch((err) => {
          dispatch(setLoader(false))
          ErrorToast("Each image should be less than 2 mb");
        });
    } else {
      dispatch(setLoader(false))
      ErrorToast("Upload less than 7 images");
    }
  };

  // Function to handle changes in new turf creation
  const handleTurfCreationChange = (e) => {
    setNewTurfData({
      ...newTurfData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle remove an existing image
  const handleRemoveImge = (index) => {
    setNewTurfData({
      ...newTurfData,
      imageUrls: newTurfData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // Function to handle new turf creation
  const handleTurfCreation = async (e) => {
    e.preventDefault();
    dispatch(setLoader(true));
    try {
      if (newTurfData.imageUrls.length < 1) {
        dispatch(setLoader(false))
        ErrorToast("Upload at least one image");
        return;
      }

      const res = await axios.post("/api/admin/create-turf", {
          ...newTurfData,
          createdBy: currentUser.data._id,
      });
      const data = await res.data;
      if (data.success === false) {
        dispatch(setLoader(false))
        ErrorToast("Something went wrong!");
        return;
      }
      dispatch(setLoader(false))
      successToast(data.message);
      navigate("/profile");
    } catch (error) {
      dispatch(setLoader(false))
      ErrorToast(error.response.data.message);
    }
  };

  // Function to handle listing of existing turf
  const handleTurfDisplay = async () => {
    dispatch(setLoader(true))
    try {
      setOpenDisplay(true);
      const res = await axios.get("/api/admin/get-my-turf");
      const data = await res.data;
      if (data.success === false) {
        dispatch(setLoader(false))
        ErrorToast("Something went wrong!");
        return;
      }
      setCreatedTurfData(data.data);
      dispatch(setLoader(false))
    } catch (error) {
      dispatch(setLoader(false))
      ErrorToast(error.response.data.message);
    }
  };

  // Function to handle existing turf deletion
  const handleTurfDeletion = async (turfId) => {
    dispatch(setLoader(true))
    try {
      const res = await axios.delete(`/api/admin/delete-turf/${turfId}`);
      const data = await res.data;
      if (data.success === false) {
        dispatch(setLoader(false))
        ErrorToast("Something went wrong!");
        return;
      }
      setCreatedTurfData((prev) =>
        prev.filter((listing) => listing._id !== turfId)
      );
      dispatch(setLoader(false))
      successToast(data.message);
    } catch (error) {
      dispatch(setLoader(false))
      ErrorToast(error.response.data.message);
    }
  };

  return (
    <>
      <div className="turf-creation-container">
        <div className="turf-creation-form-container">
          <form className={`${darkMode ? 'dark-mode' : ''}`}>
            <h3 className={`${darkMode ? 'dark-mode-text' : ''}`}>Create New Turf</h3>
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
            <div key={url} className={`image-display-container ${darkMode ? 'dark-mode' : ''}`}>
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
          <h4 className={`list-btn ${darkMode ? 'dark-mode-text' : ''}`} onClick={handleTurfDisplay}>
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
                          src={turf.imageUrls[0]}
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
