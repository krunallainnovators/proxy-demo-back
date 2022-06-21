const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const app = express(),
  bodyParser = require("body-parser");

const port = process.env.PORT || 8080;

app.use(cookieParser());
//enable cors
app.use(cors());

//refresh token
const refreshToken = "YRjxLpsjRqL7zYuKstXogqioA_P3Z4fiEuga0NCVRcDSc8cy_9msxg";
const accessToken = "P3Z4fiEuga0NCVRcDSc8cy_YRjxLpsjRqL7zYuKstXogqioA_9msxg";
// place holder for the data
const users = [
  {
    firstName: "first1",
    lastName: "last1",
    email: "abc@gmail.com"
  },
  {
    firstName: "first2",
    lastName: "last2",
    email: "abc@gmail.com"
  }
];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../my-app/build")));

//get all users
app.get("/api/users", (req, res) => {
  const authtoken = req.headers.authorization;

  if (
    req.cookies["HttpOnly-CookieKey"] != refreshToken ||
    authtoken !== accessToken
  ) {
    res.status(401).json("401 Unauthorized HTTP");
  } else {
    res.status(200).json(users);
  }
  console.log("Req hdr:", req.headers);
  console.log("Cookies: ", req.cookies);
  console.log("1:", req.cookies["dummycookie"]);
});

//create new user
app.post("/api/create", (req, res) => {
  const user = req.body.user;
  users.push(user);
  res.status(200).json("user addedd");
});

//login to get token
app.post("/api/login", (req, res) => {
  const user = req.body.user;
  res.cookie("HttpOnly-CookieKey", refreshToken, {
    sameSite: "strict",
    path: "/",
    expires: new Date(new Date().getTime() + 5000 * 1000),
    httpOnly: true,
    secure: true
  });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.status(200).json({ token: accessToken });
});

//logout clear token
app.get("/api/logout", (req, res) => {
  res.clearCookie("HttpOnly-CookieKey");
  console.log("Req hdr:", req.headers);
  res.status(200).json("users logout");
});

//all static react request
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../my-app/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
