module.exports = {
    MONGO_URI: 'mongodb://localhost:27017/newfintech',
    JWT_SECRET: 'your-very-secure-secret',
    PORT: 5000,
    ROLES: [
        'RELATIONSHIPMANAGER', 'ASSOCIATERELATIONSHIPMANAGER', 'COMPLIANCECHECKER',
        'COMPLIANCEMAKER', 'OPERATIONSMAKER', 'OPERATIONSCHECKER', 'ADMIN', 'SUPERADMIN', 'CLIENTS',
        
    ],
    ID_LENGTH: 8,  // Length of the random string
    ID_PREFIX: 'USR',  // Prefix for the unique ID
};
