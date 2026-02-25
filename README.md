# Simple Helpdesk Support Ticket Management System
Pre-Interview Assignment

## Key Features

* **Create:**
    * สร้าง Ticket ใหม่พร้อมระบบบันทึกเวลาสร้าง (Timestamp)
    * ระบบติดตามเวลาที่มีการอัปเดตล่าสุด (Latest Update Timestamp)
* **Read:**
    * เรียกดูรายการ Ticket ทั้งหมด
    * **Sorting:** จัดเรียงตามสถานะ หรือ ตามเวลาที่อัปเดตล่าสุด
    * **Filtering:** คัดกรองรายการ Ticket ตามสถานะ (Status)
* **Update:**
    * แก้ไขข้อมูลเนื้อหาของ Ticket และเปลี่ยนสถานะ (Status Management)
* **Compliance:**
    * **No-Deletion Policy:** ออกแบบระบบให้ไม่มีการลบข้อมูล เพื่อใช้ในการตรวจสอบย้อนหลัง 

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS, Axios |
| **Backend** | Node.js |
| **Database** | PostgreSQL |
| **Container** | Docker, Docker Compose |
---

---

## Installation & Setup

เพื่อให้ระบบรันได้อย่างแม่นยำและลดปัญหาเรื่อง Environment แนะนำให้รันผ่าน **Docker** ตามขั้นตอนดังนี้:

### 1. Prerequisites
* ติดตั้ง [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* ติดตั้ง [Git](https://git-scm.com/)

### 2. Getting Started
```bash
# 1. Clone the repository
git clone [https://github.com/ChanathinartR/Helpdesk-Support-System.git](https://github.com/ChanathinartR/Helpdesk-Support-System.git)
cd Helpdesk-Support-System

# 2. Start the system (Build and Run Containers)
docker-compose up --build -d

# 3. Initialize Database Schema (สร้างตารางข้อมูล)
docker exec -it helpdesksupport-db-1 psql -U postgres -d helpdesk_db -f /docker-entrypoint-initdb.d/init.sql
```
### 3.Accessing the Application
เมื่อระบบรันเสร็จสิ้น คุณสามารถเข้าถึงส่วนต่างๆ ได้ดังนี้:
* Frontend (App): http://localhost:5173
* Backend (API): http://localhost:5000

### 4.Testing
**Backend**
```bash
cd backend
npm install
npm test
```
**Frontend**
```bash
cd frontend
npm install
npm test
```
