const express = require("express");
const router = express.Router();
const postController = require("./controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const authMiddleware = require('../auth/auth');

router.post("/content", authMiddleware.authorize, (req, res) => {
  req.body.userId = req.session.userInfo.id;
  postController
    .createPostContent(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.post("/image", authMiddleware.authorize, upload.single("image"), (req, res) => {
  req.body.userId = req.session.userInfo.id;
  postController
    .createPostImage(req.file, req.body)
    .then(id => res.send(id))
    .catch(err => res.status(500).send(err));
});

router.get("/", (req, res) => {
  postController
    .getAllPost()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.get("/:id", (req, res) => {
  postController
    .getOnePost(req.params.id)
    .then(data => res.send(data))
    .catch(err => res.send(500).send(err));
});

router.get('/getPost/user', authMiddleware.authorize , (req, res) => {
  postController
   .getPostUser(req.session.userInfo.id)
   .then(data => res.send(data))
   .catch(err => console.log(err))
});

router.get("/:id/image", (req, res) => {
  postController
    .getImageData(req.params.id)
    .then(data => {
      res.contentType(data.contentType);
      res.send(data.image);
    })
    .catch(err => res.status(500).send(err));
});

router.put("/:id/image", authMiddleware.authorize, upload.single("image"), (req, res) => {
  req.body.postId = req.params.id;
  req.body.imageFile = req.file;
  console.log(req.body);
  postController
    .updateImage(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.put("/:id/content", authMiddleware.authorize, (req, res) => {
  console.log(req.body);
  postController
    .updateContent(req.params.id, req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.post("/:id/comment", authMiddleware.authorize, async (req, res) => {
  req.body.postId = req.params.id;
  req.body.userId = req.session.userInfo.id;
  const comment = await postController
   .addComment(req.body)
  // console.log(io)
  
  
  res.send(comment)

});

router.delete("/:id/posts", authMiddleware.authorize, (req, res) => {
  postController
   .deletePost(req.params.id)
   .then(data => res.send(data))
   .catch(err => res.status(500).send(err))
});

router.delete("/:id/comment", authMiddleware.authorize, async (req, res) => {
  req.body.postId = req.params.id;
  try {
    const temp = await postController.deleteComment(req.body)
    res.send(temp)
  } catch (error) {
    return error;
  }
});

module.exports = router;
