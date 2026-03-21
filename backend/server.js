const path = require('path');
const fs = require('fs');
const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const OTP_EXPIRY_MS = 10 * 60 * 1000;
const OTP_COOLDOWN_MS = 30 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const REGISTRATION_FILE = path.join(__dirname, 'data', 'registrations.json');
const ALLOW_CONSOLE_OTP =
    process.env.ALLOW_CONSOLE_OTP === 'true' ||
    (typeof process.env.ALLOW_CONSOLE_OTP === 'undefined' && process.env.NODE_ENV !== 'production');

const otpStore = new Map();

function ensureRegistrationFile() {
    const directory = path.dirname(REGISTRATION_FILE);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    if (!fs.existsSync(REGISTRATION_FILE)) {
        fs.writeFileSync(REGISTRATION_FILE, JSON.stringify({ users: [] }, null, 2));
    }
}

function readRegisteredUsers() {
    ensureRegistrationFile();
    try {
        const fileContent = fs.readFileSync(REGISTRATION_FILE, 'utf8');
        const parsed = JSON.parse(fileContent || '{}');
        if (!Array.isArray(parsed.users)) {
            return [];
        }
        return parsed.users;
    } catch (error) {
        console.error('Failed to read registrations file:', error);
        return [];
    }
}

function writeRegisteredUsers(users) {
    ensureRegistrationFile();
    fs.writeFileSync(REGISTRATION_FILE, JSON.stringify({ users }, null, 2));
}

function getRegisteredUserByEmail(email) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) {
        return null;
    }
    return readRegisteredUsers().find((user) => user.email === normalizedEmail) || null;
}

function sanitizeRegisteredUser(user) {
    if (!user) {
        return null;
    }
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileType: user.profileType,
        businessName: user.businessName,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt || null,
        loginCount: Number(user.loginCount || 0)
    };
}

function upsertRegisteredUser(payload) {
    const users = readRegisteredUsers();
    const now = new Date().toISOString();
    const index = users.findIndex((user) => user.email === payload.email);

    if (index >= 0) {
        const existing = users[index];
        const updated = {
            ...existing,
            ...payload,
            id: existing.id,
            createdAt: existing.createdAt,
            updatedAt: now,
            lastLoginAt: existing.lastLoginAt || null,
            loginCount: Number(existing.loginCount || 0)
        };
        users[index] = updated;
        writeRegisteredUsers(users);
        return { user: updated, isNew: false };
    }

    const user = {
        id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        ...payload,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null,
        loginCount: 0
    };

    users.push(user);
    writeRegisteredUsers(users);
    return { user, isNew: true };
}

function markUserLoginSuccess(email) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) {
        return null;
    }

    const users = readRegisteredUsers();
    const index = users.findIndex((user) => user.email === normalizedEmail);
    if (index < 0) {
        return null;
    }

    const now = new Date().toISOString();
    users[index] = {
        ...users[index],
        lastLoginAt: now,
        loginCount: Number(users[index].loginCount || 0) + 1,
        updatedAt: now
    };

    writeRegisteredUsers(users);
    return users[index];
}

function normalizeMobile(mobile) {
    return String(mobile || '').replace(/\D/g, '');
}

function isValidMobile(mobile) {
    return /^\d{10}$/.test(normalizeMobile(mobile));
}

function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createAndStoreOtp(email, registeredUser) {
    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    otpStore.set(email, {
        otp,
        expiresAt,
        attempts: 0,
        lastSentAt: Date.now(),
        user: sanitizeRegisteredUser(registeredUser)
    });

    return otp;
}

function createTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass
        }
    });
}

let transporter = createTransporter();
ensureRegistrationFile();

app.use(express.json());
app.use(express.static(FRONTEND_DIR));

app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        smtpConfigured: Boolean(transporter),
        consoleOtpFallback: ALLOW_CONSOLE_OTP,
        registeredUsers: readRegisteredUsers().length
    });
});

app.post('/api/auth/register', (req, res) => {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const mobile = normalizeMobile(req.body?.mobile || '');
    const profileType = String(req.body?.profileType || '').trim().toLowerCase();
    const businessName = String(req.body?.businessName || '').trim();
    const location = String(req.body?.location || '').trim();

    if (!name || !isValidEmail(email) || !isValidMobile(mobile)) {
        return res.status(400).json({
            message: 'Please provide valid name, email and mobile number.'
        });
    }

    if (!['vendor', 'company'].includes(profileType)) {
        return res.status(400).json({
            message: 'Please select Vendor or Company during registration.'
        });
    }

    if (!businessName || !location) {
        return res.status(400).json({
            message: 'Business name and location are required.'
        });
    }

    const { user, isNew } = upsertRegisteredUser({
        name,
        email,
        mobile,
        profileType,
        businessName,
        location
    });

    return res.status(isNew ? 201 : 200).json({
        message: isNew
            ? 'Registration successful. Login with the same email to receive OTP.'
            : 'Email already registered. Your details were updated. Login with the same email to receive OTP.',
        user: sanitizeRegisteredUser(user)
    });
});

app.post('/api/auth/send-otp', async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Valid email address required' });
    }

    const registeredUser = getRegisteredUserByEmail(email);
    if (!registeredUser) {
        return res.status(403).json({
            message: 'Email is not registered. Please create an account first.'
        });
    }

    const existingRecord = otpStore.get(email);
    if (existingRecord && Date.now() - existingRecord.lastSentAt < OTP_COOLDOWN_MS) {
        return res.status(429).json({
            message: 'Please wait 30 seconds before requesting a new OTP.'
        });
    }

    const otp = createAndStoreOtp(email, registeredUser);

    if (!transporter) {
        transporter = createTransporter();
    }

    if (!transporter) {
        if (ALLOW_CONSOLE_OTP) {
            console.log(`[OTP-FALLBACK] ${email}: ${otp}`);
            return res.json({
                message: 'SMTP is not configured. OTP has been generated in server logs for development testing.'
            });
        }
        return res.status(500).json({
            message: 'SMTP configuration is missing. Please set SMTP values in .env and restart the server.'
        });
    }

    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
    const subject = 'Your Bazar Vendor OTP Code';
    const text = `Your OTP is ${otp}. It expires in 10 minutes.`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 12px; color: #111827;">
            <h2 style="margin: 0 0 12px;">Bazar Vendor Login OTP</h2>
            <p style="margin: 0 0 10px;">Use this OTP to log in:</p>
            <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px; margin: 0 0 12px;">${otp}</p>
            <p style="margin: 0; color: #4b5563;">This OTP is valid for 10 minutes.</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject,
            text,
            html
        });

        return res.json({ message: 'OTP was sent to your email address.' });
    } catch (error) {
        console.error('SMTP send error:', error);
        if (ALLOW_CONSOLE_OTP) {
            console.log(`[OTP-FALLBACK] ${email}: ${otp}`);
            return res.json({
                message: 'Email delivery failed. OTP has been generated in server logs for development testing.'
            });
        }
        return res.status(500).json({
            message: 'Email delivery failed. Please verify SMTP credentials and provider settings.'
        });
    }
});

app.post('/api/auth/verify-otp', (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const otp = String(req.body?.otp || '').trim();

    if (!isValidEmail(email) || !/^\d{6}$/.test(otp)) {
        return res.status(400).json({ message: 'Invalid email or OTP format' });
    }

    const record = otpStore.get(email);
    if (!record) {
        return res.status(400).json({ message: 'OTP not found. Please request a new OTP.' });
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }

    record.attempts += 1;
    if (record.attempts > MAX_VERIFY_ATTEMPTS) {
        otpStore.delete(email);
        return res.status(429).json({ message: 'Too many failed attempts. Request OTP again.' });
    }

    if (record.otp !== otp) {
        otpStore.set(email, record);
        return res.status(400).json({ message: 'Incorrect OTP' });
    }

    const verifiedUser = record.user || sanitizeRegisteredUser(getRegisteredUserByEmail(email));
    const loggedInUser = markUserLoginSuccess(email) || verifiedUser;
    otpStore.delete(email);
    return res.json({
        message: 'OTP verified successfully',
        user: sanitizeRegisteredUser(loggedInUser) || { email }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

function startServer(startPort, attempt = 0, maxAttempts = 20) {
    const port = startPort + attempt;
    const server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE' && attempt < maxAttempts) {
            const nextPort = port + 1;
            console.warn(`Port ${port} is busy. Retrying on port ${nextPort}...`);
            startServer(startPort, attempt + 1, maxAttempts);
            return;
        }
        console.error('Server failed to start:', error);
        process.exit(1);
    });
}

startServer(PORT);
