const express = require("express");
const router = express.Router()
const statsControllers = require("../controllers/stats.controller");


router.get("/", statsControllers.getCounts)


module.exports = router