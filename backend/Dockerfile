# ใช้ Node.js version 18 หรือตามที่คุณใช้งาน
FROM node:18-alpine

# กำหนดโฟลเดอร์ทำงานใน container
WORKDIR /app

# ก๊อปปี้ package.json เพื่อติดตั้ง dependencies ก่อน
COPY package*.json ./
RUN npm install

# ก๊อปปี้โค้ดทั้งหมด
COPY . .

# กำหนด Port ให้ตรงกับที่ backend คุณรัน (เช่น 5000)
EXPOSE 5000

# คำสั่งรัน
CMD ["npm", "start"]