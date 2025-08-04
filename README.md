# AI-Optimized Personal Cloud Storage

A lightweight, full-stack file storage application built with Node.js, Express, MongoDB Atlas, and React. 
Features include file upload, metadata listing, download, and deletion, with a foundation for future AI-powered tagging and user authentication.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js, Mongoose, Multer
- **Database:** MongoDB Atlas
- **Frontend:** React (Vite), Fetch API, CSS
- **Dev Tools:** VS Code, Git, GitHub

---

## 📋 Prerequisites

- Node.js v18+ and npm
- MongoDB Atlas account & cluster
- Git & GitHub account
- React

---

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/personal-cloud.git
   cd personal-cloud
   ```
2. **Setup the Backend**
   ```bash
    cd backend
    npm install   
   ```
3. **Setup the Frontend**
   ```bash
    cd ../frontend
    npm install
   ```
---

##⚙️ Configuration

1. In the backend **/folder**, create a **.env** file with:
   ```bash
      MONGODB_URI=mongodb+srv://<username>:<password>@personal-cloud-cluster.eqfcbeo.mongodb.net/?retryWrites=true&w=majority
      PORT=3000
   ```
2. Whitelist your IP in MongoDB Atlas Network Access.
