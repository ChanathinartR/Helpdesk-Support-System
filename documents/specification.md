# Technical Specification: Helpdesk Support Ticket Management System

## 1. Introduction
ระบบจัดการตั๋วความช่วยเหลือ (Support Ticket) ที่ออกแบบมาเพื่อเปลี่ยนกระบวนการแจ้งซ่อมหรือขอความช่วยเหลือให้เป็นระบบ โดยเน้นความโปร่งใสของสถานะงาน และรักษาประวัติข้อมูลเพื่อใช้ในการตรวจสอบ (Audit)

## 2. Stakeholders & Roles
ระบบถูกออกแบบมาเพื่อรองรับผู้ใช้งาน 3 กลุ่มหลัก ดังนี้:

1. **Requester (ผู้แจ้งเรื่อง):** - **หน้าที่:** สร้างตั๋วปัญหา และติดตามความคืบหน้าของตนเอง
   - **สิทธิ์:** สร้างตั๋วได้ (Create), ดูรายการตั๋วของตัวเองได้ (Read only specific), **ไม่สามารถลบหรือแก้ไขสถานะเองได้**
2. **Support Agent (เจ้าหน้าที่):** - **หน้าที่:** จัดการและแก้ไขปัญหาตามที่ได้รับแจ้ง
   - **สิทธิ์:** ดูตั๋วทั้งหมดในระบบ, กรองและเรียงลำดับข้อมูล, **อัปเดตข้อมูลและเปลี่ยนสถานะตั๋ว**, ไม่สามารถลบตั๋วได้
3. **Administrator (ผู้ดูแลระบบ):** - **หน้าที่:** ตรวจสอบภาพรวมของระบบ
   - **สิทธิ์:** เข้าถึงข้อมูลทุกส่วนในระบบ

## 3. Functional Specification
### 3.1 Ticket Management
- **Creation:** ผู้แจ้งเรื่องกรอกข้อมูลหัวข้อ (Title), รายละเอียด (Description) และข้อมูลติดต่อ (Contact Info)
- **Status Workflow:** ตั๋วมี 4 สถานะ: `pending` (เริ่มต้น) -> `accepted` -> `resolved` หรือ `rejected`
- **No-Deletion Policy:** ทุกบทบาทไม่สามารถลบตั๋วออกจากระบบได้

### 3.2 View & Filter Management
- **Sorting:** สามารถเรียงลำดับตั๋วตาม:
    - สถานะ (Status)
    - เวลาที่มีการอัปเดตล่าสุด (Latest Update) - *Default*
- **Filtering:** สามารถกรองตั๋วตามสถานะ (เช่น ดูเฉพาะตั๋วที่กำลังดำเนินการอยู่)

## 4. Technical Specification
### 4.1 Technology Stack
- **Frontend:** React.js + Tailwind CSS (สำหรับการออกแบบ Responsive UI)
- **Backend:** Node.js
- **Database:** PostgreSQL (สำหรับเก็บข้อมูลที่มีความสัมพันธ์และรองรับการขยายตัว)
- **Containerization:** Docker & Docker Compose (แยก Service: App, API, DB)

### 4.2 Layered Architecture
การออกแบบโค้ดแบ่งออกเป็น 3 เลเยอร์ชัดเจน:
- **Presentation Layer:** React Components และ API Controllers
- **Application Layer:** Business Logic เช่น กฎการเปลี่ยนสถานะ และการจัดการเวลา `updated_at`
- **Persistence Layer:** Data Access Object (DAO) หรือ Repository ที่เชื่อมต่อกับ PostgreSQL

## 5. Data Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID| รหัสประจำตั๋ว |
| `title` | String (255) | หัวข้อปัญหา |
| `description` | Text | รายละเอียดปัญหา |
| `contact_info` | String (255) | ข้อมูลติดต่อกลับ |
| `status` | Enum | `pending`, `accepted`, `resolved`, `rejected` |
| `created_at` | Timestamp | เวลาที่สร้าง |
| `updated_at` | Timestamp | เวลาที่อัปเดตล่าสุด |

## 6. API Endpoints (RESTful)
- `POST /api/tickets`: สร้างตั๋วใหม่ (สถานะเริ่มต้นเป็น pending)
- `GET /api/tickets`: ดึงรายการตั๋ว (รองรับ query params: `status`, `sort`, `order`)
- `PUT /api/tickets/:id`: อัปเดตข้อมูลหรือเปลี่ยนสถานะตั๋ว (เฉพาะเจ้าหน้าที่)