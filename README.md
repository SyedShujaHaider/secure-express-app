🔐 Secure Express App

This project demonstrates core web application security mechanisms implemented in a Node.js + Express.js application as part of a cybersecurity internship.

---

✅ Features Implemented

1. Rate Limiting
Protects the server from abuse or brute-force attacks using `express-rate-limit`.

- Each IP is limited to 100 requests every 15 minutes.
- Users exceeding this limit get a `429 Too Many Requests` error.

---

2. CORS (Cross-Origin Resource Sharing)
Cross-origin requests are restricted to http://localhost:3000.

- All other origins are blocked by CORS policy.
- Protects against unauthorized cross-site requests.

---

3. Helmet Security Headers
The app uses helmet to set critical HTTP headers for protection.

🔐 Content Security Policy (CSP)
Blocks unauthorized scripts:

helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  }
});

---

📦 HTTP Strict Transport Security (HSTS)
Enforces HTTPS connections:


helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true,
});

---

4. API Key Authentication
A secure route is protected with an API key.

🔓 Without API key: 

curl http://localhost:3000/secure-api/data

Response:

{ "message": "❌ Unauthorized: Invalid or missing API key." }

🔐 With API key: 

curl -H "x-api-key: supersecretkey123" http://localhost:3000/secure-api/data

Response:

{ "message": "✅ Access granted to secure API route." }

---

🧪 How to Run the Project Locally

1. Clone the Repository 

git clone https://github.com/SyedShujaHaider/secure-express-app.git
cd secure-express-app


2. Install Dependencies 

npm install


3. Start the Server 

node app.js


The server will run at: http://localhost:3000

---

📁 Project Structure

secure-express-app/
├── app.js
├── routes/
│   └── pages.js
├── views/
│   └── *.pug
├── public/
│   └── css, js, assets
├── screenshots/
│   └── *.png   <-- Put your screenshots here
└── README.md


---

🛠 Technologies Used

- Node.js 
- Express.js 
- Helmet 
- CORS 
- express-rate-limit 
- API Key Authentication 
- Pug 
- Git/GitHub

---

🧠 Author

Syed Shuja Haider 
Cybersecurity Internship – Week 4 Final Submission 
🔗 GitHub Repository: https://github.com/SyedShujaHaider/secure-express-app

🛡️ Week 5 Ethical Hacking Report

Name: Syed Shuja Haider
Project Title: Exploiting and Securing Vulnerabilities in a Node.js Web Application

🎯 Objective
To understand and practice ethical hacking techniques in a test environment by:
    • Conducting basic reconnaissance
    • Exploiting SQL Injection (SQLi) and CSRF vulnerabilities
    • Applying fixes using security middleware and best practices
    • Documenting findings and mitigations

🔍 1. Ethical Hacking Basics
✔️ Tools Used:
    • Kali Linux (in VirtualBox)

      
    • SQLMap
    • Burp Suite Community Edition
    • Node.js Express Application (custom login/register app)
    • Browser Proxy Tools: FoxyProxy (Firefox)
✔️ Reconnaissance:
Performed active and passive reconnaissance using:
    • nmap for port scanning
    • Manual browsing to identify potential entry points (/login, /register)
    • Observed form submission behavior and session management using browser DevTools

💉 2. SQL Injection & Exploitation
🔎 Vulnerability Found:
The login route in the backend used string concatenation to build SQL queries:
db.query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`);
This allowed attackers to inject SQL commands like:
Username: ' OR 1=1 --
Password: anything
🛠️ Exploitation:
    • Used sqlmap:
      sqlmap -u "http://localhost:3000/login" –data="username=admin&password=admin123"
      
    • SQLMap confirmed the vulnerability and database schema exposure risk
✅ Fix Implemented:
Converted to parameterized queries using prepared statements:

db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

🔒 3. CSRF (Cross-Site Request Forgery) Protection
🔎 Vulnerability Found:
Original POST /register and POST /login routes accepted form submissions without CSRF validation.
This could be exploited by embedding a malicious form in an attacker’s site, tricking a logged-in user to unknowingly submit sensitive data.
✅ Fix Implemented:
Integrated the csurf middleware in app.js:
const csrf = require('csurf');
app.use(csrf());
Passed CSRF token to Pug templates:
res.render('includes/register', { csrfToken: req.csrfToken() });
Added token input field in forms:
input(type="hidden", name="_csrf", value=csrfToken)
🧪 Attempted CSRF Exploit:
Tool Used: Burp Suite Community Edition
    • Intercepted requests via FoxyProxy
    • Removed _csrf field from POST /register request
    • Expected error message like “Form tampered with!”
⚠️ Issue:
Despite correct setup:
    • Burp showed error: "Unsupported or unrecognized SSL message"
    • SSL proxy handshake failed even after installing Burp CA certificate
    • The app was running at https://localhost:3000, and proxy interception didn’t complete due to HTTPS handshake conflict
📝 Note: The protection is implemented and manually verified. Burp Suite Community Edition’s HTTPS limitations prevented full test execution.




📂 Deliverables
✅ 1. Vulnerability Details
    • SQL Injection on login route (exploited with SQLMap)
    • CSRF on register/login forms (attempted exploit failed due to proxy error, but issue is fixed in code)
✅ 2. Security Fixes Implemented
    • Parameterized queries to prevent SQL Injection
    • csurf middleware to protect against CSRF
✅ 3. Updated GitHub Repository
    • All fixes committed with comments and documentation
    • Includes:
        ◦ app.js and routes/pages.js updates
        ◦ views/includes/*.pug templates with CSRF tokens
        ◦ README.md with security overview and setup
🔗 GitHub Repository: [Insert Link]

📌 Conclusion
This week focused on real-world vulnerabilities like SQL Injection and CSRF. I successfully implemented secure coding practices and middleware to prevent them. Although Burp Suite Community Edition had SSL proxy limitations, the logic of CSRF protection was verified manually and through expected middleware behavior. I now understand how malicious actors can manipulate unprotected routes — and how to shield them.

