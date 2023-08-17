const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true
    },
    RMId: {
        type: String,
        required: true
    },
    ARMId: {
        type: String
    },

    // Basic Details
    basicDetails: {
        name: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date
        },
        address: {
            type: String
        },
        contactNumber: {
            type: String
        },
        email: {
            type: String
        },
        filled: {
            type: Boolean,
            default: false
        }
    },

    // Risk Profile
    riskProfileData: {
        questions: {
            type: mongoose.Schema.Types.Mixed
        },
        filled: {
            type: Boolean,
            default: false
        }
    },

    // Compliance Approval
    complianceApproval: {
        approvedBy: {
            type: String
        },
        compsCheckApproved: {
            type: Boolean,
            default: false
        },
        comments: {
            type: String
        }
    },

    // Management Approval
    managementApproval: {
        approvedBy: {
            type: String
        },
        managementApproved: {
            type: Boolean,
            default: false
        },
        comments: {
            type: String
        }
    },

    // Client Activation
    clientActivation: {
        activatedBy: {
            type: String
        },
        clientActivated: {
            type: Boolean,
            default: false
        }
    },

    currentStep: {
        type: String,
        default: 'Basic Details'
    }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
