const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const userController = require("./controller");

router.post("/", (req, res) => {
  userController
    .createUser(req.body)
    .then(data => {
      req.session.userInfo = data
      res.send(data)
    })
    .catch(err => res.status(500).send(err));
});

router.get("/", (req, res) => {
  userController
    .getAllUsers()
    .then(users => res.send(users))
    .catch(err => res.status(500).send(err));
});

router.get("/:id", (req, res) => {
  userController
    .getOneUser(req.params.id)
    .then(user => res.send(user))
    .catch(err => res.status(500).send(err));
});

router.get("/:id/avatar", (req, res) => {
  userController
   .getAvatarData(req.params.id)
   .then(data => {
     res.contentType(data.contentType);
     res.send(data.avatar)
   })
   .catch(err => res.status(500).send(err))
});

router.put("/:id/userAccount", (req, res) => {
  userController
    .updateUserAccount(req.params.id, req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.put("/:id/userInfo", (req, res) => {
  userController
    .updateUserInfo(req.params.id, req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.put("/:id/avatar", upload.single("image"), (req, res) => {
  userController
    .updateAvatar(req.params.id, req.file)
    .then(id => res.send(id))
    .catch(err => res.status(500).send(err));
});

router.delete("/:id", (req, res) => {
  userController
    .deleteUser(req.params.id)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});


module.exports = router;
