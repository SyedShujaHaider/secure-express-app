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
