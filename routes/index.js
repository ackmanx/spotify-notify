const express = require('express');
const router = express.Router();

// ---------------------------------------------------------------------------------
// Page renders
// ---------------------------------------------------------------------------------
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Spotify Notify' });
});

module.exports = router;
