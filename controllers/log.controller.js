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
        console.log('Log recorded successfully'); 
    } catch (error) {
        console.error('Error writing log:', error);
    }
};

// Function to get all logs
const getAllLogs = async (req, res) => {
    try {
        const logs = await Log.find();
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'An error occurred while fetching logs' });
    }
};

module.exports = {
    logAction,
    getAllLogs,
};
