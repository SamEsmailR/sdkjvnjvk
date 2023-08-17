api/tenant/register
{
    "email": "tenant@example.com",
    "password": "tenantpass",
    "tenantName": "Example Tenant"
}


api/tenant/login
{
    "email": "tenant@example.com",
    "password": "tenantpass"
}




let me specify some naming first i will be addressing RRELATIONSHIPMANAGER as RM COMPLIANCEMAKER as compsmaker COMPLIANCECHECKER as compscheck OPERATIONSMAKER as opsmaker OPERATIONSCHECKER as opscheck ASSOCIATERELATIONSHIPMANAGER as ARM, ADMIN as admin and clients as clients
now the process of onboarding client can only be started by RM or ARM.
Onboarding will be a 7 step process carried out by various roles for the client, also make a functionality so that as the steps are updating for a client' account we keep track of every step create a seperate table called onboarding steps and keep the track of every step with highly detailed schema and information
step 1 basic details
this step will require some basic questions which i need to be highly configurable so keep them in a seperate file named onboarding-questions.js and then use them
when RM or ARM have filled the basic details the clients'account will move to step 2 which is risk profiling, this can either be filled by RM or CLIENT himself.
this risk profile step will also have different set of questions so maintain a different config file for this named risk-profile-question.js 
when this questionare is filled the clients account will move to step 3 compliance approval step where compscheck role will approve the details this only needs to be a approval stage so we can maintain a flag saying is compscheckApproved = true or false if rejected and keep track of it
when the compscheck approves this account it will move to step 4 management approval this will also only require approval or rejection and will only be done by admin role so a flag would do.
after that client will move to step 5 activation required which will be done by admin role and only require a flag . please note that not only these steps will be described in a table called onboarding steps they will also be used to keep track of the clients account meaning on which step the account currents is.
 
the steps are 
Basic Details
Risk Profile
Compliance approval
Management approval
Client activation

also make and move steps like this Basic Details > Basic Details Filled (when basic details step is completed) Risk Profile > Risk Profile Completed (when risk profile step is completed) and so on 
and lets make other files and not increase the size of server.js





this will allow to fill the question in which way i mean can you give an example of the request



give me the full code for routes/onboardingRoutes.js and no errors and no leaving the code like //rest of the code or anything like that cover all the cases that i have described you 