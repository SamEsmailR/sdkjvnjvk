const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { checkRole } = require('./middleware/ensureRole');
const { MONGO_URI, JWT_SECRET, PORT, ROLES } = require('./config');
const { logActivity } = require('./activityLogger');
const User = require('./models/user');
const Token = require('./models/tokenModel');
const Tenant = require('./models/tenantModel');
const { generateUniqueId } = require('./utils/utils')
const { generateTenantId } = require('./utils/utils');


const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.path}`);
    console.log('Request Body:', req.body);
    next();
});

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

app.post('/api/user/register', async (req, res) => {
    const { email, password, role,tenant } = req.body;

    if (!email || !password || !role || !tenant) {
        console.error("Error: Fields are missing");
        return res.status(400).send("All fields are mandatory");
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            console.error("Error: User already exists");
            logActivity(email, 'USER_REGISTER_FAILED', 'User with given email already exists.');
            return res.status(400).send('User already exists');
        }
 // Look up the tenant by its name
 const tenantDoc = await Tenant.findOne({ name: tenant });
 if (!tenantDoc) {
     console.error("Error: Tenant not found");
     logActivity(email, 'USER_REGISTER_FAILED', 'Specified tenant does not exist.');
     return res.status(404).send('Specified tenant does not exist');
 }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            role,
            tenant: tenantDoc.name,
            userId: generateUniqueId()
        });
        await user.save();
        logActivity(user.tenant, 'USER_REGISTERED', `User registered with ID ${user.tenant} under tenant ${tenant}.`);

        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Server error:', error.message);
        logActivity(User.userId, 'SERVER_ERROR', `Error registering user: ${error.message}`);
        res.status(500).send('Server error');
    }
});

app.post('/api/tenant/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const tenant = await Tenant.findOne({ email });
        if (!tenant) {
            console.error('Error: Invalid login credentials');
            return res.status(400).send('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(password, tenant.password);
        if (!validPassword) {
            console.error('Error: Invalid login credentials');
            return res.status(400).send('Invalid email or password');
        }

        // Generate a JWT that includes the tenant's ID
        const token = jwt.sign({ tenantId: tenant._id }, JWT_SECRET, { expiresIn: '1h' });
        console.log("Tenant logged in successfully");
        res.status(200).send({ token });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).send('Server error');
    }
});



app.post('/api/tenant/register', async (req, res) => {
    const { email, password, tenantName } = req.body;

    if (!email || !password || !tenantName) {
        console.error("Error: Fields are missing");
        return res.status(400).send("All fields are mandatory");
    }

    try {
        let tenant = await Tenant.findOne({ email });
        if (tenant) {
            console.error("Error: Tenant already exists");
            logActivity(email, 'TENANT_REGISTER_FAILED', 'Tenant with given email already exists.');
            return res.status(400).send('Tenant already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const tenantId = generateTenantId(tenantName);


        tenant = new Tenant({
            name: tenantName,
            email,
            password: hashedPassword,
            tenantId

        });
        await tenant.save();
        logActivity(tenant.name, 'TENANT_REGISTERED', `Tenant registered with ID ${tenant._id}.`);
        res.status(201).send({ message: 'Tenant registered successfully' });
    } catch (error) {
        console.error('Server error:', error.message);
        logActivity('SYSTEM', 'SERVER_ERROR', `Error registering tenant: ${error.message}`);
        res.status(500).send('Server error');
    }
});

app.post('/api/tenant/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const tenant = await Tenant.findOne({ email });
        if (!tenant) {
            console.error('Error: Invalid login credentials');
            return res.status(400).send('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(password, tenant.password);
        if (!validPassword) {
            console.error('Error: Invalid login credentials');
            return res.status(400).send('Invalid email or password');
        }

        const token = jwt.sign({ tenantId: tenant._id }, JWT_SECRET, { expiresIn: '1h' });
        logActivity(tenant._id, 'TENANT_LOGGED_IN', `Tenant with ID ${tenant._id} logged in.`);
        res.status(200).send({ token });
    } catch (error) {
        console.error('Server error:', error.message);
        logActivity('SYSTEM', 'SERVER_ERROR', `Error during tenant login: ${error.message}`);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
