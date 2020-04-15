let express = require("express");
let hbs = require("express-handlebars");
let multer = require("multer");
let app = express();

app.engine(
  ".hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "",
    layoutsDir: "",
  })
);

app.set("view engine", "hbs");

let storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "image/jpeg") {
      req.fileValidationError = "Sai định dạng";
      return cb(null, false, new Error("Sai định dạng"));
    }
    cb(null, true);
  },
});
app.listen(8080);
app.get("/", (req, res) => {
  res.render("index");
});
let up = upload.array("avatar", 3);
app.post("/upload", (req, res) => {
  up(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.send("Upload file không thành công");
    } else if (req.fileValidationError) {
      return res.send("File không đúng định dạng jpg");
    }
    res.send("Upload file thành công");
  });
});
