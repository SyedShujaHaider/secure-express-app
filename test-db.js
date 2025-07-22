const pool = require('./core/pool');

async function testConnection() {
    try {
        const result = await pool.query('SELECT 1 + 1 AS solution');
        console.log('✅ DB Connected. Test Result:', result[0].solution);
    } catch (err) {
        console.error('❌ DB Connection failed:', err);
    }
}

testConnection();
