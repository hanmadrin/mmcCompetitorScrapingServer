// routes
const express = require('express');
const router = express.Router();
const csv = require('csvtojson');
const json2csv = require('json2csv').parse;
const { sendMail } = require('../utilities/sendMail');
const axios = require('axios');
// fs sync read and write
const fs = require('fs');
const path = require('path');

// Backend server URL
const BACKEND_SERVER_URL = process.env.BACKEND_SERVER_URL || 'http://18.234.132.69:3000';

router.post('/sendMail', async (req, res) => {
    const { data, count } = req.body;
    const usaDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}-${day}-${year}`;
    };

    try {
        // Step 1: Send data to backend server first
        console.log(`Sending ${count} records to backend server...`);
        
        const backendResponse = await axios.post(
            `${BACKEND_SERVER_URL}/api/inventory`,
            { csvData: data },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                // Increase timeout for large data transfers
                timeout: 300000, // 5 minutes timeout
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            }
        );

        console.log('Backend server response:', backendResponse.data);

        // Step 2: If backend successfully processed the data, send the email
        if (backendResponse.data && backendResponse.data.success) {
            console.log(`Backend imported ${backendResponse.data.recordsImported} records. Sending email...`);
            
            await sendMail({
                fileName: `marketShareData-${usaDate()}.csv`, 
                fileContent: data, 
                text: `A file has been attached to this email. There are ${count} records in this file. Backend server imported ${backendResponse.data.recordsImported} records.`, 
                subject: `Market Share Data of ${usaDate()}`
            });

            console.log('Email sent successfully');
            
            res.json({ 
                status: 'success',
                message: 'Data imported to backend and email sent successfully',
                recordsImported: backendResponse.data.recordsImported,
                emailSent: true
            });
        } else {
            // Backend returned an error or unexpected response
            console.error('Backend server failed to process data:', backendResponse.data);
            
            res.status(500).json({ 
                status: 'error',
                message: 'Backend server failed to process data',
                backendResponse: backendResponse.data
            });
        }

    } catch (error) {
        console.error('Error sending data to backend server:', error.message);
        
        // If there's network error or backend is unavailable, still try to send email
        // but report the error
        try {
            console.log('Attempting to send email despite backend error...');
            await sendMail({
                fileName: `marketShareData-${usaDate()}.csv`, 
                fileContent: data, 
                text: `A file has been attached to this email. There are ${count} records in this file. Note: Backend server was unavailable during import.`, 
                subject: `Market Share Data of ${usaDate()} (Backend Unavailable)`
            });

            res.status(206).json({ 
                status: 'partial_success',
                message: 'Email sent but backend server unavailable',
                error: error.message,
                emailSent: true
            });
        } catch (emailError) {
            console.error('Failed to send email:', emailError.message);
            
            res.status(500).json({ 
                status: 'error',
                message: 'Failed to send data to backend and failed to send email',
                backendError: error.message,
                emailError: emailError.message
            });
        }
    }
});

// default export
module.exports = router;