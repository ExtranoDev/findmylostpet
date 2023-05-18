const db = require("../models");
const Pet = db.pets;
const fs = require("fs");
const path = require("path");

// Create and Save a new Pet
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Pet
  const pet = new Pet({
    name: req.body.name,
    description: req.body.description,
    imgURL: req.body.imgURL,
    published: req.body.published ? req.body.published : false,
  });

  // Save Pet in the database
  pet
    .save(pet)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while reporting lost pet.",
      });
    });
};

// Retrieve all Pets from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  Pet.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving pets.",
      });
    });
};

// Find a single Pet with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Pet.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Pet with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Pet with id=" + id });
    });
};

// Update a Pet by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Pet.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Pet with id=${id}. Maybe Pet was not found!`,
        });
      } else res.send({ message: "Pet was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Pet with id=" + id,
      });
    });
};

// Delete a Pet with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  fs.unlink(
    path.join("uploads", req.params.imgURL),
    (error) => {
      if (error) {
        console.error("Failed to delete profile image", error);
      }
    }
  );
  Pet.findByIdAndRemove(id)
    .then((data) => {
      console.log(data);

      if (!data) {
        res.status(404).send({
          message: `Cannot delete Pet with id=${id}. Maybe Pet was not found!`,
        });
      } else {
        res.send({
          message: "Pet was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Pet with id=" + id,
      });
    });
};

// Delete all Pets from the database.
exports.deleteAll = (req, res) => {
  Pet.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Pets were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all pets.",
      });
    });
};

// Find all published Pets
exports.findAllPublished = (req, res) => {
  Pet.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Pets.",
      });
    });
};
