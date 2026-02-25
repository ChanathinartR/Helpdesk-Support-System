#  Technical Specification: Helpdesk Support Ticket Management System

## 1. Executive Summary
ระบบจัดการตั๋วความช่วยเหลือ (Support Ticket Management System) พัฒนาขึ้นเพื่อเพิ่มประสิทธิภาพในการติดตามงาน (Traceability) และสร้างความโปร่งใสในกระบวนการทำงาน โดยยึดหลักการ **No-Deletion Policy** เพื่อรักษาประวัติข้อมูลทั้งหมดสำหรับการตรวจสอบ (Audit Trail) และการวิเคราะห์ข้อมูลในเชิงสถิติ

---

## 2. Stakeholders & Role-Based Access Control (RBAC)
ระบบใช้การควบคุมการเข้าถึงตามบทบาท (Role) เพื่อความปลอดภัยและความถูกต้องของข้อมูล:

| Role | Responsibilities | Permissions |
| :--- | :--- | :--- |
| **Requester** | ผู้แจ้งเรื่อง | สร้างตั๋ว (Create), ติดตามสถานะของตนเองหรือดูข้อมูลตั๋ว (Read-only) |
| **Staff** | เจ้าหน้าที่เทคนิค | ดูตั๋วทั้งหมดในระบบ, อัปเดตสถานะงาน (Workflow management) |
| **Administrator** | ผู้ดูแลระบบ | ตรวจสอบภาพรวม, แก้ไขข้อมูลทุกส่วน (ยกเว้นการลบข้อมูล) |

> **Security Policy:** ระบบถูกจำกัดไม่ให้ใช้คำสั่ง `DELETE` ในทุกระดับ
---

## 3. Functional Specification
### 3.1 Ticket Management
* **Creation:** ผู้แจ้งเรื่องกรอกข้อมูล หัวข้อ (Title), รายละเอียด (Description) และข้อมูลติดต่อ (Contact Info)
* **Status Workflow:** ตั๋วมีสถานะที่กำหนดไว้ชัดเจนเพื่อควบคุมวงจรชีวิตของงาน:
    * `pending` (เริ่มต้น) → `accepted` (รับเรื่อง) → `resolved` (แก้ไขแล้ว) หรือ `rejected` (ปฏิเสธ)
* **No-Deletion Policy:** จะไม่มีฟังก์ชันการลบข้อมูลถาวรออกจากฐานข้อมูลในทุกส่วนของแอปพลิเคชัน

### 3.2 View & Filter Management
* **Dynamic Sorting:** รองรับการเรียงลำดับตั๋วตามสถานะ หรือเวลาที่มีการอัปเดตล่าสุด (Latest Update) เป็นค่าเริ่มต้น
* **Advanced Filtering:** สามารถกรองรายการตั๋วตามสถานะ เพื่อช่วยให้เจ้าหน้าที่จัดการงานได้อย่างเป็นระบบ

---

## 4. Technical Architecture
การออกแบบระบบเน้นความทันสมัยและการแยกส่วนการทำงาน (Separation of Concerns)

### 4.1 Technology Stack
* **Frontend:** React.js (Vite) + Tailwind CSS + Vitest (Unit Testing)
* **Backend:** Node.js (Express) + Jest/Supertest (API Testing)
* **Database:** PostgreSQL (Relational Database)
* **Containerization:** Docker & Docker Compose (Environment Isolation)

### 4.2 Layered Architecture
โครงสร้างระบบแบ่งออกเป็น 3 เลเยอร์ชัดเจน:
1.  **Presentation Layer:**
    * **Frontend:** React Components จัดการ UI ตามบทบาทผู้ใช้
    * **Backend:** API Controllers จัดการ HTTP Requests/Responses และ JSON Data
2.  **Application Layer:**
    * **Business Logic:** ควบคุมกฎเกณฑ์การเปลี่ยนสถานะและการจัดการเวลา `updated_at` อัตโนมัติ
    * **State Management:** ใช้ React Context ในการบริหารจัดการข้อมูลแบบ Global State
3.  **Persistence Layer:**
    * เชื่อมต่อและสื่อสารกับ PostgreSQL ผ่านระบบ Query ที่ปลอดภัยและรองรับ UUID

---

## 5. Data Schema Definition

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | รหัสประจำตั๋ว (Unique Identifier) |
| `title` | VARCHAR(255) | NOT NULL | หัวข้อปัญหา |
| `description` | TEXT | NOT NULL | รายละเอียดปัญหา |
| `contact_info` | VARCHAR(255) | NOT NULL | ข้อมูลติดต่อกลับของผู้แจ้ง |
| `status` | ENUM | DEFAULT 'pending' | สถานะปัจจุบันของตั๋ว |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | เวลาที่สร้างตั๋วครั้งแรก |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | เวลาที่มีการแก้ไขล่าสุด |

---

## 6. API Endpoints (RESTful)

| Method | Endpoint | Description | Expected Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/tickets` | สร้างตั๋วใหม่ | `{ title, description, contact_info }` |
| `GET` | `/api/tickets` | ดึงรายการตั๋วทั้งหมด | N/A |
| `PUT` | `/api/tickets/:id` | อัปเดตข้อมูลหรือเปลี่ยนสถานะ | `{ status, description, ... }` |

---
