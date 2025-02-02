// Import the neccessary hooks and components
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
import deleteIcon from "../../assets/deleteIcon.svg";


const TurfUpdation = () => {

  // Destructuring darkMode and currentUser from the user slice of Redux state
  const { currentUser } = useSelector((state) => state.user);
  const { darkMode } = useSelector((state) => state.general);

  // Get the navigate function from useNavigate hook
  const navigate = useNavigate();

  
  // Get the navigate function from useNavigate hook
  const dispatch = useDispatch();

  // Get the params function from useParams hook
  const params = useParams();

  // useState hook to manage images
  const [imageFiles, setImageFiles] = useState([]);

  // useState hook to manage existing turf data
  const [updateTurfData, setUpdateTurfData] = useState({
    imageUrls: [],
    name: "",
    location: "",
    contactNumber: "",
    description: "",
    turfType: "",
    manager: "",
    createdBy: "",
  });

  // useEffect hook to retrive existing turf data that needs to be update
  useEffect(() => {
    const fetchUpdates = async () => {
      const turfId = params.turfId;
      try {
        dispatch(setLoader(true));
        const res = await axios.get(`/api/user/get-turf/${turfId}`);
        const data = await res.data;
        if (data.success === false) {
          dispatch(setLoader(false));
          ErrorToast("Something went wrong!");
          return;
        }
        setUpdateTurfData(data.data);
        dispatch(setLoader(false));
      } catch (error) {
        dispatch(setLoader(false));
        ErrorToast(error.response.data.message);
      }
    };
    fetchUpdates();
  }, []);

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
          console.log(`Upload is ${progress}% done`);
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
      imageFiles.length + updateTurfData.imageUrls.length < 7
    ) {
      const promises = [];

      for (let i = 0; i < imageFiles.length; i++) {
        promises.push(storeImage(imageFiles[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setUpdateTurfData({
            ...updateTurfData,
            imageUrls: updateTurfData.imageUrls.concat(urls),
          });
          dispatch(setLoader(false))
        })
        .catch((err) => {
          dispatch(setLoader(false))
          ErrorToast("Image upload failed");
        });
    } else {
      dispatch(setLoader(false))
      ErrorToast("Upload less than 7 images");
    }
  };

  // Function to handle changes in existing turf updation
  const handleTurfUpdateChange = (e) => {
    setUpdateTurfData({
      ...updateTurfData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle remove an existing image
  const handleRemoveImge = (index) => {
    setUpdateTurfData({
      ...updateTurfData,
      imageUrls: updateTurfData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // Function to handle existing turf updation
  const handleTurfUpdation = async (e) => {
    dispatch(setLoader(true))
    e.preventDefault();
    try {
      if (updateTurfData.imageUrls.length < 1) {
        dispatch(setLoader(false))
        ErrorToast("Upload at least one image");
        return;
      }

      const res = await axios.post(`/api/admin/update-turf/${params.turfId}`, {
          ...updateTurfData,
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

  return (
    <>
      <div className="turf-creation-container">
        <div className='turf-creation-form-container'>
          <form className={`${darkMode ? 'dark-mode' : ''}`}>
            <h3 className={`${darkMode ? 'dark-mode-text' : ''}`}>Update Turf</h3>
            <input
              type="text"
              placeholder="Turf name"
              name="name"
              className="creation-box"
              value={updateTurfData.name}
              onChange={handleTurfUpdateChange}
            />
            <input
              type="text"
              placeholder="Location"
              name="location"
              className="creation-box"
              value={updateTurfData.location}
              onChange={handleTurfUpdateChange}
            />
            <input
              type="number"
              placeholder="Contact Number"
              name="contactNumber"
              className="creation-box"
              value={updateTurfData.contactNumber}
              onChange={handleTurfUpdateChange}
            />
            <input
              type="text"
              placeholder="Type (eg: cricket, football, etc..)"
              name="turfType"
              className="creation-box"
              value={updateTurfData.turfType}
              onChange={handleTurfUpdateChange}
            />
            <textarea
              type="textarea"
              placeholder="Description"
              name="description"
              className="creation-box"
              value={updateTurfData.description}
              onChange={handleTurfUpdateChange}
            />
            <input
              type="text"
              placeholder="Manager Email"
              name="manager"
              className="creation-box"
              value={updateTurfData.manager}
              onChange={handleTurfUpdateChange}
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
              onClick={handleTurfUpdation}
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
        {updateTurfData.imageUrls.length > 0 &&
          updateTurfData.imageUrls.map((url, index) => (
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
      </div>
    </>
  );
};

export default TurfUpdation;
