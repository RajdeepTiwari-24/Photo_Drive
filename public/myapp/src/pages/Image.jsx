import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import axios from "axios";
import {
  uploadimagesRoute,
  getimagesRoute,
  deleteRoute,
} from "../utils/APIRoutes";

export default function Image() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("USER"));
  const getuser = user ? user._id : null;
  const [file, setFile] = useState();
  const [images, setImages] = useState([]);
  const [reload, setreload] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (getuser) {
      axios
        .get(`${getimagesRoute}?userid=${getuser}`)
        .then((res) => {
          const imageData = Array.isArray(res.data) ? res.data : [];
          setImages(imageData);
        })
        .catch((e) => console.log(e));
    }
  }, [reload]);

  const handleUpload = (e) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3500);
    e.preventDefault();
    if (!file) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userid", getuser);
    axios
      .post(uploadimagesRoute, formData)
      .then((res) => {
        setreload((prevReload) => !prevReload);
        console.log(res.data.message);
      })
      .catch((error) => console.error(error));
  };

  const handleClick = () => {
    localStorage.clear();
    navigate("/login");
  };

  const deleteClick = (imagename) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3500);
    axios
      .post(deleteRoute, { userid: getuser, imagename: imagename })
      .then((res) => {
        setreload((prevReload) => !prevReload);
        alert(res.data.message);
      })
      .catch((e) => console.log(e));
  };

  return (
    <Container>
      <div className="top-section">
        <h1>Image Drive</h1>
        <h2>Please Select your file and click Upload.</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      {isLoading ? (
        <img className="loader" src={loader} />
      ) : (
        <>
          <h3>The following are the images in your drive:</h3>
          <div className="image-section">
            <ul>
              {images.map((image) => (
                <li key={image.id}>
                  <img src={`${image.image}`} alt="" />
                  <button onClick={() => deleteClick(image.image)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {/* {isLoading ? <img className="loader" src={loader} /> : ""} */}

      <button className="logout-btn" onClick={handleClick}>
        Logout
      </button>
    </Container>
  );
}

const Container = styled.div`
  /* * {
    margin: 0px;
    padding: 0px;
  } */
  * {
    box-sizing: border-box;
  }
  /* height: 100vh; */
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
  background-image: url("https://img.freepik.com/free-vector/neumorphic-round-shape-design-empty-white-banner_1017-43171.jpg?w=1380&t=st=1707828356~exp=1707828956~hmac=463bffd3b2c0102d76ec1f6a0892cd0eaec094e886360509f679bb5b51fd2892");
  /* width: 100vw; */
  background-size: cover;
  background-position: center;
  background-repeat: repeat-x;
  background-attachment: fixed;
  /* height: 100vh; */
  .top-section {
    width: 700px;
    padding: 25px;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 20px;
    backdrop-filter: blur(10px);
    button {
      font-size: 1.5rem;
      padding: 10px 20px;
    }
  }

  button {
    color: white;
    background-color: black;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: black;
    }
  }
  .image-section {
    width: 90%;
    height: auto;
    border: 5px dashed black;
    min-height: 50%;
    overflow-y: scroll;
    ul {
      list-style: none;
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 1rem;
      width: 80%;
      margin: auto;
      padding: 1.5rem;
      flex-wrap: wrap;
      li {
        background-color: white;
        padding: 10px;
        /* border: 1px solid black; */
        box-shadow: 2px 2px 4px gray;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
      }
    }
  }
  .loader {
    height: 400px;
    /* width: 200px; */
    border: 2px solid black;
    border-radius: 5%;
  }
  .logout-btn {
    /* align-self: flex-end; */
    font-size: 1.5rem;
    padding: 10px 20px;
    margin-top: auto;
    margin-bottom: 20px;
    width: 50vw;
    background-color: black;
  }

  img {
    height: 10rem;
    width: auto;
    border-radius: 5px;
  }
`;
