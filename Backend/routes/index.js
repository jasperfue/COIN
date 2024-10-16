var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

// router.post('/sensor-data/:user',(req, res) => {
//   const user = req.params.user;
//
// })
module.exports = router;
