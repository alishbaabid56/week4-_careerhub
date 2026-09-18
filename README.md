# CareerHub — Jobs & Internship Management Platform

CareerHub is a production-style full-stack web application designed to connect candidates with employment and internship opportunities while providing employers with tools to create and manage job listings and applications.

The project was developed as a final-week full-stack internship capstone with a focus on authentication, role-based access, database persistence, CRUD workflows, search, validation, responsive design, and deployment.

## 🚀 Live Demo

**Live Application:**
https://week4-careerhub-rzcp.vercel.app/

**GitHub Repository:**
https://github.com/alishbaabid56/week4-_careerhub

**Demo Videos:**
See the [`videos/`](./videos) folder for role-based demonstrations.

---

## 📌 Project Overview

CareerHub provides separate experiences for three types of users:

* **Candidates** — discover jobs, view job details, apply for opportunities, and track applications.
* **Employers** — create and manage job opportunities and manage received applications.
* **Administrators** — manage and oversee the platform.

The application uses a persistent PostgreSQL database and authentication system rather than relying only on static frontend data.

---

## ✨ Key Features

### 👤 Authentication

* Candidate registration
* Employer registration
* Login and logout
* Secure session-based authentication
* Protected application areas
* Role-based dashboard access

### 🧑‍💼 Candidate Features

* Candidate account/profile
* Browse available opportunities
* Search for jobs
* View job details
* Apply for jobs
* Track submitted applications
* View application status

### 🏢 Employer Features

* Employer account
* Employer dashboard
* Create job opportunities
* Edit job listings
* Manage job listings
* View applications
* Manage candidate applications

### 🛡️ Admin Features

* Administrative dashboard
* Platform-level management
* User/job/application oversight
* Role-based administrative access

### 🔎 Job Discovery

* Job search
* Keyword-based discovery
* Job categories
* Location-based job information
* Featured opportunities
* Job detail pages

### ✅ Validation & Error Handling

* Form validation
* Required-field validation
* Email validation
* Password validation
* Server-side validation
* User-friendly error messages
* Authentication error handling
* Application workflow validation

### 📱 Responsive Design

CareerHub is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The interface uses responsive layouts and reusable components to maintain a consistent experience across screen sizes.

---

## 🛠️ Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Lucide React
* Framer Motion

### Backend

* Next.js App Router
* Server-side application logic
* API routes / server actions where required

### Database

* PostgreSQL
* Neon
* Drizzle ORM
* Drizzle Kit

### Authentication

* Better Auth
* Drizzle adapter
* Session-based authentication
* Role-based access control

### Validation

* Zod

### Deployment

* Vercel
* Neon PostgreSQL

---

## 👥 User Roles

| Role      | Main Responsibilities                                      |
| --------- | ---------------------------------------------------------- |
| Candidate | Search jobs, view opportunities, apply, track applications |
| Employer  | Create jobs, manage listings, review applications          |
| Admin     | Manage and oversee the platform                            |

Role-based access ensures that users are directed to the appropriate dashboard and protected areas of the application.

---

## 🗄️ Database

CareerHub uses PostgreSQL with Drizzle ORM.

The database includes entities for authentication, users, candidates, employers, jobs, applications, categories, sessions, accounts, and verification data.

### Main Application Entities

* Users
* Candidate Profiles
* Employer Profiles
* Jobs
* Applications
* Categories
* Sessions
* Accounts
* Verifications

The relational structure allows users, jobs, and applications to remain persistent between sessions.

---

## 🔐 Authentication & Authorization

Better Auth is used for authentication and session management.

The application supports:

1. User registration
2. User login
3. Session management
4. Role assignment
5. Protected dashboards
6. Role-based access

Candidates, employers, and administrators receive different access according to their assigned role.

---

## 🔄 Main Application Workflow

### Candidate Workflow

```text
Register
   ↓
Login
   ↓
Candidate Dashboard
   ↓
Search Jobs
   ↓
View Job Details
   ↓
Apply
   ↓
Track Application
```

### Employer Workflow

```text
Register
   ↓
Login
   ↓
Employer Dashboard
   ↓
Create Job
   ↓
Manage Job
   ↓
Receive Applications
   ↓
Manage Applications
```

### Admin Workflow

```text
Admin Login
   ↓
Admin Dashboard
   ↓
Platform Management
   ↓
Users / Jobs / Applications
```

---

## 📂 Project Structure

```text
careerhub/
│
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── jobs/
│   ├── login/
│   ├── register/
│   └── ...
│
├── components/
│   └── reusable UI components
│
├── db/
│   └── database schema and configuration
│
├── drizzle/
│   └── database migrations
│
├── lib/
│   └── authentication, validation and utility logic
│
├── public/
│   └── static assets
│
├── videos/
│   ├── candidate-demo.mp4
│   ├── employer-demo.mp4
│   └── admin-demo.mp4
│
├── README.md
├── report.md
├── package.json
└── ...
```

---

## 🧪 Testing & Validation

The application was tested during development through functional and build validation.

### Core Testing Areas

* Registration
* Login
* Authentication sessions
* Role-based dashboard access
* Job creation
* Job editing
* Job deletion
* Job search
* Job details
* Job applications
* Application management
* Form validation
* Invalid input handling
* Responsive layouts
* Production build

### Build Validation

The project was successfully validated with the production build process.

```bash
npm run build
```

---

## 📊 QA Checklist

| Area                   | Status |
| ---------------------- | ------ |
| Homepage               | ✅      |
| Responsive UI          | ✅      |
| Candidate registration | ✅      |
| Employer registration  | ✅      |
| Login                  | ✅      |
| Role-based dashboards  | ✅      |
| Job search             | ✅      |
| Job details            | ✅      |
| Job CRUD               | ✅      |
| Applications           | ✅      |
| Form validation        | ✅      |
| Database persistence   | ✅      |
| Production build       | ✅      |
| Deployment             | ✅      |

---

## 🎥 Demo Videos

Role-specific demonstrations are stored in the `videos/` directory.

### Candidate Demo

`videos/candidate-demo.mp4`

Demonstrates:

* Candidate registration/login
* Candidate dashboard
* Job search
* Job details
* Applying for a job
* Application tracking

### Employer Demo

`videos/employer-demo.mp4`

Demonstrates:

* Employer login
* Employer dashboard
* Creating a job
* Managing job listings
* Viewing applications
* Managing applications

### Admin Demo

`videos/admin-demo.mp4`

Demonstrates:

* Admin login
* Admin dashboard
* Platform management
* User/job/application oversight

---

## 📸 Screenshots

Screenshots of the final application can be added here as the final submission evidence.

Recommended screenshots:

* Homepage
* Login
* Registration
* Candidate Dashboard
* Find Jobs
* Job Details
* Application Tracking
* Employer Dashboard
* Create Job
* Employer Applications
* Admin Dashboard
* Mobile Responsive View

---

## 🔒 Security Considerations

The application follows several security practices:

* Sensitive environment variables are stored outside source control.
* Authentication is handled through Better Auth.
* Database access is handled through the server-side application.
* Protected application areas use authentication/authorization checks.
* Input validation is performed before processing user data.
* Secrets and database credentials are not hard-coded into the frontend.

---

## ⚙️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/alishbaabid56/week4-_careerhub.git
cd week4-_careerhub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create an environment file and add the required database and authentication configuration.

Example:

```env
DATABASE_URL=your_neon_database_url
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
```

Do not commit real secrets to GitHub.

### 4. Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Create a production build

```bash
npm run build
```

---

## 🌐 Deployment

CareerHub is deployed using Vercel.

### Production URL

https://week4-careerhub-rzcp.vercel.app/

The application uses Neon PostgreSQL for persistent production database storage.

---

## 🎯 Project Goals

The main goals of CareerHub were to demonstrate:

* Full-stack development
* Database integration
* Authentication
* Role-based authorization
* CRUD operations
* Search functionality
* Form validation
* Responsive UI development
* Production deployment
* Error handling
* Professional project organization

---

## 🚧 Limitations

Although CareerHub provides the core functionality of a job and internship management platform, a production-scale version could be extended with:

* Email notifications
* Resume file uploads
* Advanced job recommendation algorithms
* Interview scheduling
* Real-time notifications
* Employer verification
* Advanced analytics
* Saved jobs
* Application reminders

---

## 🔮 Future Improvements

Possible future improvements include:

1. AI-powered job recommendations
2. Resume/CV parsing
3. Candidate-job matching
4. Email notification system
5. Interview scheduling
6. Real-time application updates
7. Advanced employer analytics
8. Saved jobs and personalized job alerts
9. Enhanced accessibility auditing
10. Automated end-to-end testing

---

## 👩‍💻 Developer

**Alishba Abid**

Full Stack Developer with AI

GitHub:
https://github.com/alishbaabid56

---

## 📄 Internship Submission

This project was developed as a final-week full-stack internship capstone demonstrating a complete production-style web application with authentication, database persistence, role-based access, CRUD workflows, validation, responsive UI, deployment, and documentation.
