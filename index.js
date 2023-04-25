require('dotenv').config();

const express = require('express');
const axios = require('axios');


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/tips', async (req, res) => {

    try {
        // TODO: request data via Github api
    } catch (err) {
        console.log(err);
        res.status(500);
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`The Server is running on port ${PORT}`));