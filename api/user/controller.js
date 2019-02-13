const userModel = require("./model");
const fs = require("fs");

const createUser = async ({ username, password, email, phone, birthday }) =>
  new Promise((resolve, reject) => {
    userModel
      .create({ username, password, email, phone, birthday })
      .then(user => resolve({ username: user.username, id: user._id }))
      .catch(err => reject(err));
  });

const getAllUsers = () =>
  new Promise((resolve, reject) => {
    userModel
      .find({})
      .select("_id username email phone relationshipId")
      .exec()
      .then(data =>
        resolve(
          data.map(user =>
            Object.assign({}, user._doc, {
              avatarUrl: `api/users/${user._id}/avatar`
            })
          )
        )
      )
      .catch(err => reject(err));
  });

const getOneUser = id =>
  new Promise((resolve, reject) => {
    userModel
      .findById(id)
      .select("_id username password email phone birthday contentType")
      .exec()
      .then(data =>
        resolve(
          Object.assign({}, data._doc, {
            avatarUrl: `/api/users/${id}/avatar`
          })
        )
      )
      .catch(err => reject(err));
  });

const getAvatarData = id =>
  new Promise((resolve, reject) => {
    userModel
      .findById(id)
      .select("avatar contentType")
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const updateUserAccount = (id, { password }) =>
  new Promise((resolve, reject) => {
    userModel
      .findById(id)
      .then(user => {
        user.password = password;
        return user.save();
      })
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const updateUserInfo = (id, { username, email, phone, birthday }) =>
  new Promise((resolve, reject) => {
    userModel
      .findById(id)
      .then(user => {
        (user.username = username),
          (user.email = email),
          (user.phone = phone),
          (user.birthday = birthday);
        return user.save();
      })
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const updateAvatar = (id, avatarFile) =>
  new Promise((resolve, reject) => {
    userModel
      .update(
        {
          _id: id
        },
        {
          avatar: fs.readFileSync(avatarFile.path),
          contentType: avatarFile.mimetype
        }
      )
      .exec()
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const deleteUser = id =>
  new Promise((resolve, reject) => {
    userModel
      .findByIdAndDelete(id)
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const getUserForAuth = username =>
  new Promise((resolve, reject) => {
    userModel
      .findOne({ username })
      .select("username password _id")
      .then(user => resolve(user))
      .catch(err => reject(err));
  });

module.exports = {
  createUser,
  getAllUsers,
  getOneUser,
  getAvatarData,
  updateUserAccount,
  updateUserInfo,
  updateAvatar,
  deleteUser,
  getUserForAuth
};
