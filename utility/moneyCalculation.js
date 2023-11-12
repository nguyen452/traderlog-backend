// function to convert to dollars to cents
function convertToCents(dollars) {
    const cent = 100 * Number(dollars);
    return Math.round(cent);
};

// function to convert to cents to dollars
function convertToDollars(cents) {
    const dollar = Number(cents) / 100;
    return dollar.toFixed(2);
};



module.exports = { convertToCents, convertToDollars }
