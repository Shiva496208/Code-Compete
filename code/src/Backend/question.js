const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const app=express();
app.use(cors({
  origin: "http://192.168.172.254:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
const Port=8000;
mongoose.connect("mongodb://127.0.0.1:27017/codebattle").
then(console.log("mongoose connected")).catch((err)=>{console.error();}
)
const questionSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  testCases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true },
      hidden: { type: Boolean, default: false } 
    }
  ],
  languages: [{ type: String }], 
}, { timestamps: true });
const questions=mongoose.model("questions",questionSchema);
app.get("/questions",async(req,res)=>{
    try {
      const excludeid=req.query.exclude &&req.query.exclude.length?req.query.exclude.split(","):[];
        const question=await questions.aggregate([
          {$match:{questionId:{$nin:excludeid}}},
          {$sample:{size:1}}]);
    res.json(question[0]);
    } catch (error) {
        console.log("error");
    }
    
})
app.listen(Port,()=>{
    console.log("port is running");
    
})