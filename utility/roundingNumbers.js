const roundingNumbers = (number, precision) => {
    const multiplier = Math.pow(10, precision)
    const roundedNumber = (Math.round(number * multiplier))/multiplier;
    return roundedNumber;
}


module.exports = roundingNumbers;
