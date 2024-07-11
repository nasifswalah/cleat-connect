import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../constants/firebase.js";
import { ErrorToast, successToast } from "../../constants/toast.js";
import deleteIcon from "../../assets/deleteIcon.svg";
import axios from "axios";

const TurfUpdation = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const [imageFiles, setImageFiles] = useState([]);
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

  useEffect(() => {
    const fetchUpdates = async () => {
      const turfId = params.turfId;
      try {
        const res = await axios.get(`/api/user/get-turf/${turfId}`);
        const data = await res.data;
        if (data.success === false) {
          ErrorToast(data.message);
          return;
        }
        setUpdateTurfData(data.data);
      } catch (error) {
        ErrorToast(error.message);
      }
    };
    fetchUpdates();
  }, []);

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

  const handleImageUpload = () => {
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
        })
        .catch((err) => {
          ErrorToast("Image upload failed");
          console.log(err);
        });
    } else {
      ErrorToast("Upload less than 7 images");
    }
  };

  const handleTurfUpdateChange = (e) => {
    setUpdateTurfData({
      ...updateTurfData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRemoveImge = (index) => {
    setUpdateTurfData({
      ...updateTurfData,
      imageUrls: updateTurfData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleTurfUpdation = async (e) => {
    e.preventDefault();
    try {
      if (updateTurfData.imageUrls.length < 1) {
        ErrorToast("Upload at least one image");
        return;
      }

      const res = await axios.post(`/api/admin/update-turf/${params.turfId}`, {
          ...updateTurfData,
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

  return (
    <>
      <Navbar />
      <div className="turf-creation-container">
        <div className="turf-creation-form-container">
          <form>
            <h3>Update Turf</h3>
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
      </div>
    </>
  );
};

export default TurfUpdation;
