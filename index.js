const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const usersRoutes = require("./routes/user-routes");
const postsRoutes = require("./routes/post-routes");
const blogsRoutes = require("./routes/blog-routes");
const itemsRoutes = require("./routes/item-routes");
const videosRoutes = require("./routes/video-routes");
const reviewsRoutes = require("./routes/review-routes");
const { dummy } = require("./controllers/users-controllers");
const cors = require("cors");
const { log } = require("console");

const app = express();
// Parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.options('*', cors());

app.use('/uploads/videos', express.static(path.join('uploads','videos')));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.get("/", dummy);

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/videos", videosRoutes);

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASS;

app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path,(err)=>{
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || "an unknown error occurred",
    status: error.code,
  });
});

mongoose
  .connect(
    `mongodb+srv://${username}:${password}@cluster0.o3vsgrd.mongodb.net/project1`
  )
  .then(() => {
    app.listen(5000);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
