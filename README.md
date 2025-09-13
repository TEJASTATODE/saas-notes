# 📝 SaaS Notes – Multi-Tenant Notes Application

A full-stack multi-tenant SaaS Notes platform built with React, Node.js, Express, and MongoDB.  
This project enables organizations and users to securely create, manage, and upgrade their notes, with features like **role-based access, note limits, and tenant isolation**.  

🚀 Inspired by Notion/Evernote, designed to practice **SaaS architecture, authentication, and scalable deployments**.

---

## 🌐 Live Demo
🔗 [SaaS Notes App](https://saas-notes-gamma.vercel.app)  
💻 [GitHub Repository](https://github.com/TEJASTATODE/saas-notes)

## 🔹 Features
✅ **User Authentication** – Secure login with JWT + bcrypt  
✅ **Multi-Tenant Support** – Each tenant’s data is isolated  
✅ **Role-based Access** – Admin / User dashboards  
✅ **Notes CRUD** – Create, edit, delete notes  
✅ **Free vs Premium Plans** – Note limits (3 for Free, unlimited for Pro)  
✅ **Upgrade Flow** – Admin can upgrade a tenant’s plan  
✅ **Data Seeding** – Preloaded test users, admins, tenants, and notes  
✅ **Responsive UI** – Built with TailwindCSS for a SaaS-like design  


## 🏗️ Tech Stack

### Frontend
- ⚛️ React + Vite  
- 🎨 TailwindCSS (Responsive SaaS UI)  
- 🌐 Axios for API calls  
- 🔄 React Router for navigation  

### Backend
- 🚀 Node.js + Express.js  
- 🗄️ MongoDB + Mongoose (Multi-tenant schema design)  
- 🔐 JWT for authentication  
- 🔑 Bcrypt for password hashing  
- 🛡️ Middleware for route protection  

### Deployment
- 🌍 Vercel (Frontend)  
- ☁️ Cloud-hosted backend (vercel/Render/others)  

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/TEJASTATODE/saas-notes.git
cd saas-notes
