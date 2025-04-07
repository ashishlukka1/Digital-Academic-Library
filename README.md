# 📚 Digital Academic Library

A centralized platform that simplifies access to academic materials like research papers, books, and course content. Built to overcome the limitations of traditional e-libraries and restricted journal access, the system fosters collaboration and structured knowledge sharing in academic institutions.

## 🚨 Problem Overview

Students and researchers often face challenges accessing reliable academic resources due to:
- Restricted access to paid journals (IEEE, Springer, Elsevier).
- Disorganized storage of course and research materials.
- Lack of a centralized academic knowledge base.
- Outdated or physically limited e-library platforms.
- Heavy reliance on unofficial or low-credibility sources.

## 🎯 Solution

The **Digital Academic Library** aims to solve these challenges by offering a modern, centralized, and collaborative academic content management platform.

## ✨ Features

1. **📁 Structured Academic Repository**  
   Upload, categorize, and manage research papers, books, and course materials in a structured and accessible format.

2. **🔍 Advanced Search & Filtering**  
   Easily locate materials by topic, author, or publication year with smart search and filtering capabilities.

3. **🔐 Role-Based Access Control**  
   Separate access levels for:
   - Faculty
   - Students
   - Public users  
   Ensuring secure and appropriate content management.

4. **📩 Material Request System**  
   Students can request unavailable materials. Admins/faculty can review and approve relevant additions to the library.

5. **💬 Collaborative Discussion Forums**  
   Real-time, subject-specific discussions using WebSockets. Q&A, doubt clearing, and academic discourse in one place.

6. **📚 Offline Book Service Management**  
   Slot-based booking system for borrowing physical books. Includes automated submission reminders via Twilio messaging.

7. **🤖 AI-Powered Chatbot (Gemini)**  
   A Gemini-integrated chatbot to guide users, answer common queries, and provide material suggestions.

## 🔧 Tech Stack

- **Frontend:** React.js / HTML / CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-Time Communication:** WebSockets
- **Notifications:** Twilio API for SMS updates
- **AI Assistant:** Gemini API integration

## 🚀 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/ashishlukka1/Digital-Academic-Library.git
cd Digital-Academic-Library

# Install dependencies
npm install

# Set up environment variables (.env file)
# Example:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# TWILIO_ACCOUNT_SID=your_twilio_sid
# TWILIO_AUTH_TOKEN=your_twilio_token
# GEMINI_API_KEY=your_gemini_key

# Start the server
npm start
