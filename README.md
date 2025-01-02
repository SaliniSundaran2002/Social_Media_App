# Social Media App - Proof of Concept (POC)

## Overview

This project is a simplified social media Proof of Concept (POC) application where users can:
- Register and Log In
- Create, Read, Update, and Delete (CRUD) Posts
- Like and Comment on Posts
- View a List of Posts

The application demonstrates a full-stack development workflow using the MERN stack (MongoDB, Express.js, React, and Node.js).

---

## Features

### Frontend (React)
- **User Interface:** A user-friendly interface to navigate the app seamlessly.
- **User Authentication:** Secure user registration and login functionality.
- **Post Management:** Components for creating, displaying, updating, deleting posts, and handling user interactions (like, comment).
- **State Management:** Application state is managed using Context API or Redux.

### Backend (Node.js + Express)
- **API Setup:** RESTful API for handling authentication and post management.
- **Authentication:** JWT-based secure user sessions.
- **CRUD Operations:** Endpoints to create, read, update, and delete posts.

### Database (MongoDB)
- **Schema Design:** Mongoose schemas for users and posts.
- **Data Validation:** Validation and error handling for API requests.
- **Relationships:** User-post relationship defined using the `userId` field in the post schema.

---

## Setup Instructions

### Prerequisites
- Node.js and npm
- MongoDB
- Git

### Steps to Run the Application
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/SaliniSundaran2002/Social_Media_App
   cd Social_Media_App
2. **Frontend Setup:**
   ```bash
      cd ui
      npm i
      npm run dev

3. **Backend Setup:**
   ```bash
     cd server
     npm i
     npm run dev
4. **Create a `.env` file:**
   ```bash
     PORT=your_port_number
     UI=ui_port_number
     MONGO_URI=your_mongodb_uri
     SECRET_KEY=secret_key
