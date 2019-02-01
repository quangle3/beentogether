const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentModel = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    content: { type: String, required: true }
  },
  {
    timestamps: { createdAt: "createdAt" }
  }
);

const postModel = new Schema(
  {
    image: { type: Buffer },
    contentType: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    content: { type: String },
    comments: { type: [commentModel], default: [] },
    imageUrl: { type: String },
    description: { type: String }
  },
  {
    timestamps: { createdAt: "createdAt" }
  }
);

module.exports = mongoose.model("posts", postModel);
