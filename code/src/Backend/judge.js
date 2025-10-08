import express from "express";
// import fetch from "node-fetch";
import cors from "cors";
// import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/submissions", async (req, res) => {
     console.log("➡️ Forwarding to Judge0:", req.body);
  const response = await fetch(
    "https://api.judge0.com/submissions?base64_encoded=false&wait=true",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    }
  );
  const data = await response.json();
  res.json(data);
});

app.listen(4000, () => console.log("Proxy running on http://localhost:4000"));
