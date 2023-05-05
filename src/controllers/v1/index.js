const express = require("express");
const router = express.Router();

const carController = require("./car.controller");
router.use("/cars", carController);

module.exports = router;
