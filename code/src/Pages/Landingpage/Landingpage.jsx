import React, { useEffect, useState } from 'react'
import Navbar from '../../Component/Navbar/Navbar'
import './Landingpage.css'
import light from '../../assets/light.png'
import trophy from '../../assets/trophy.png'
import monitor from '../../assets/monitor.png'
import { useLocation, useNavigate } from 'react-router-dom'
const Landingpage = () => {
  const navigate=useNavigate();
  const [details,setdetails]=useState();
  const[roomId,setRoomId]=useState()
  const location=useLocation();
  const email=location.state;
  const[showjoin,setshowjoin]=useState(false);
  // if(!email){
  //   navigate('/login');
    
  // }
  
  // console.log(username);
  
    const fetchuser=async()=>{
      try{
    const allinfo=await fetch(`http://192.168.172.254:8008/getinfo/${email}`)
    const data=await allinfo.json();
    console.log(data);
   setdetails(data);
    
  }
  catch(err){
    console.log(err);
  }
  }

  useEffect(()=>{
    fetchuser();
  },[])
  console.log(details);
  const handlejoin=async ()=>{
    if(!email){
      navigate("/login")
      return;
    }
    try{
      const res=await fetch(`http://192.168.172.254:5000/rooms/${roomId}`);
      const data=await res.json();
      if(data.isexist){
         navigate(`/room/${roomId}` ,{state:details});
      }
      else{
        setRoomId("");
        alert("Room does not exist")
      }
    }catch(err){
      console.log(err);
    }
   
  }
  async function handelcreate(){
    if(!email){
      navigate("/login")
      return;
    }
    try {
      const res=await fetch("http://192.168.172.254:5000/rooms",{
        method:"Post",
         headers: { "Content-Type": "application/json" },
        body: JSON.stringify( details)
      });
      const {roomid}=await res.json();
      navigate(`/room/${roomid}`,{state:details});
    } catch (error) {

    }
  }
  return (
    <div className='landing'>
      <Navbar username={(!details)?"":details.username}/>
      <div className="herosection">
        <div className="heading">
          <h1>Battle With Friends.</h1>
        </div>
          <div className="heading">
          <h1> Prove Your Coding Skills</h1>
        </div>
        <div className="description">
          Join real-time coding battles , solve problems,and climb 
        </div>
         <div className="description">
          the global leaderboard. Sharpen your skills while 
        </div>
         <div className="description">
        having fun !
        </div>
        <div className="buttons">
          {showjoin?<button className='light' onClick={()=>{setshowjoin(false)}}>Cancel</button>:
          <button className='dark' onClick={handelcreate}>Create Room</button>}
          {/* <button className='light'><input type="text" /></button> */}
           <div className="join-room">
   
    {!showjoin?<button className={'light'} onClick={()=>{setshowjoin(true)}}>Join Room</button>:
    <button className={'dark'} onClick={handlejoin}>Join Room</button>}
     {showjoin?<div className={`input-wrapper ${showjoin ? "active" : ""}`}><input 
      type="text" 
      placeholder="Enter Room ID" 
      value={roomId}
      onChange={(e) => setRoomId(e.target.value)}
      className="room-input"
    />
    </div>:<></>}
  </div>
          {/* <button className='light' onClick={handlejoin}>Join Room</button> */}
        </div>
      </div>
      <div className="features">
       
         <div className="featurecard">
          <div className="img">
            <img src={light} alt="" />
          </div>
          <div className="toptext">
           <h4> Real-time Battels</h4>
          </div>
          <div className="bottomtext">
            <div><span>Compete with friends</span></div>
            <div><span>or strangers instantly</span></div> 
          </div>
        </div>
         <div className="featurecard">
          <div className="img">
            <img src={trophy} alt="" />
          </div>
          <div className="toptext">
            <h4>Leaderboard</h4>
          </div>
          <div className="bottomtext">
            <div><span>Track your progress </span></div>
            <div><span>and rise to the top</span></div>
          </div>
        </div>
         <div className="featurecard">
          <div className="img">
            <img src={monitor} alt="" />
          </div>
          <div className="toptext">
            <h4>Multi-language Support</h4>
          </div>
          <div className="bottomtext">
            <div><span>Code in pyhton ,</span>
            </div><div><span> c++ or java</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landingpage
