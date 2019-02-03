const relationshipModel = require("./model");
const userModel = require("../user/model");

const createRela = ({ startTime, userId }) =>
  new Promise((resolve, reject) => {
    relationshipModel
      .create({
        startTime,
        inRelationship: userId
      })
      .then(data => resolve(data._id))
      .catch(err => reject(err));
  });

const getAllRela = async () => {
  try {
    return await relationshipModel
      .find({}, "startTime")
      .populate({
        path: "posts",
        select: { image: 0 },
        populate: {
          path: "createdBy",
          select: "username "
        }
      })
      .populate("inRelationship", "username email phone birthday");
  } catch (error) {
    return error;
  }
};

const getOneRela = id =>
  new Promise((resolve, reject) => {
    relationshipModel
      .findById(id)
      .select("_id startTime posts")
      .populate("createdBy", "username email phone birthday avatarUrl")
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const getRelaForUser = async (userId) => {
  try {
    return await relationshipModel
      .findOne({ inRelationship: userId })
      .populate("inRelationship", "username email birthday phone contentType")
      .populate({
        path: "posts",
        select: {image:0},
        populate: {
          path: "createdBy",
          select: "username",
        },
      })
  } catch (error) {
    return error;
  }
};

const getPostOfRela = async (userId) => {
  try {
    const rela =  await relationshipModel
      .findOne({ inRelationship: userId })
      .populate("inRelationship", "username email birthday phone contentType")
      .populate({
        path: "posts",
        select: {image:0},
        options: {limit:5},
        populate: {
          path: "comments.createdBy",
          select: "username contentType",
        },
      })
      .populate({
        path: "posts",
        select: {image:0},
        populate: {
          path : "createdBy",
          select : "username contentType"
        }
      })
      return rela.posts
  } catch (error) {
    return error;
  }
};

const updateStartTime = async (relaId, startTime) => {
  try {
    await relationshipModel.findByIdAndUpdate(relaId, startTime);
  } catch (error) {
    return error;
  }
};

const updateInRelationship = ({ relaId, userId }) =>
  new Promise((resolve, reject) => {
    relationshipModel
      .update(
        {
          _id: relaId
        },
        {
          $push: { inRelationship: userId }
        }
      )
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const deleteRelationship = async(relaId) => {
  try {
    return await relationshipModel.findByIdAndDelete(relaId)
  } catch (error) {
    return error;
  }
};

module.exports = {
  createRela,
  getAllRela,
  getOneRela,
  getRelaForUser,
  getPostOfRela,
  updateStartTime,
  updateInRelationship,
  deleteRelationship
};
