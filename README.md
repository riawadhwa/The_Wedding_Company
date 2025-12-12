# The Wedding Company

# Backend Intern Assignment - Organization Management Service

This project implements a multi-tenant organization management backend using **Node.js**, **Express**, and **MongoDB**.

---

## 🛠 Technologies Used

**Node.js**

**Express.js**

**MongoDB**

**Mongoose**

**JWT Authentication**

**bcryptjs**

**Modular utilities system**

## 🚀 Features

### Organization Management

- Create organization (dynamic collection creation)
- Fetch organization data by name
- Update organization details (including renaming → new collection creation)
- Delete organization (with auth)

### Authentication

- Admin login with JWT
- Passwords securely hashed (bcrypt)
- Protected organization delete API

### Centralized Utility System

- Error codes stored in `/utils/errors.js`
- Input validators stored in `/utils/validators.js`
- Organization name cleaner in `/utils/clean.js`

---

## 📁 Project Structure

```
org-management/
├── app.js
├── controllers/
│ └── orgController.js
├── middleware/
│ ├── auth.js
│ └── errorHandler.js
├── models/
│ └── MasterOrg.js
├── utils/
│ ├── sanitize.js
│ ├── errors.js
│ └── validators.js
├── package.json
└── README.md

```

---

## 📦 Installation & Running the Application

### **1. Clone the repository**

```sh
git clone <https://github.com/riawadhwa/The_Wedding_Company.git>
```

### **2. Install dependencies**

npm install

### **3. Create a .env file**

PORT=your_port
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=your_jet_expires_in

### **4. Start the server**

- Development mode:
  npm run dev
- Production mode:
  npm start

# ✅ **High-Level Project Diagram**

<img width="4045" height="3642" alt="image" src="https://github.com/user-attachments/assets/fe5d8f07-5f77-4a5d-82fa-6d78ead5e7bc" />

## 📌 API Endpoints

### **1. Create Organization**

POST /org/create

<img width="1786" height="918" alt="image" src="https://github.com/user-attachments/assets/bf7b168c-22f4-4426-aeea-7632ac88dc06" />

### **2. Get Organization**

GET /org/get

<img width="1792" height="916" alt="image" src="https://github.com/user-attachments/assets/1654c8af-de44-426b-8135-d078f57e0a9c" />

### **3. Update Organization**

PUT /org/update

<img width="1798" height="917" alt="image" src="https://github.com/user-attachments/assets/a6ada9fd-0e39-4ae4-806f-7fc9ce204386" />

### **4. Admin Login**

POST /admin/login

<img width="1795" height="915" alt="image" src="https://github.com/user-attachments/assets/e596cd65-860a-4027-8ee9-66957df48128" />

### **5. Delete Organization (requires JWT)**

DELETE /org/delete

- Using Auth Bearer Token for Authentication:
  <img width="1795" height="915" alt="image" src="https://github.com/user-attachments/assets/454c3b14-9862-476f-bb16-fcbe240cd032" />

- Input (Body): Organization Name:
  <img width="1793" height="917" alt="image" src="https://github.com/user-attachments/assets/24454ba1-c44b-4860-a123-04038bbc9933" />

## 📌 Database Schema

```
+-----------------------------+
|     master_organizations    |
+-----------------------------+
| _id (ObjectId)              |
| organization_name (String)  |
| org_collection_name (String)|
| connection_details (Object) |
| admin (ObjectId -> admins)  |
| createdAt (Date)            |
+-------------+---------------+
              |
              v
+-----------------------------+
|       master_admins         |
+-----------------------------+
| _id (ObjectId)              |
| email (String)              |
| password (String)       |
+-----------------------------+

Each org → dynamic collection
              |
              v
+------------------------------+
|       org_<org_name>         |
+------------------------------+
|  dynamic fields per org      |
+------------------------------+
```

## Design Choices

### 1. Modular Utility Layer

All reusable logic is isolated under `/utils`:

- **validators.js** → ensures email & password format
- **sanitize.js** → safe collection names
- **errors.js** → centralized error messages

This improves:

- readability
- maintainability
- testability

---

### 2. Centralized Error Codes

Consistent API errors help both backend and frontend teams.  
Error codes follow a structured format:

- `ORG_1xxx` → organization issues
- `AUTH_2xxx` → authentication issues
- `SYS_5xxx` → internal errors

---

### 3. JWT Authentication

Admins authenticate using JWT.  
Every token stores:

- `adminId`
- `orgId`

This ensures every request knows **who** and **which org** is making the call.

---

### ⚖️ Scalability & Trade-offs

### 1. Dynamic Collections Per Organization

Trade-offs:

- If the number of organizations grows large, MongoDB may end up with hundreds or thousands of collections, which increases metadata overhead.

- This approach is scalable for a moderate number of tenants, but not ideal for large-scale SaaS platforms.

### 2. Single Master Database

Trade-offs:

- A single point of failure if not replicated

- Harder to isolate performance issues between organizations

- Scaling horizontally at the database layer becomes more complex

### 🚀 If I were designing for higher scalability

## A. Shared Collections With orgId Partitioning

- Instead of creating one MongoDB collection per organization, store all organizations' data inside a single shared collection, and differentiate their data using an **orgId** field
- MongoDB performance degrades when:
-     There are too many collections
-     Each collection has its own index overhead, Metadata grows excessively

- But with a shared collection, MongoDB handles millions of documents extremely efficiently inside one collection
- When the data grows too large, you can horizontally scale by sharding on orgId

## B. Separate Database Per Organization

- Per-tenant scaling
- Per-tenant backups and recovery

## C. Introducing a Service Layer

- Controllers → Services
- Business logic becomes cleaner
- Easier testing and future maintainability
