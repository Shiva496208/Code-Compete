import React, { useEffect, useRef, useState } from "react";
import "./Battle.css";
import Navbar from '../../Component/Navbar/Navbar'
import profile2 from '../../assets/profile.png'
import profile_icon from '../../assets/profile_icon.png'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {io} from "socket.io-client";
const languageTemplates = {
  javascript: `function solve(input) {
  // write your code here
  return "";
}

// Example usage
console.log(solve("2 3"));`,
  python: `def solve(input):
    # write your code here
    return ""

# Example usage
print(solve("2 3"))`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

string solve(string input) {
    // write your code here
    return "";
}

int main() {
    cout << solve("2 3") << endl;
    return 0;
}`,
  java: `import java.util.*;

public class Main {
    public static String solve(String input) {
        // write your code here
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println(solve("2 3"));
    }
}`,
};
const languageIds = {
  cpp: 54,
  javascript: 63,
  python: 71,
};
const Battle = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLang, setSelectedLang] = useState("cpp");
  const [code, setCode] = useState(languageTemplates["cpp"]);
  const visited=useRef([]);
  const [loadingiindx,setloadingindx]=useState(null);
  const [results, setresults] = useState({});
  const location=useLocation();
  const {currentuser}=location.state;
  const[users,setusers]=useState([]);
  const {id}=useParams();
 const navigate=useNavigate();
  const roomid=id;
  //  console.log(currentuser);
  const socket = useRef(null);
  const[battleuser,setbattleuser]=useState([]);

  
  useEffect(()=>{
    socket.current = io("http://192.168.172.254:5000");
    socket.current.emit("joinroom", roomid, { username: currentuser.username });
    socket.current.on("updateprogress",({username,indx,ispass})=>{
      console.log(username);
      setbattleuser(prev=>
        prev.map(u=>{
          if(u.username==username){
            const Updated=new Set(u.testCasesPassed);
            if(ispass){
            Updated.add(indx);
            }else{
              Updated.delete(indx)
            }
             return { ...u, testCasesPassed: Updated };
          }
          return u;
          }
        )
      );
    });
    socket.current.on("details",({users})=>{
      console.log(users,"Ff");
      setusers(users);
       setbattleuser(users.map(u => ({
      ...u,
      testCasesPassed: new Set(u.testCasesPassed || []),
      score: u.score||0
    })));
    })
    socket.current.on("submitcode",(updatedscore)=>{
      console.log("submitcode recieved");
       const fixed = updatedscore.map(u => ({
    ...u,
    testCasesPassed: Array.isArray(u.testCasesPassed)
      ? new Set(u.testCasesPassed)
      : new Set() ,
      // issubmitted:true // convert back to Set
  }));
 console.log("ficed",fixed);
  setbattleuser(fixed);
    })
    return ()=>{socket.current.disconnect();}; 
  },[]);
  const handlechange=(e)=>{
    const lang=e.target.value;
    setSelectedLang(lang);
    setCode(languageTemplates[lang]);

  }
  const getSubmission=async (tokenid)=>{
    try {
       const response=await fetch( `https://ce.judge0.com/submissions/${tokenid}?base64_encoded=true&fields=*`,{
      method:"GET",
      headers:{
        'Content-Type': 'application/json',
        'x-rapidapi-key': 'YOUR API kEY',
		'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      }
    });
    const result=await response.json();
    console.log(result);
    return result;
    } catch (error) {
      console.log(error);
    }
   
  }
  const getresult = async (testcase,indx) => {
     setloadingindx(indx);
    
  try {
    console.log(testcase.input);
   const res = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*',{
	method: 'POST',
	headers: {
		'x-rapidapi-key': ' YOUR API KEY',
		'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
		'Content-Type': 'application/json'
	},
	body:JSON.stringify ({
		language_id: languageIds[selectedLang],
		source_code: btoa(code),
		stdin: btoa(testcase.input),
    expected_output: btoa(testcase.output)
	})

});
const data=await res.json();
const tokenid=data.token;
let statuscode=2;
let result;
while (statuscode===2||statuscode===1){
   result= await getSubmission(tokenid);
  statuscode=result.status_id;
console.log(statuscode);
}
// return result;
   const stdout = atob(result.stdout || "");
  const expected = atob(result.expected_output || "");
  const error=atob(result.compile_output);
 
  const isaccepted = result.status.description==="Accepted";
  if(isaccepted){console.log("sent");socket.current.emit("updateprogress",{roomid,username:currentuser.username,indx,ispass:true})}
  else{
    socket.current.emit("updateprogress",{roomid,username:currentuser.username,indx,ispass:false})
  }
 setresults((prev) => ({
      ...prev,
      [indx]: isaccepted ? "Accepted " : "Try Again ",
      expected:expected,
      stdout:stdout,
      compile_output:statuscode,
      compileerror:error,
    }));
    return isaccepted;
  }
  
   catch (err) {
    console.error("Judge0 request failed:", err);
  }
  finally{
  setloadingindx(null);
  }
};
const runall=async()=>{
  let alltestcase=problem.testCases.map((tc,indx)=>(
    {...tc}
  ))
 

 for(let i=0;i<alltestcase.length;i++){
  const ispassed=await getresult(alltestcase[i],i);
  if(!ispassed){
    return i;
  }
  }
  return 5;
// console.log(alltestcase);
}
const handlesubmit=async()=>{
  const x=await runall();
  // console.log("mm",x);
    const updated=battleuser.map(u => {
      if (u.username === currentuser.username) {
        return { ...u,testCasesPassed:Array.from(u.testCasesPassed), score: x,issubmitted:true };
      }
      return u;
    });
    //  setbattleuser(updatedscore);
     const updatedscore=[...updated].sort((a, b) => b.score - a.score);
    await socket.current.emit("submitcode",{roomid,updatedscore})
    navigate(`/leaderboard/${roomid}` ,{state:{updatedscore,currentuser}});
    console.log("dd",battleuser);
}


  useEffect(() => {
    fetch(`http://192.168.172.254:8000/questions?exclude=${visited.current.join(",")}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setProblem(data);
          // visited.push(problem.questionId);
          visited.current.push(data.questionId);
          // console.log(problem.questionId);
            // take only the first problem
        }
      })
      .catch((err) => console.error("Error fetching question:", err));
  }, []);

  if (!problem) {
    return <div className="loading">Loading problem...</div>;
  }

  return (
    <div className="battle-container">
      {/* ---------- NAVBAR ---------- */}
     <Navbar username={currentuser.username}/>

      <div className="battle">
        {/* ---------- LEFT SECTION ---------- */}
        <div className="left-section">
          {/* Top two rectangle divs */}
        <div className="top-cards">
  {battleuser.map((user, idx) => (
    <div className="user-card" key={idx}>
      <div className="user-header">
        <img src={profile_icon} alt="profile" className="profile-pic" />
        <h3 className="username">{user.username}</h3>
      </div>
      <div className="stats">
        <p>Total Matches: {user.stats?.battlesPlayed || 0}</p>
      </div>
      <div className="testcase-tracker">
        <p>Test Cases Passed:</p>
        <div className="tracker-bar">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`tracker-segment ${
                i <user.testCasesPassed.size ? "passed" : ""
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  ))}
</div>


          {/* Problem Description */}
          <div className="problem-box">
            <h2>{problem.title}</h2>
            <p className="difficulty">Difficulty: {problem.difficulty}</p>
            <p className="description">{problem.description}</p>

            {/* Examples */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="example">
                <strong>Examples:</strong>
                <ul>
                  {problem.examples.map((ex, idx) => (
                    <li key={idx} className="example-item">
                      <div>
                        <strong>Input:</strong> {ex.input}
                      </div>
                      <div>
                        <strong>Output:</strong> {ex.output}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Public Test Cases */}
         
          </div>
        </div>

        {/* ---------- RIGHT SECTION ---------- */}
        <div className="right-section">
          {/* Code Editor */}
          <div className="editor-box">
            {/* Language Selector */}
            {problem.languages && (
              <div className="language-select" >
                <div className="code"><h2>Code</h2></div>
                <div>
                <label>Language: </label>
                <select
                  value={selectedLang}
                  onChange={handlechange}
                >
                  {problem.languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                </div>
              </div>
            )}

            {/* Code editor */}
            <textarea
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your solution here..."
              spellCheck={false}
            ></textarea>

            {/* Buttons at bottom right */}
            <div className="editor-buttons">
              <button className="run-btn" onClick={runall} >Run</button>
              <button className="submit-btn" onClick={handlesubmit}>Submit</button>
            </div>
          </div>

          {/* Test cases output */}
        {/* Test cases output */}
        {/* Test cases output */}
<div className="testcases-box">
 
  <div className="both">
  <div className="testcases-list">
     <div className="testboxheading"><h3>Test Cases</h3></div>
        {/* <h4>Examples:</h4> */}
        
        {/* <h4>Test Cases:</h4> */}
        {problem.testCases.map((tc, idx) => (
          <div key={tc._id || idx} className="testcase-row">
            <span className="testcase-index">{idx + 1}.</span>
            <span className="testcase-input">
              Input: {tc.input}
            </span>
            {loadingiindx === idx ? (
        <div className="loader"></div>
      ) : (
        <button
          className={`play-btn${results[idx]?results[idx].toLowerCase().replace(/\s+/g, "-"):""}`}
          onClick={() => {
            getresult(problem.testCases[idx],idx) // show loader for this button
            // console.log("Play example:", ex);

            // fake timeout to reset loader (replace with your async logic)
            // setTimeout(() => setLoadingIndex(null), 2000);
          }}
        >
         {results[idx]?results[idx]:"▶ Play Test Case"}
        </button>
      )}
       </div>
        ))}
 </div>
  <div className="output">
    <div className="testboxheading"><h3>Output</h3></div>
    {(results.compile_output===3||results.compile_output===4)?<div className="describe">
      <div>Found:{results.stdout}</div>
      <div>Expected:{results.expected}</div>
    </div>:
    <div className="describeerror">
      <p>{results.compileerror}</p>
    </div>}
  </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default Battle;  