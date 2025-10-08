import React, { useState, useRef, useEffect } from "react";
import "./Leaderboard.css";
import background from "../../assets/r.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Navbar from "../Navbar/Navbar";
import profile_icon from '../../assets/profile_icon.png'
const Leaderboard = () => {
  const location = useLocation();
  const {updatedscore,currentuser} = location.state;
  const [battleuser, setBattleuser] = useState(updatedscore);
  const { roomid } = useParams();
  const socket = useRef(null);
  const [submitcount, setsubmitcount] = useState(0);
  const navigate=useNavigate()
console.log(currentuser);
  const updateuser = async () => {
    if (submitcount + 1 === battleuser.length) {
      await fetch(`http://192.168.172.254:8008/updaterecord`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ battleuser }),
      });
    }
  };

  useEffect(() => {
    setsubmitcount((prev) => {
      const newcount = prev + 1;
      updateuser();
      return newcount;
    });
  }, [battleuser]);

  useEffect(() => {
    socket.current = io("http://192.168.172.254:5000");
    socket.current.emit("joinroom", roomid, updatedscore);

    socket.current.on("submitcode", (updatedscore) => {
      // const sorted = [...updatedscore].sort((a, b) => b.score - a.score);
      setBattleuser(updatedscore);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <div>
      <Navbar username={currentuser.username}/>
    <div
      className="leaderboard-page"
      style={{ backgroundImage: `url(${background})` }}
    >
      
      <div className="leaderboard-box">
        <h2 className="leaderboard-title">LEADERBOARD</h2>
        <div className="leaderboard">
          {battleuser.map((player, index) => (
            <div key={index} className="player-row">
              <div className="rank">{index + 1}.</div>
              <div className="avatar"onClick={()=>{navigate(`/profile/${currentuser.username}`)}}><img src={profile_icon} alt="" /></div>
              <div className="player-name">{player.username}</div>

              {player.issubmitted ? (
                <>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${
                          i < Math.round(player.score) ? "active" : ""
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="score">{player.score}/5</div>
                </>
              ) : (
                <div className="in-progress">In Progress...</div>
              )}
            </div>
          ))}
        </div>
       
      </div>
      <div className="leaderboard-footer">
  <button className="play-again-btn" onClick={()=>{navigate("/")}} >
    Play Again
  </button>
</div>

    </div>
    
    </div>
  );
};

export default Leaderboard;
