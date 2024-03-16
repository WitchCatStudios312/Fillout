const express = require('express');
const cors = require('cors');
require('./loadEnvironment.js');
const filteredResponses = require('./routes/filteredResponses.js');

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.json());

app.use('/:formId/filteredResponses', filteredResponses);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});

