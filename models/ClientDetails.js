const mongoose = require('mongoose');

const clientDetailsSchema = new mongoose.Schema({
    clientId: { type: String, required: true },
    basicDetails: { type: Object, default: {} },
    riskProfileDetails: { type: Object, default: {} },
    compsCheckApproved: { type: Boolean, default: false },
    managementApproved: { type: Boolean, default: false },
    clientActivated: { type: Boolean, default: false }
});

module.exports = mongoose.model('ClientDetails', clientDetailsSchema);
