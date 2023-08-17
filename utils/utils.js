const moment = require('moment');
const { ID_LENGTH, ID_PREFIX } = require('../config');

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomString = generateRandomString(ID_LENGTH);
    return `${ID_PREFIX}${timestamp}${randomString}`;
}

function generateTenantId(tenantName) {
    const today = moment().format('DD/MM/YYYY');
    return `${tenantName}_${today}`;
}

module.exports = {
    generateUniqueId,
    generateTenantId
};
