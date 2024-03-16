const { applyAdditionalFilters } = require('../utilities/filterHelper');
const filloutMockData = require('../mocks/filloutAPIResponse.json');
const filterGetJohnny = require('../mocks/filterGetJohnny.json');
const returnJohnny = require('../mocks/returnJohnny.json');
const filterByDate = require('../mocks/filterByDate.json');
const returnByDate = require('../mocks/returnByDate.json');
const filterByEmployees = require('../mocks/filterByEmployees.json');
const returnByEmployees = require('../mocks/returnByEmployees.json');
var isEqual = require('lodash.isequal');

describe("Filter Tests", () => {

    test('applyAdditionalFilters - Return Only Johnny', () => {
       const data = applyAdditionalFilters(filloutMockData, filterGetJohnny);
       const result = isEqual(data, returnJohnny);
       expect(result).toBe(true);
    });

    test('applyAdditionalFilters - Filter By Date > 1/23/24', () => {
        const data = applyAdditionalFilters(filloutMockData, filterByDate);
        const result = isEqual(data, returnByDate);
        expect(result).toBe(true);
     });

     test('applyAdditionalFilters - Filter By Employees < 10', () => {
        const data = applyAdditionalFilters(filloutMockData, filterByEmployees);
        const result = isEqual(data, returnByEmployees);
        expect(result).toBe(true);
     });

    test('applyAdditionalFilters - Should Throw Exception', () => {
        let filters = [ { "id": "bE2Bo4cGUv49cjnqZ4UnkW", "condition": "greater_than", "value": "Johnny", } ];
        expect(() => {
            applyAdditionalFilters(filloutMockData, filters)
        }).toThrow("greater_than condition can only be applied to numbers and dates");

        filters = [ { "id": "bE2Bo4cGUv49cjnqZ4UnkW", "condition": "less_than", "value": "Johnny", } ];
        expect(() => {
            applyAdditionalFilters(filloutMockData, filters)
        }).toThrow("less_than condition can only be applied to numbers and dates");
     });
});