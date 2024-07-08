const Log = require('../models/log.model.js');

// Function to log actions
const logAction = async (logData) => {
    const { user, action, element, date } = logData;

    const logEntry = new Log({
        user,
        action,
        element,
        date,
    });

    try {
        await logEntry.save();
        console.log('Log recorded successfully'); // Log success message
    } catch (error) {
        console.error('Error writing log:', error);
    }
};

module.exports = {
    logAction,
};
