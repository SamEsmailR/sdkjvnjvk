// activityLogger.js

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    action: { type: String, required: true },
    token: { type: String, required: true },  // Change this line
    timestamp: { type: Date, default: Date.now }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

const logActivity = async (userId, action, tokenValue) => {
    try {
        const log = new ActivityLog({
            userId,
            action,
            token: tokenValue   // Use tokenValue directly here
        });
        
        await log.save();
        console.log(`Activity logged: ${action}`);
    } catch (error) {
        console.error('Error logging activity:', error.message);
    }
};

module.exports = {
    logActivity
};
