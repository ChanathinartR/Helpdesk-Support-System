const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        
  host: 'db',              // รัน Backend ข้างใน Docker ใช้ชื่อ service ใน docker-compose
  database: 'helpdesk_db', // ชื่อ DB ที่สร้างใน Docker
  password: 'password123',  // รหัสผ่านในไฟล์ docker-compose
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to Database!');
});
module.exports = pool;
