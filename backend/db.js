const { Pool } = require('pg');

const pool = new Pool({
  user: 'myuser',          // ต้องเป็น myuser ไม่ใช่ postgres
  host: 'localhost',       // รัน Backend ข้างนอก Docker ใช้ localhost
  database: 'helpdesk_db', // ชื่อ DB ที่สร้างใน Docker
  password: 'mypassword',  // รหัสผ่านในไฟล์ docker-compose
  port: 5432,
});

// ลองเพิ่มโค้ดเช็คการเชื่อมต่อตรงนี้
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to Database!');
});
module.exports = pool;