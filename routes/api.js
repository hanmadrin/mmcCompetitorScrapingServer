// routes
const express = require('express');
const router = express.Router();
const csv = require('csvtojson');
const json2csv = require('json2csv').parse;
const { sendMail } = require('../utilities/sendMail');
// fs sync read and write
const fs = require('fs');
const path = require('path');


router.post('/sendMail', async (req, res) => {
    const { data,count } = req.body;
    const usaDate = ()=>{
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}-${day}-${year}`;
    }
    await sendMail({
        fileName: `marketShareData-${usaDate()}.csv`, 
        fileContent:data, 
        text:"A file has been attached to this email. There are "+count+" records in this file.", 
        subject: `Market Share Data of ${usaDate()}`
    });


    res.json({ status: 'success' });
});

// default export
module.exports = router;