const express = require("express");
const router = express.Router();
const relationshipController = require("./controller");

const authMiddleware = require("../auth/auth");

router.post("/", authMiddleware.authorize, (req, res) => {
  console.log(req.body)
  req.body.userId = req.session.userInfo.id
  relationshipController
    .createRela(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.get("/", authMiddleware.authorize, (req, res) => {
  relationshipController
    .getAllRela()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.get("/:id/getOne", authMiddleware.authorize, (req, res) => {
  relationshipController
    .getOneRela(req.params.id)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.get("/getRelaForUser", authMiddleware.authorize, (req, res) => {
  relationshipController
    .getRelaForUser(req.session.userInfo.id)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.get("/getPostOfRela",authMiddleware.authorize, (req, res) => {
  relationshipController
   .getPostOfRela(req.session.userInfo.id)
   .then(data => res.send(data))
   .catch(err => res.status(500).send(err))
});

router.put("/", authMiddleware.authorize, (req, res) => {
  console.log(req.body)
  req.body.userId = req.session.userInfo.id
  relationshipController
    .updateInRelationship(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.put("/:id/startTime", authMiddleware.authorize, (req, res) => {
  relationshipController
    .updateStartTime(req.params.id, req.body)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

router.delete("/:id", authMiddleware.authorize, (req, res) => {
  relationshipController
    .deleteRelationship(req.params.id)
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
