const Joi = require('joi').defaults((schema) => schema.options({allowUnknown: true }));

const isResponseValid = (response, filters) => {
        //for each filter, find the question with the corresponding id and verify if the condition is true
        return filters.every((filter) => {
            const question = response?.questions.find((x) => x.id === filter.id);
            if (!question) return false;  //if no question can be found with matching id, we consider this a fail
            switch (filter?.condition) {
                case "equals":
                    if(question?.type === "DatePicker") {
                        return new Date(question?.value).getTime() === new Date(filter?.value).getTime();
                    }
                    return question?.value === filter?.value;
                case "does_not_equal":
                    if(question?.type === "DatePicker") {
                        return new Date(question?.value).getTime() !== new Date(filter?.value).getTime();
                    }
                    return question?.value !== filter.value;
                case "greater_than":
                    if(question.value === null) return false;
                    if(question?.type === "DatePicker") {
                        return new Date(question?.value).getTime() > new Date(filter.value).getTime();
                    } else if (question?.type === "NumberInput") {
                        return question?.value > filter.value;
                    }
                    throw new Error("greater_than condition can only be applied to numbers and dates");
                case "less_than":
                    if(question.value === null) return false;
                    if(question?.type === "DatePicker") {
                        return new Date(question?.value).getTime() < new Date(filter.value).getTime();
                    } else if (question?.type === "NumberInput") {
                        return question?.value < filter.value;
                    }
                    throw new Error("less_than condition can only be applied to numbers and dates");
                default:
                    return false;
            }
      });
}

const applyAdditionalFilters = (data, filters, apiQueryParams) => {
    const fData = data.responses.filter((response) => isResponseValid(response, filters));
    let filteredResponse = { responses: [] };
    if (fData && fData.length > 0) {
        const offset = (apiQueryParams && 'offset' in apiQueryParams) ? apiQueryParams.offset : 0;
        const limit = (apiQueryParams &&'limit' in apiQueryParams) ? apiQueryParams.limit : 150;
        filteredResponse.responses = fData.slice(offset, offset + limit);
        filteredResponse.totalResponses = fData.length;
        filteredResponse.pageCount = Math.ceil(fData.length / limit);       
    }
    return filteredResponse;
}

module.exports = { applyAdditionalFilters }