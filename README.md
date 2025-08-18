# 📬 Email API - README

A Node.js/Express API to send transactional emails using dynamic Pug templates, secure authentication, and resilient delivery with retry logic.

---

## 🚀 Features

* ✅ API key authentication
* ✅ Rate limiting (5 requests/minute per IP)
* ✅ Email validation & sanitization
* ✅ Pug template rendering
* ✅ CSS inlining via Juice
* ✅ Robust error handling
* ✅ Logging with Winston (console + file)
* ✅ Retry logic for transient SMTP failures

---

## 📦 Tech Stack

* **Node.js**
* **Express**
* **Nodemailer**
* **Pug**
* **Juice**
* **Winston**

---

## 📂 Folder Structure

```
email-api/
├── config/
│   ├── nodemailer.js           # SMTP config
│   └── emailSubjects.js        # Centralized email subject lines
├── controllers/
│   └── emails.js               # Main email sending logic
├── logs/
│   └── email-api.log           # Output log file
├── middleware/
│   ├── apiKey.js               # API key auth middleware
│   ├── rateLimiter.js          # Express rate-limiter config
│   └── validateEmailInput.js   # Input validation/sanitization
├── routes/
│   └── api.js                # POST /api/email route
├── utils/
│   ├── logger.js               # Winston logger config
│   └── retry.js                # Generic retry wrapper
├── views/
│   └── emails/                 # Pug templates
│       ├── welcome.pug
│       ├── verify.pug
│       └── password-reset.pug
├── server.js                   # App entry point
└── .env                        # Environment variables
```

---

## 🛡️ Middleware Stack for POST /api/email

```
checkApiKey              🔐 Auth via x-api-key header
emailLimiter             🛡️ Prevents spam (5/min/IP)
validateEmailInput()     ✅ Validates structure, format, and allowed templates
sendEmail                📤 Handles rendering, sending, retrying
```

---

## 📥 Example Request (REST Client)

```http
POST http://localhost:4100/api/email
Content-Type: application/json
x-api-key: <your-valid-api-key>

{
  "template": "welcome",
  "to": "user@example.com",
  "variables": {
    "name": "Juan",
    "link": "https://example.com/dashboard"
  }
}
```

---

## ❗ Errors Handled

### 🧨 Common Failures

* Missing fields
* Invalid email format
* Template not found or broken
* Email content too large
* SMTP/network errors
* Rate limiting
* Invalid API key

### ⚠️ Edge Cases

* Long subjects or variable values
* Retry on transient SMTP errors
* Logging for every critical action

---

## 📈 Logging Examples (Winston)

```
[2025-07-08T23:59:12.345Z] INFO: Incoming email request to: user@example.com with template: welcome
[2025-07-08T23:59:13.001Z] INFO: Email sent to user@example.com (Message ID: <abc123...>)
[2025-07-08T23:59:14.001Z] WARN: Attempt 1 failed: Connection timeout
[2025-07-08T23:59:16.001Z] ERROR: Failed to send email after 3 attempts
```

---

## 🔄 Retry Logic

Email sending uses a wrapper around `transporter.sendMail()` that:

* Retries up to 3 times
* Waits 1 second between attempts
* Logs every failure and final success/error

---

## 👤 Author

Musire
