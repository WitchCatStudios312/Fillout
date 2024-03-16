const { validateResponseSchema, validateFilterSchema } = require('../utilities/schemaValidation');

describe("Schema Validation Tests", () => {

    describe("Validate API Response Schema", () => {

        test('validateResponseSchema - Correct Schema Should Pass', () => {
            const data = {
                "responses": [
                    {
                        "questions": [
                            {
                                "id": "4KC356y4M6W8jHPKx9QfEy",
                                "name": "Anything else you'd like to share before your call?",
                                "type": "LongAnswer",
                                "value": "I'm excited for it!"
                            },
                        ]
                    }
                ],
                "totalResponses": 1,
                "pageCount": 1
            };
            expect(validateResponseSchema(data)).toBe(true);
        });

        test('validateResponseSchema - Missing Required Properties Should Fail', () => {
            const expected1 = { message: "\"responses\" is required. \"totalResponses\" is required. \"pageCount\" is required" };
            expect(() => {
                validateResponseSchema({})
            }).toThrow(expected1);
            const expected2 = { message: "\"responses[0].questions\" is required" };
            expect(() => {
                validateResponseSchema({responses: [{}], totalResponses: 0, pageCount: 0})
            }).toThrow(expected2);
            const expected3 = { message: "\"responses[0].questions[0].id\" is required. \"responses[0].questions[0].type\" is required. \"responses[0].questions[0].name\" is required. \"responses[0].questions[0].value\" is required" };
            expect(() => {
                validateResponseSchema({responses: [{questions: [{}]}], totalResponses: 0, pageCount: 0})
            }).toThrow(expected3);
        });

        test('validateResponseSchema - Incorrect Types Should Fail', () => {
            const data = {
                "responses": [
                    {
                        "questions": [
                            {
                                "id": 2,
                                "name": 2,
                                "type": 2,
                                "value": Date.now
                            },
                        ]
                    }
                ],
                "totalResponses": "",
                "pageCount": ""
            };
            const expected1 = { message: "\"responses[0].questions[0].id\" must be a string. \"responses[0].questions[0].type\" must be a string. \"responses[0].questions[0].name\" must be a string. \"responses[0].questions[0].value\" does not match any of the allowed types. \"totalResponses\" must be a number. \"pageCount\" must be a number" };
            expect(() => {
                validateResponseSchema(data)
            }).toThrow(expected1);
        });
    });

    describe("Validate Filter Schema", () => {

        test('validateFilterSchema - Correct Schema Should Pass', () => {
            const filters = [
                { "id": "bE2Bo4cGUv49cjnqZ4UnkW", "condition": "equals", "value": "Johnny", },
                { "id": "8", "condition": "greater_than", "value": "2024-01-23T05:01:47.691Z" }
            ];
            expect(validateFilterSchema(filters)).toBe(true);
        });

        test('validateFilterSchema - Missing Required Properties Should Fail', () => {
            const expected1 = { message: "\"[0].id\" is required. \"[0].condition\" is required. \"[0].value\" is required" };
            expect(() => {
                validateFilterSchema([{}])
            }).toThrow(expected1);
        });

        test('validateFilterSchema - Incorrect Types Should Fail', () => {
            const filters = [ { "id": 2, "condition": 2, "value": Date.now, }, ];
            const expected1 = { message: "\"[0].id\" must be a string. \"[0].condition\" must be one of [equals, does_not_equal, greater_than, less_than]. \"[0].condition\" must be a string. \"[0].value\" does not match any of the allowed types" };
            expect(() => {
                validateFilterSchema(filters)
            }).toThrow(expected1);
        });

        test('validateFilterSchema - Invalid Condition Should Fail', () => {
            const filters = [ { "id": "1", "condition": "same", "value": "Hi!", }, ];
            const expected = { message: "\"[0].condition\" must be one of [equals, does_not_equal, greater_than, less_than]" };
            expect(() => {
                validateFilterSchema(filters)
            }).toThrow(expected);
        });
    });
   
});