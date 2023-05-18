const multer = require("multer");
const PATH = "uploads/";

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = (app) => {
  const pets = require("../controllers/pets.controller.js");

  var router = require("express").Router();

  // Create a new Pets
  router.post("/", pets.create);

  router.post("/upload", upload.single("file"), (req, res) => {
    res.json({ filename: req.file ? req.file.filename : "" });
  });

  // Retrieve all Pets
  router.get("/", pets.findAll);

  // Retrieve all published Pets
  router.get("/published", pets.findAllPublished);

  // Retrieve a single Pets with id
  router.get("/:id", pets.findOne);

  // Update a Pets with id
  router.put("/:id", pets.update);

  // Delete a Pets with id
  router.delete("/:id/:imgURL", pets.delete);

  // Delete all Pets
  router.delete("/", pets.deleteAll);

  app.use("/api/pets", router);
};
