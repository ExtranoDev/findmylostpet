module.exports = (mongoose) => {
  var petSchema = mongoose.Schema(
    {
      name: String,
      description: String,
      imgURL: {type: String, required: true},
      published: Boolean,
    },
    { timestamps: true }
  );

  petSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Pet = mongoose.model("pet", petSchema);
  return Pet;
};
