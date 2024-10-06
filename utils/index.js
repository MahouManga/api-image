module.exports = {
    ...require('./fileUtils'),
    logger: require('./logger'),
    AppError: require('./errors'),
    possibleExtensions: require('./constants').possibleExtensions,
};