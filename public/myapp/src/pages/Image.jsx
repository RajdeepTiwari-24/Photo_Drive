import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import logo from "../assets/logo.png";
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
        // console.log(res.data.message);
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
        <div className="heading">
          <img className="logo" src={logo} />
          <h1>Image Hub</h1>
        </div>
        <h2>Please Select your file and click Upload :</h2>
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
  font-family: "Yatra One", system-ui;
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
  .heading {
    display: flex;
    justify-content: center;
    align-items: center;
    h1 {
      font-family: "Nagasaki";
      font-size: 8rem;
      letter-spacing: 2px;
      font-weight: normal;
      text-decoration: underline;
    }
    /* input {
      font-family: "Yatra One", system-ui;
    } */
  }
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
    input {
      /* margin: 1px auto; */
      font-size: 1.5rem;
      border: 2px solid gray;
      background-color: white;
      font-family: "Yatra One", system-ui;
      font-weight: 500;
      padding: 5px;
      /* &:hover {
        cursor: pointer;
      } */
    }
    input::file-selector-button {
      background-color: black;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 5px 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .yatra-one-regular {
    font-family: "Yatra One", system-ui;
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: "Nagasaki";
    src: local("Nagasaki"),
      url("data:font/woff;charset=utf-8;base64,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")
        format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
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
