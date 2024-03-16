const express = require("express");
const router = express.Router({mergeParams: true});
const { applyAdditionalFilters } = require('../utilities/filterHelper.js');
const { validateResponseSchema, validateFilterSchema } = require('../utilities/schemaValidation.js')
const axios = require("axios");

router.get('/', async (req, res) => {
    try {
        let response;
        const { filters, ...apiQueryParams } = req.query; 
        
        const url = `https://api.fillout.com/v1/api/forms/${req.params.formId}/submissions`;
        const header = { 'Authorization': `Bearer ${process.env.API_KEY}` };
           
        const filloutAPIResponse = await axios.get(url, { params: apiQueryParams, headers: header });
        validateResponseSchema(filloutAPIResponse.data);

        if(filters && filters !== null && filters !== undefined && filters.length > 0){
            const filterObj = JSON.parse(filters);
            validateFilterSchema(filterObj);
            const filteredResponse = applyAdditionalFilters(filloutAPIResponse.data, filterObj, apiQueryParams);
            response = filteredResponse;
        } 
         else {
            response = filloutAPIResponse;
        } 
        if(!response) res.send('Not found').status(404);
        res.send(response).status(200);
    } catch (err) {
        res.send(err.message).status(err.status);
    }
});

module.exports = router;