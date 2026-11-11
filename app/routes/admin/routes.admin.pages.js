const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/admin/login', (req, res) => {
    console.log('login do adm');

    res.sendFile(path.join('../../../views/admin/index.html'));
});

module.exports = router;