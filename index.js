const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

dotenv.config();
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(express.static(path.join(__dirname, "/client/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});
app.use((req, res, next) => {
  console.log("passei aqui");
  mongoose
    .connect(process.env.MONGOL_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    })
    .then(() => {
      console.log("running mongoldb");
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});
/*mongoose.connect(process.env.MONGOL_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      cb(null, "images");
    } catch (error) {
      console.log(error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    try {
      cb(null, req.body.name);
    } catch (error) {
      console.log(error);
      cb(error);
    }
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen(process.env.PORT, () => {
  console.log("Backend is running.");
});
