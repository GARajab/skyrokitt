const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  postingLink: {
    type: String,
  },
  status: {
    type: String,
    enum: ["interested", "applied", "interviewing", "rejected", "accepted"],
  },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [3, "Name Must Be More Than 3 Characters"],
      maxlength: [10, "Name Must Be Less Than Oe Equal 10 Characters"],
    },
    password: { type: String, required: true },
    applications: [applicationSchema],
  },

  {
    timestamps: true, // createdAt and UpdatedAt will be automatically added to each records (username and password)
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
