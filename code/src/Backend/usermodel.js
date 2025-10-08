const express=require('express');
const mongoose=require("mongoose");
const cors=require('cors');
const { use } = require('react');

const userschema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  avatar: { type: String, default: "" },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],

  
  stats: {
    battlesPlayed: { type: Number, default: 0 },
    battlesWon: { type: Number, default: 0 },
  },

  
  battleHistory: [
    {
      opponent: { type: String, },
      result: { type: String, enum: ["win", "loss", "draw"] },
      date: { type: Date, default: Date.now },
    },
  ],

 
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    email: { type: String, default: "" },
  },

 
  rank: { type: String, default: "Unranked" },
});
mongoose.connect("mongodb://127.0.0.1:27017/codebattle")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const app=express();
app.use(cors({
  origin: "http://192.168.172.254:5173",
  methods: ["GET", "POST","PUT"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
const user=mongoose.model("user",userschema)
app.post("/signup",async(req,res)=>{
const {username,email,password}=req.body;
try{
    const newuser=new user({username:username,email:email,password:password});
    await newuser.save();
    return res.json({ success: true });
}catch (error) {
  console.error(error);
    return res.json({ success: false, message: error.message });
}
}
)
app.post("/login",async(req,res)=>{
const {email,password}=req.body;
try{
    const founduser= await user.findOne({email});
    if(!founduser){
        return res.json({ success: false, error:"user not found"});
    }
  const ismatch=founduser.password==password;
 
  if(ismatch){
    return res.json({ success: true, });
  }else{
     return res.json({success: false,error:"Incorrect password"});
  }
}catch (error) {
  console.error(error);
    return res.status(500).json({ success: false, message: error.message });
}
}
)
app.get("/getinfo/:email",async(req,res)=>{
  try{
    const {email}=req.params;
const details=await user.findOne({email:email});
if(!details){res.json({message:"user not found"})}
res.json(details);
  }
  catch(err){
    console.log(err);
  }
})
app.get("/profile/:username",async(req,res)=>{
  try{
    const {username}=req.params;
const details=await user.findOne({username:username});
if(!details){res.json({message:"user not found"})}
res.json(details);
  }
  catch(err){
    console.log(err);
  }
})
app.put("/update/:username",async(req,res)=>{
  const{username}=req.params;
  const {socials}=req.body;
  const updated=await user.findOneAndUpdate({
    username
  },{socialLinks:socials},{new:true});
  console.log(updated);
   res.json(updated);
})
app.put("/updaterecord",async(req,res)=>{
  
  const{battleuser}=req.body;
      const[user1,user2]=battleuser;
   const winner=user1.username
   for(const u of battleuser){
     const opponent = battleuser.find(p => p.username !== u.username);
     const iswinner=winner===u.username;
      await user.updateOne(
        { username: u.username },
        {
          $push: {
            battleHistory: {
              $each:[{
              opponent: opponent.username, 
              result:
                winner === null
                  ? "draw"
                  : winner === u.username
                  ? "win"
                  : "loss",
            },
          ],
          $position:0,
        },
          },
        })
   await user.updateOne({username:u.username},{
    $inc:{
      "stats.battlesPlayed":1,
      "stats.battlesWon":iswinner?1:0,
    }
   })
    console.log("updated");
   }
   res.status(200).json({ message: "Stats updated", winner });
})
app.listen(8008,()=>{
    console.log("port is running");
})