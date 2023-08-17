const mongoose = require('mongoose');

const onboardingStepSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Client'
    },
    
    // The step name, e.g., "Basic Details", "Risk Profile", "Compliance Approval", etc.
    step: {
        type: String,
        required: true,
        enum: [
            'Basic Details', 'Basic Details Filled',
            'Risk Profile', 'Risk Profile Completed',
            'Compliance Approval', 'Compliance Approval Completed',
            'Management Approval', 'Management Approval Completed',
            'Client Activation', 'Client Activation Completed'
        ]
    },

    // Detailed description or notes on this step, which might be useful in tracking any issues or specifics.
    details: {
        type: String,
    },

    // The user (by their role) who initiated or approved this step
    actionedBy: {
        type: String,
        required: true
    },

    // The date and time when this step was actioned
    timestamp: {
        type: Date,
        default: Date.now
    },

    // Comments that the person actioning this step might want to leave for clarification or for the record.
    comments: {
        type: String
    },

    // If there's any associated file or document for this step.
    associatedFile: {
        type: String
    },

    // If the step is approved (specifically for steps that require approval)
    isApproved: {
        type: Boolean,
        default: false
    },

    // If the step is rejected (specifically for steps that can be rejected)
    isRejected: {
        type: Boolean,
        default: false
    },

    // Reason for rejection, if any.
    rejectionReason: {
        type: String
    }

});

const OnboardingStep = mongoose.model('OnboardingStep', onboardingStepSchema);

module.exports = OnboardingStep;
