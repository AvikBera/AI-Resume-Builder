# 🚀 AI Resume Builder Builder

An AI-powered Resume Builder that helps users create professional resumes, analyze resume quality, improve ATS scores, and download resumes as PDF files.

## ✨ Features

* 🔐 User Authentication (Login / Signup)
* 🤖 AI Resume Analysis using Gemini AI
* 📄 Professional Resume Templates
* 📊 ATS Score Evaluation
* 📝 Resume Editing & Customization
* 📥 PDF Resume Download
* 🌙 Modern Responsive UI
* 🔥 Firebase Authentication Support

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* CSS3
* React Router DOM

### AI Integration

* Google Gemini AI
* @google/generative-ai

### Authentication

* Firebase Authentication



## ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/ai-resume-builder.git
```

Navigate into the project:

```bash
cd ai-resume-builder
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## 🤖 Gemini Configuration

Create `gemini.js`

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});
```

## 🚀 Build for Production

```bash
npm run build
```

## 🌐 Deployment

Deploy easily on:

* Vercel
* Netlify
* Firebase Hosting

## 📸 Screenshots

Add screenshots of:

* Home Page
* Resume Builder
* AI Analysis
* ATS Score Dashboard

## 👨‍💻 Author

**Akash Maity**

BCA Student | Full Stack Developer

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you like this project, please give it a star on GitHub.
