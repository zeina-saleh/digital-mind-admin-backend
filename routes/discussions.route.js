const express = require("express");
const router = express.Router()
const discussionsController = require("../controllers/discussions.controller");


router.get("/", discussionsController.getAllDiscussions)
router.delete("/:id", discussionsController.deleteDiscussion)

module.exports = router