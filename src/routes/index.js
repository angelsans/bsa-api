const express = require("express");
const router = express.Router();

const routerV1 = require("../controllers/v1");

router.use("/api/v1", routerV1);

module.exports = router;
