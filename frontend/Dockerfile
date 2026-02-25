# ใช้ Node.js สำหรับ build
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite มักจะรันที่ port 5173
EXPOSE 5173

# คำสั่งรันสำหรับ development mode
CMD ["npm", "run", "dev", "--", "--host"]