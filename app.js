const helmet = require('helmet');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const pageRouter = require('./routes/pages');
const rateLimit = require('express-rate-limit');
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const corsOptions = {
  origin: ['http://localhost:3000'], // Only allow frontend from this origin
  methods: ['GET', 'POST'],          // Allowed HTTP methods
  credentials: true                  // Allow cookies if needed
};

app.use(cors(corsOptions));

app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use(
  helmet.hsts({
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  })
);

// for body parser. to collect data that sent from the client.
app.use(express.urlencoded({ extended: false }));
app.use(limiter);


// Serve static files. CSS, Images, JS files ... etc
app.use(express.static(path.join(__dirname, 'public')));

// Template engine. PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// session
app.use(session({
  secret: 'youtube_video',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000 * 30
  }
}));

// 🔐 API Key Authentication Middleware
const API_KEY = "supersecretkey123"; // <-- You can customize this

app.use("/secure-api", (req, res, next) => {
  const userKey = req.headers["x-api-key"];
  if (userKey && userKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ message: "❌ Unauthorized: Invalid or missing API key." });
  }
});

// ✅ Protected route
app.get("/secure-api/data", (req, res) => {
  res.json({ message: "✅ Access granted to secure API route." });
});

// Routers
app.use('/', pageRouter);

app.get('/csp-test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CSP Test</title>
    </head>
    <body>
      <h1>CSP Testing Page</h1>
      <script src="https://evil.com/script.js"></script>
    </body>
    </html>
  `);
});

// Errors => page not found 404
app.use((req, res, next) => {
  var err = new Error('Page not found');
  err.status = 404;
  next(err);
});

// Handling errors (send them to the client)
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// Setting up the server
app.listen(3000, () => {
  console.log('Server is running on port 3000...');
});

module.exports = app;
