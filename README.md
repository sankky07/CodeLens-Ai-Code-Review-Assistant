# 🔍 CodeLens — AI Code Review Assistant

> **AI-powered code review for GitHub repositories.**

CodeLens is a full-stack AI code review platform that analyzes source code from GitHub repositories and provides structured feedback on **bugs, security vulnerabilities, performance issues, code smells, best practices, and potential improvements**.

Instead of manually reviewing large repositories file by file, CodeLens uses an LLM-powered analysis pipeline to produce an organized code-quality report with an overall score and actionable recommendations.

---

## ✨ Features

### 🤖 AI-Powered Code Review

Analyze repository source code using an LLM and receive structured review results.

### 🐛 Bug Detection

Identifies potential bugs, incorrect logic, error-prone implementations, and problematic code patterns.

### 🔐 Security Analysis

Highlights potential security vulnerabilities and insecure coding practices.

### ⚡ Performance Analysis

Detects inefficient implementations and areas where application performance could be improved.

### 🧹 Code Smell Detection

Finds maintainability problems, duplicated logic, overly complex code, and other code-quality issues.

### 📊 Code Quality Score

Generates an overall score with a corresponding quality label to provide a quick assessment of the repository.

### 📁 Repository Analysis

Connects with GitHub repositories and scans supported source files while applying review limits to keep AI requests manageable.

### 📋 Structured Review

Review results are organized into sections including:

* Overall Summary
* Strengths
* Critical Issues
* Bugs
* Security Issues
* Performance Issues
* Code Smells
* Best Practices
* Suggested Improvements
* Files Reviewed

### 🔐 GitHub OAuth Authentication

Users can authenticate through GitHub and work with their repositories securely.

### 🗂️ Review History

Previous repository reviews can be stored and accessed for later reference.

---

## 🏗️ Tech Stack

### Frontend

* React 19
* Vite
* Tailwind CSS
* Framer Motion
* Axios
* React Router
* React Markdown
* React Hot Toast
* Lucide React

### Backend

* Java 21
* Spring Boot 3.5
* Spring Security
* Spring Data JPA
* Spring OAuth2 Client
* REST APIs
* JWT
* JGit
* GitHub API

### Database & Infrastructure

* PostgreSQL
* Redis
* Maven

### AI

* Groq API
* OpenAI-compatible API
* `openai/gpt-oss-120b`

---

## 🧠 How It Works

```text
┌─────────────────────┐
│      React UI       │
│     Frontend        │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│   Spring Boot API   │
│      Backend        │
└──────────┬──────────┘
           │
     ┌─────┼──────────┐
     │     │          │
     ▼     ▼          ▼
 GitHub  PostgreSQL  Redis
     │
     ▼
┌─────────────────────┐
│ Repository Scanner  │
│  & File Extraction  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Groq LLM       │
│  AI Code Analysis   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Structured Review   │
│       Report        │
└─────────────────────┘
```

### Review Pipeline

1. User authenticates with GitHub.
2. User selects a repository.
3. CodeLens retrieves the repository source.
4. The backend scans supported source files.
5. Files are filtered and bounded to keep the AI request within practical limits.
6. Relevant source code is sent to the AI model.
7. The model returns structured JSON analysis.
8. The backend validates and processes the result.
9. The frontend displays the complete code review.
10. The review can be stored in review history.

---

## 📂 Project Structure

```text
CodeLens-Ai-Code-Review-Assistant/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/sanket/backend/
│   │   │   │       ├── ai/
│   │   │   │       ├── auth/
│   │   │   │       ├── common/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── exception/
│   │   │   │       ├── github/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       └── service/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties.example
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Local Development

### Prerequisites

Make sure you have:

* Java 21+
* Maven
* Node.js
* PostgreSQL
* Redis
* Git
* GitHub OAuth application
* Groq API key

---

## 🔧 Backend Configuration

Navigate to:

```text
backend/src/main/resources/
```

Create:

```text
application.properties
```

using:

```text
application.properties.example
```

Configure your local environment with the required:

* PostgreSQL credentials
* GitHub OAuth credentials
* JWT configuration
* Groq API key
* Redis configuration
* Application settings

**Never commit real API keys, passwords, OAuth secrets, or JWT secrets to Git.**

---

## ▶️ Running the Backend

From the project root:

```bash
cd backend
```

Then run:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend will start using the configured Spring Boot port.

---

## ▶️ Running the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide the local development URL.

---

## 🔑 Environment Variables & Secrets

The following types of credentials are required depending on your configuration:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD

GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET

GROQ_API_KEY

JWT_SECRET

REDIS_URL
```

Use environment variables or local configuration files for secrets.

The repository intentionally contains an example configuration rather than production credentials.

---

## 🛡️ AI Review Limits

To keep repository analysis practical and prevent excessively large AI requests, CodeLens applies limits during source-code scanning.

The review pipeline limits:

* Number of source files analyzed
* Characters analyzed per file
* Total characters sent for analysis

Unreadable or unsupported files are skipped.

This allows CodeLens to provide useful repository-level analysis without blindly sending an entire repository to the AI model.

---

## 📊 Review Output

A typical CodeLens review contains:

```text
Overall Score
      │
      ├── Overall Summary
      │
      ├── Strengths
      │
      ├── Critical Issues
      │
      ├── Bugs
      │
      ├── Security Issues
      │
      ├── Performance Issues
      │
      ├── Code Smells
      │
      ├── Best Practices
      │
      ├── Suggested Improvements
      │
      └── Files Reviewed
```

The frontend presents these results through an interactive review interface.

---

## 🔒 Security Considerations

CodeLens handles authentication and external API credentials, so security is an important part of the architecture.

Key considerations include:

* GitHub OAuth authentication
* JWT-based application authentication
* Server-side API credentials
* Environment-based secret configuration
* PostgreSQL persistence
* CORS configuration
* Repository access through authenticated GitHub APIs
* No hard-coded production secrets in source control

---

## 🚀 Deployment

The project is designed to be deployed as separate frontend and backend services.

### Frontend

The React/Vite application can be deployed using platforms such as Vercel.

### Backend

The Spring Boot application can be deployed using platforms such as Render or another Java-compatible cloud platform.

### Database

PostgreSQL can be hosted using a managed PostgreSQL provider.

Production deployment requires configuring:

* Backend environment variables
* Production PostgreSQL connection
* Redis
* GitHub OAuth callback URL
* CORS allowed origins
* Frontend API URL
* Groq API credentials

---

## 🧪 Testing

Backend tests are located under:

```text
backend/src/test/
```

Run the backend test suite with:

```bash
cd backend
./mvnw test
```

On Windows:

```powershell
.\mvnw.cmd test
```

---

## 🔮 Future Improvements

Potential improvements for future versions include:

* Pull request review automation
* GitHub webhook integration
* Line-level code comments
* Multi-model AI support
* Review comparison between commits
* Repository-wide architecture analysis
* Custom review rules
* Team workspaces
* Exportable review reports
* CI/CD integration
* Automated quality gates
* Improved large-repository handling
* Code quality trends over time

---

## 👨‍💻 Author

**Sanket Sahu**

Full-Stack Developer interested in:

* Java & Spring Boot
* React
* AI/LLM applications
* Backend engineering
* Developer tools
* Software architecture

---

## ⭐ Why CodeLens?

Traditional code review can become difficult when repositories grow large.

CodeLens combines:

**GitHub + Spring Boot + React + AI + structured analysis**

to create a developer-focused code review workflow that turns source code into an actionable engineering report.

If you find the project useful, consider giving the repository a ⭐.

---

## 📄 License

This project is currently available for educational and portfolio purposes.
