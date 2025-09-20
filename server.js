import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { OAuth2Client } from "google-auth-library";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const CLIENT_ID = "1002818907670-fecu2l5arbgfmqm68s6cupocouigvc1m.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  });
  return ticket.getPayload();
}

// ✅ Google login
app.post("/auth/google", async (req, res) => {
  try {
    const { token } = req.body;
    const userData = await verifyGoogleToken(token);
    res.json({ success: true, user: { name: userData.name, email: userData.email, picture: userData.picture } });
  } catch {
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
});

// ✅ Normal signup
app.post("/auth/signup", (req, res) => {
  const { name, email, password } = req.body;
  // save to DB (here we simulate)
  res.json({ success: true, message: "User registered successfully", user: { name, email } });
});

// ✅ Normal signin
app.post("/auth/signin", (req, res) => {
  const { email, password } = req.body;
  // Check DB (here simulate)
  if (email === "test@example.com" && password === "1234") {
    res.json({ success: true, user: { name: "Test User", email } });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
