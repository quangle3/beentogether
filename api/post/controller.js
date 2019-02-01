const postModel = require("./model");
const fs = require("fs");
const relationshipModel = require("../relationship/model");

const createPostContent = async ({ content, userId }) => {
  try {
    const created = await postModel.create({ createdBy: userId, content });
    await relationshipModel.findOneAndUpdate(
      { inRelationship: userId },
      { $push: { posts: created._id } }
    );
    return created._id;
  } catch (error) {
    return error;
  }
};

const createPostImage = async (imageFile, { userId, description }) => {
  try {
    const created = await postModel.create({
      createdBy: userId,
      image: fs.readFileSync(imageFile.path),
      contentType: imageFile.mimetype,
      description
    });
    await postModel.update(
      { _id: created._id },
      { imageUrl: `/api/posts/${created._id}/image` }
    );
    await relationshipModel.update(
      { inRelationship: userId },
      { $push: { posts: created._id } }
    );
    return created;
  } catch (error) {
    return error;
  }
};

const getAllPost = async () => {
  try {
    return await postModel
      .find({}, { image: 0 })
      .populate("createdBy", "username email phone birthday");
  } catch (error) {
    return error;
  }
};

const getOnePost = async postId => {
  try {
    return await postModel.findOne({_id:postId}, { image: 0 }).populate("createdBy","username contentType").populate("comments.createdBy", "username contentType");
  } catch (error) {
    return error;
  }
};

const getPostUser = async userId => {
  try {
    return await postModel.find({createdBy:userId},{image:0})
  } catch (error) {
    return error;
  }
};

const getImageData = async postId => {
  try {
    return await postModel.findById(postId, "image contentType");
  } catch (error) {
    return error;
  }
};

const updateImage = async ({ postId, imageFile }) => {
  try {
    await postModel.update(
      { _id: postId },
      {
        image: fs.readFileSync(imageFile.path),
        contentType: imageFile.mimetype
      }
    );
  } catch (error) {
    return error;
  }
};

const updateContent = async (postId, { content }) => {
  try {
    await postModel.update({ _id: postId }, { content });
  } catch (error) {
    return error;
  }
};

const addComment = async ({ postId, userId, content }) => {
  try {
    return await postModel.update(
      { _id: postId },
      { $push: { comments: { createdBy: userId, content } } }
    );
  } catch (error) {
    return error;
  }
};

const deleteComment = async ({ postId, commentId }) => {
  try {
    await postModel.update(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } }
    );
  } catch (error) {
    return error;
  }
};

const deletePost = async id => {
  try {
    await postModel.findByIdAndDelete(id);
    await relationshipModel.findOneAndUpdate(
      { posts: id },
      { $pull: { posts: id } }
    );
  } catch (error) {
    return error;
  }
};

module.exports = {
  createPostContent,
  createPostImage,
  getAllPost,
  getOnePost,
  getPostUser,
  getImageData,
  updateImage,
  updateContent,
  addComment,
  deleteComment,
  deletePost
};
