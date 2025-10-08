const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 5000;
const rooms = {};

app.use(cors({
  origin: "http://192.168.172.254:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); 


const httpServer = createServer(app);


const io = new Server(httpServer, {
  cors: {
    origin: "http://192.168.172.254:5173",
    methods: ["GET", "POST"]
  }
});

// let onlineUsers = 0;

io.on("connection", (socket) => {
  socket.on("joinroom",(roomid,details)=>{
    if(!rooms[roomid]){rooms[roomid]=[]};
       socket.join(roomid);
      if (!rooms[roomid].some(u => u.username === details.username)){
    rooms[roomid].push({socketid:socket.id,...details});
       }
     io.to(roomid).emit("roomusers", rooms[roomid]);
   if (rooms[roomid].length== 2) {
      io.to(roomid).emit("startBattle", { roomid,users: rooms[roomid] });
    }

  });
   socket.on("updateprogress",({roomid,username,indx,ispass})=>{
    console.log(username,roomid);
  io.to(roomid).emit("updateprogress",{username,indx,ispass});
})
socket.on("submitcode",({roomid,updatedscore})=>{
  io.to(roomid).emit("submitcode",updatedscore);
})
socket.on("details",({users,roomid})=>{
io.to(roomid).emit("details",{users});
})
  // Handle user disconnect
  socket.on("disconnect", () => {
    for (let roomid in rooms) {
      rooms[roomid] = rooms[roomid].filter(id => id !== socket.id);
      if (rooms[roomid].length === 0) delete rooms[roomid];
    }
    console.log("User disconnected:", socket.id);
  });
 
});





app.post("/rooms", (req, res) => {
  const details=req.body;
  console.log(details);
  const roomId = nanoid(8); 
  console.log("Room created:", roomId);
  res.json({ roomid: roomId });
});


app.get("/rooms/:roomId", (req, res) => {
  const{roomId}=req.params;
  const room=rooms[roomId];
  if(room){
    res.json({isexist:true});
  }else{
  res.json({isexist:false});
  }
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running at http://192.168.238.254:${PORT}`);
});
