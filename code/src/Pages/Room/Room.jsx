import React, { useEffect, useRef, useState } from "react";
import "./Room.css";
import Navbar from "../../Component/Navbar/Navbar";
import copy from "../../assets/copy.png";
import profile from "../../assets/profile_icon.png";
import waiting from "../../assets/waiting.png";
import share from "../../assets/share.png";
import vs1 from "../../assets/vs1.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

const Room = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useRef(null);
  const location = useLocation();
  const details = location.state;
const[copied,setcopied]=useState(false);
  const handlecopy = () => {

  const textarea=document.querySelector(".room-id h5");
  const textcopy=textarea.innerText;
  const text = document.createElement("textarea");
   text.value = textcopy;
    document.body.append(text);
    text.select();
     try {
      document.execCommand("copy");
      // alert("Room ID copied:", text);
      setcopied(!copied);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
    finally {
    document.body.removeChild(text); 
  }
  };

  useEffect(() => {
    if (!details) {
      navigate("/login");
      return;
    }

    socket.current = io("http://192.168.172.254:5000");
    socket.current.emit("joinroom", id, details);

    socket.current.on("startBattle", ({ roomid, users }) => {
      socket.current.emit("details", { roomid, users });
      navigate(`/battle/${roomid}`, { state: { currentuser: details } });
    });
  }, [id, navigate, details]);

  if (!details) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="room">
      <Navbar username={details.username} />
      <div className="container">
        <div className="player-section">
          <div className="player-card">
            <img src={profile} alt="host" />
            <span className="username">{details.username}</span>
          </div>

          <div className="vs-icon">
            <img src={vs1} alt="vs" />
          </div>

          <div className="player-card waiting-card">
            <img src={waiting} alt="waiting" />
            <span className="waiting-text">Waiting for Opponent...</span>
          </div>
        </div>

        <div className="invite-section">
          <h4>Invite a friend to join the battle!</h4>
          <div className="room-id">
            <h5>{id}</h5>
          </div>
          <div className="share-options">
            {/* <div className="share-item">
              <img src={share} alt="share" />
              <span>Share</span>
            </div> */}
            <div className="share-item" onClick={handlecopy}>
              <img src={copy} alt="copy" />
              {copied?<span>Copied!</span>:<span>CopyCode</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
