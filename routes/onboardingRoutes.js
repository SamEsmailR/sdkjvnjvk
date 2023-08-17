const express = require('express');
const router = express.Router();
const roleCheck = require('../middleware/roleCheck');
const OnboardingSteps = require('../models/OnboardingSteps');
const ClientDetails = require('../models/ClientDetails');
const onboardingQuestions = require('../onboarding-questions');
const riskProfileQuestions = require('../risk-profile-questions');

async function verifyCurrentStep(clientId, expectedStep) {
    const stepRecord = await OnboardingSteps.findOne({ clientId });
    return stepRecord && stepRecord.stepName === expectedStep;
}

router.get('/basic-details/questions', roleCheck(['RM', 'ARM']), (req, res) => {
    res.json(onboardingQuestions);
});

router.post('/basic-details', roleCheck(['RM', 'ARM']), async (req, res) => {
    try {
        const { clientId, details } = req.body;

        if (!clientId || !details) {
            return res.status(400).send('Client ID and details are required.');
        }

        if (!await verifyCurrentStep(clientId, 'Basic Details')) {
            return res.status(400).send('This step is not yet accessible.');
        }

        const clientDetail = await ClientDetails.findOne({ clientId });
        if(clientDetail) {
            clientDetail.basicDetails = details;
            await clientDetail.save();
        } else {
            await ClientDetails.create({ clientId, basicDetails: details });
        }
        
        await OnboardingSteps.findOneAndUpdate({ clientId }, { stepName: 'Basic Details Filled' });
        
        res.status(200).send('Basic details updated successfully.');
    } catch (error) {
        console.error('Error updating basic details:', error.message);
        res.status(500).send('Server error.');
    }
});

router.get('/risk-profile/questions', roleCheck(['RM', 'ARM', 'CLIENT']), (req, res) => {
    res.json(riskProfileQuestions);
});

router.post('/risk-profile', roleCheck(['RM', 'ARM', 'CLIENT']), async (req, res) => {
    try {
        const { clientId, riskDetails } = req.body;

        if (!clientId || !riskDetails) {
            return res.status(400).send('Client ID and risk details are required.');
        }

        if (!await verifyCurrentStep(clientId, 'Risk Profile')) {
            return res.status(400).send('This step is not yet accessible.');
        }

        const clientDetail = await ClientDetails.findOne({ clientId });
        clientDetail.riskProfileDetails = riskDetails;
        await clientDetail.save();

        await OnboardingSteps.findOneAndUpdate({ clientId }, { stepName: 'Risk Profile Completed' });

        res.status(200).send('Risk profile details updated successfully.');
    } catch (error) {
        console.error('Error updating risk profile:', error.message);
        res.status(500).send('Server error.');
    }
});

router.post('/compscheck-approval', roleCheck(['COMPCHECK']), async (req, res) => {
    try {
        const { clientId, isApproved } = req.body;

        if (!clientId) {
            return res.status(400).send('Client ID is required.');
        }

        if (!await verifyCurrentStep(clientId, 'Compliance Approval')) {
            return res.status(400).send('This step is not yet accessible.');
        }

        const clientDetail = await ClientDetails.findOne({ clientId });
        clientDetail.compsCheckApproved = isApproved;
        await clientDetail.save();

        if (isApproved) {
            await OnboardingSteps.findOneAndUpdate({ clientId }, { stepName: 'Compliance Approved' });
            res.status(200).send('Compliance approved successfully.');
        } else {
            await OnboardingSteps.findOneAndUpdate({ clientId }, { stepName: 'Compliance Rejected' });
            res.status(200).send('Compliance rejected.');
        }
    } catch (error) {
        console.error('Error in compliance approval:', error.message);
        res.status(500).send('Server error.');
    }
});

router.post('/management-approval', roleCheck(['ADMIN']), async (req, res) => {
    try {
        const { clientId, isApproved } = req.body;

        if (!clientId) {
            return res.status(400).send('Client ID is required.');
        }

        if (!await verifyCurrentStep(clientId, 'Management Approval')) {
            return res.status(400).send('This step is not yet accessible.');
        }

        const clientDetail = await ClientDetails.findOne({ clientId });
        clientDetail.managementApproved = isApproved;
        await clientDetail.save();

        if (isApproved) {
            await OnboardingSteps.findOneAndUpdate({ clientId }, { stepName: 'Management Approved' });
            res.status(200).send('Management approved successfully.');
        } else {
            await OnboardingSteps.findOneAndUpdate({ clientId }, { stepName: 'Management Rejected' });
            res.status(200).send('Management rejected.');
        }
    } catch (error) {
        console.error('Error in management approval:', error.message);
        res.status(500).send('Server error.');
    }
});

router.post('/client-activation', roleCheck(['ADMIN']), async (req, res) => {
    try {
        const { clientId, isActive } = req.body;

        if (!clientId) {
            return res.status(400).send('Client ID is required.');
        }

        if (!await verifyCurrentStep(clientId, 'Client Activation')) {
            return res.status(400).send('This step is not yet accessible.');
        }

        const clientDetail = await ClientDetails.findOne({ clientId });
        clientDetail.clientActivated = isActive;
        await clientDetail.save();

        if (isActive) {
            await OnboardingSteps.findOneAndUpdate({ clientId }, { stepName: 'Client Activated' });
            res.status(200).send('Client activated successfully.');
        } else {
            await OnboardingSteps.findOneAndUpdate({ clientId }, { stepName: 'Client Deactivated' });
            res.status(200).send('Client deactivated.');
        }
    } catch (error) {
        console.error('Error in client activation:', error.message);
        res.status(500).send('Server error.');
    }
});


module.exports = router;
