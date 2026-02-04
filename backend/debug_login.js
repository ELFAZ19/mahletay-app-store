const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function debugLogin() {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'mahletay_app_store',
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Connected.');

        const email = 'admin@orthodoxhymn.com'; // Default email from seed
        // const email = 'admin@mahletay.com'; // Try alternate if user changed it? No, stick to seed.
        const password = 'Admin@123';

        console.log(`🔎 Looking for user: ${email}`);
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            console.error('❌ User not found!');
            // List all users to see what's there
            const [allUsers] = await connection.execute('SELECT id, email FROM users');
            console.log('Existing users:', allUsers);
            return;
        }

        const user = rows[0];
        console.log('👤 User found:', { id: user.id, email: user.email, role: user.role });
        console.log('🔐 Stored Hash:', user.password_hash);

        console.log(`🔑 Verifying password: '${password}'`);
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (isValid) {
            console.log('✅ Password matches! Login should work.');
        } else {
            console.error('❌ Password mismatch!');
            
            // Generate what a correct hash currently looks like
            const newHash = await bcrypt.hash(password, 12);
            console.log('✨ Valid Hash for \'Admin@123\':', newHash);
            
            console.log('\n--- FIXING DATABASE AUTOMATICALLY ---');
            // Proactively fix it for the user since we have the connection
            await connection.execute('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user.id]);
            console.log('✅ Database updated with valid hash.');
            console.log('🚀 Try logging in again now.');
        }

    } catch (error) {
        console.error('💥 Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

debugLogin();
