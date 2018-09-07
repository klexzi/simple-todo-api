const express = require("express");
const router = express.Router();

/*
* Logout is best implemented by deleting the token from the client cookie or client localstorage
*/
router.get("/", (req, res) => {
  res.status(200).json({ token: null });
});

module.exports = router;
