const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const relationshipModel = new Schema(
  {
    startTime: { type: String, required: true },
    inRelationship: [
      { type: Schema.Types.ObjectId, ref: "users", required: true }
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "posts"
      }
    ]
  },
  {
    timestamps: { createdAt: "createdAt" }
  }
);

module.exports = mongoose.model("relationships", relationshipModel);
