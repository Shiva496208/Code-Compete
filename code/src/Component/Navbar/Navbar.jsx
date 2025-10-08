import React from 'react'
import { Form, Link, useNavigate } from "react-router-dom";
import profile_icon from '../../assets/profile_icon.png'
import code_compete from '../../assets/code_compete1.png'
import './Navbar.css'
const Navbar = ({username}) => {
  const navigate=useNavigate();
  const gotoprofile=()=>{
    navigate(`/profile/${username}`);
  }
  return (
    <div className='navbar'>
      <div className="left">
        <img src={code_compete} alt="" />
      </div>
      <div className="center">
      <span>Problems</span>
      <span>Leaderboard</span>
      <span>Friends</span>
      <span>About us</span>
      </div>
      <div className="right">
        {/* <h2>{</h2> */}
        {!username?<span onClick={()=>{
          navigate("/login")
        }}>Login</span>:<> <span onClick={gotoprofile} >{username}</span><img onClick={gotoprofile} src={profile_icon} alt="" /></> }
      </div>
    </div>
  )
}

export default Navbar
