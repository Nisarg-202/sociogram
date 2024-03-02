require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const middleware = require("./middleware/middleware");
const Message = require("./Schema/MessageSchema");

const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(http, {
  cors: {
    origin: process.env.CLIENT_URL, // https://sociogram-f2859.web.app
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(middleware);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(
  `mongodb+srv://nisarg:${process.env.DATABASE_PASSWORD}@cluster0.x2a77.mongodb.net/socioDB`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

app.get("/testing", function (req, res) {
  res.send("This is a testing route.");
});

io.on("connection", function (socket) {
  console.log("user connected!");
  socket.on("sendMessage", async function ({ from, to, message }) {
    const myMessage = new Message({
      from,
      to,
      message,
      createdAt: new Date().toISOString(),
    });
    await myMessage.save(async function (err) {
      if (err) {
        io.sockets.emit("broadcast", { success: false });
      } else {
        await Message.find(function (err, found) {
          if (err) {
            io.sockets.emit("broadcast", { success: false });
          } else {
            if (found) {
              io.sockets.emit("broadcast", { success: true, messages: found });
            } else {
              io.sockets.emit("broadcast", { success: true, messages: [] });
            }
          }
        });
      }
    });
  });
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

http.listen(process.env.PORT || 5000, function () {
  console.log("Server is running on port 5000.");
});
