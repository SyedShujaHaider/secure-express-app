const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const rateLimit = require('express-rate-limit');
const pageRouter = require('./routes/pages');
const db = require('./pool');

const app = express();

// 🔒 Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// 🔒 CORS
const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
};

// 🔒 Helmet Security
app.use(cors(corsOptions));
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));

app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true,
}));

// 🔧 Core Middleware
app.use(cookieParser());
app.use(session({
  secret: 'some_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 1000 * 30 }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(limiter);

// 📁 Static files
app.use(express.static(path.join(__dirname, 'public')));

// 🎨 Template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 🛡️ CSRF Protection Middleware
app.use(csurf({ cookie: true }));

// Make csrfToken available to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// 🔐 API Key Middleware
const API_KEY = "supersecretkey123";

app.use("/secure-api", (req, res, next) => {
  const userKey = req.headers["x-api-key"];
  if (userKey && userKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ message: "❌ Unauthorized: Invalid or missing API key." });
  }
});

app.get("/secure-api/data", (req, res) => {
  res.json({ message: "✅ Access granted to secure API route." });
});

// 📄 Routes
app.use('/', pageRouter);

// 🧪 CSP testing
app.get('/csp-test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>CSP Test</title></head>
    <body>
      <h1>CSP Testing Page</h1>
      <script src="https://evil.com/script.js"></script>
    </body>
    </html>
  `);
});

// ✅ SECURE Login route using parameterized query
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  db.query(query, [username, password], (err, result) => {
    if (err) return res.status(500).send("DB error");
    if (result.length > 0) {
      res.send("✅ Login success");
    } else {
      res.send("❌ Login failed");
    }
  });
});

// ❌ Fallback 404 error
app.use((req, res, next) => {
  const err = new Error('Page not found');
  err.status = 404;
  next(err);
});

// 🚨 CSRF error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).send('⛔ Form tampered with! CSRF validation failed.');
  }

  res.status(err.status || 500);
  res.send(err.message || 'Internal Server Error');
});

// 🚀 Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000...');
});

module.exports = app;

