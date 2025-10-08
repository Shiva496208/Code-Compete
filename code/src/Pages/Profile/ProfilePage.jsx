import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import avatar from '../../assets/profile.png';
import { useParams } from "react-router-dom";
import Navbar from "../../Component/Navbar/Navbar";
import profile from '../../assets/profile_icon.png'
const ProfilePage = () => {
  const { username } = useParams();
  const [userdetail, setUserdetail] = useState(null);
  const[isediting,setisediting]=useState(false);
  const [socialLinks, setSocialLinks] = useState({});
  const[twiter,settwiter]=useState();
  const[github,setgithub]=useState();
  const[linkedin,setlinkedin]=useState();
  const fetchUser = async () => {
    try {
      const res = await fetch(`http://192.168.172.254:8008/profile/${username}`);
      const data = await res.json();
      setUserdetail(data);
      setSocialLinks({ ...data.socialLinks });
  
  // setisediting(true);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(()=>{
      setgithub(socialLinks.github );   
  setlinkedin(socialLinks.linkedin );
  settwiter(socialLinks.twitter );   
  },[socialLinks]);
const changeedit=async()=>{
 
 if(isediting){
  // settwiter(socialLinks.twiter);
  // setlinkedin(socialLinks.linkedin);
  // setgithub(socialLinks.github);
   const socials = {
      github: github ,
      linkedin: linkedin ,
      twitter: twiter ,
    };
  try {
    const res=await fetch(`http://192.168.172.254:8008/update/${username}`,{
      method:"PUT",
       headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({socials}),
    });
    const updateddata=await res.json();
    console.log(updateddata);
    // setSocialLinks(updateddata.socials);
    // setgithub(updateddata.socials.github);
    //   setlinkedin(updateddata.socials.linkedin);
    //   settwiter(updateddata.socials.twitter);
  } catch (error) {
    console.log(error);
  }
 }
  setisediting(!isediting);
}
  useEffect(() => {
    fetchUser();
  }, [isediting]);
  
  if (!userdetail) return <p>Loading...</p>;

  const winRate =
    userdetail.stats.battlesPlayed > 0
      ? Math.round((userdetail.stats.battlesWon / userdetail.stats.battlesPlayed) * 100)
      : 0;

  return (
    <div className="profilepage">
      <Navbar username={username}/>
    <div className="profile-container">
    
      <div className="profile-left">
        <div className="profile-header-card">
          <img
            src={profile}
            alt="avatar"
            className="profile-avatar-large"
          />
          <h2 className="profile-username">{userdetail.username}</h2>
          <p className="profile-tagline">⚡ Competitive Coder</p>
        </div>

        <div className="profile-stats-cards">
          <div className="stat-card">
            <h4>{userdetail.stats.battlesPlayed}</h4>
            <p>Battles Played</p>
          </div>
          <div className="stat-card">
            <h4>{userdetail.stats.battlesWon}</h4>
            <p>Battles Won</p>
          </div>
          <div className="stat-card">
            <h4>{winRate}%</h4>
            <p>Win Rate</p>
          </div>
        </div>

       <div className="profile-socials">
      <h3>Connect</h3>
      <div className="social-links-vertical">
        {
          isediting ? (
            <div className="social-input-wrapper">
              <img src={profile} alt="GitHub" className="social-input-icon"  />
            <input
              type="text"
              name="github"
              value={github}
              onChange={(e)=>{setgithub(e.target.value)}}
              placeholder={socialLinks.github}
            />
            </div>
          ) : ( 
             socialLinks.github?
            <a href={socialLinks.github} target="_blank" rel="noreferrer">
              <img src={profile} alt="GitHub" />
              <span>{github}</span>
            </a>:<></>
          )
        }

        { 
          isediting ? (
            <div className="social-input-wrapper">
              <img src={profile} alt="GitHub" className="social-input-icon"  />
            <input
              type="text"
              value={linkedin}
              onChange={(e)=>{setlinkedin(e.target.value)}}
              // placeholder={socialLinks.linkedin}
            />
            </div>
          ) : socialLinks.linkedin?(
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
              <img src={profile} alt="LinkedIn" />
              <span>{linkedin}</span>
            </a>
          ):<></>
        }

        {
          isediting ? (
            //  <img src={profile} alt="Twitter" />
            <div className="social-input-wrapper">
            <img src={profile}lt="Twitter" className="social-input-icon" />
            <input
              type="text"
              name="twitter"
              value={twiter}
              onChange={(e)=>{settwiter(e.target.value)}}
              placeholder={socialLinks.twitter}
            />
            </div>
          ) :socialLinks.twitter? (
            <a href={socialLinks.twitter} >
              <img src={profile} alt="Twitter" />
              <span>{twiter}  </span>
            </a>
          ):<></>
      }

        {/* {email && (
          isEditing ? (
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
            />
          ) : (
            <a href={`mailto:${email}`}>
              <img src="/icons/email.svg" alt="Email" />
              <span>Email</span>
            </a>
          )
        )} */}
      </div>

     
    </div>
        {/* <div className="edit"><button>Edit</button></div> */}
         <div className="edit">
          {isediting? <button onClick={()=>{setisediting(!isediting)}} className="cancel">Cancel</button>:<></> }
        <button onClick={changeedit} >{isediting ? "Save" : "Edit"}</button>
        
      </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="profile-right">
        <div className="profile-history">
          <h3>Battle History</h3>
          {userdetail.battleHistory && userdetail.battleHistory.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Opponent</th>
                  <th>Result</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {userdetail.battleHistory.map((battle, idx) => (
                  <tr key={idx}>
                    <td>{battle.opponent.username || battle.opponent}</td>
                    <td className={battle.result}>
                      {battle.result.charAt(0).toUpperCase() + battle.result.slice(1)}
                    </td>
                    <td>{new Date(battle.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No battles yet.</p>
          )}
        </div>

        <div className="profile-friends">
          <h3>Friends</h3>
          {userdetail.friends && userdetail.friends.length > 0 ? (
            <div className="friends-list">
              {userdetail.friends.map((friend, idx) => (
                <div key={idx} className="friend-card">
                  <img src={friend.avatar || avatar} alt={friend.username} />
                  <p>{friend.username}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No friends added yet.</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfilePage;
