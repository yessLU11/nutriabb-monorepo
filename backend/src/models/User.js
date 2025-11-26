// backend/src/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Método para ocultar passwordHash al enviar usuario al frontend
UserSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    email: this.email,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model("User", UserSchema);
