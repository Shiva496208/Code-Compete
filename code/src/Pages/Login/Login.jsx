import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [signState, setSignState] = useState("sign in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate=useNavigate();

 const handlesignup=async ()=>{
    try{
        const res= await fetch("http://192.168.172.254:8008/signup",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({username:name,email,password}),
        })
         const data = await res.json();
         if(data.success){
            navigate("/",{ state: email });
         }
    }
    catch(err){
        console.log(err);
        
    }
 }
 const handlelogin=async ()=>{
    try{
        const res= await fetch("http://192.168.172.254:8008/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({email,password}),
        })
         const data = await res.json();
         console.log(data);
         if(data.success){
          console.log("login successful");
            navigate("/",{ state: email});
         }
         
    }
    catch(err){
        console.log(err);
        
    }
 }
 const handleSubmit = (e) => {
    e.preventDefault();
    if (signState === "sign in") {
      handlelogin();
    } else {
      handlesignup();
    }
  };

  return (
    <div className="login">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <h1>{signState}</h1>

          {signState === "sign up" && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-wrapper">
            <input
              className="passinput"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "🙈" : "👁"}
            </button>
          </div>

          <button className="sub" type="submit">
            {signState}
          </button>
        </form>

        <div className="formswitch">
          {signState === "sign up" ? (
            <p>
              Already have an account?
              <span onClick={() => setSignState("sign in")}> Sign in now</span>
            </p>
          ) : (
            <p>
              New here?
              <span onClick={() => setSignState("sign up")}> Sign up now</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
