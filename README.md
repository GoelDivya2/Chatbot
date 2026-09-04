# 🤖 AI Chatbot Backend

A RESTful backend for an AI chatbot application built with **Node.js, Express.js, and MongoDB**.

The backend provides user authentication through **email OTP verification**, JWT-based authorization, chat management, conversation persistence, and APIs that can be used by a chatbot frontend.

## 🚀 Features

* 📧 Email-based OTP authentication
* 🔐 JWT-based authentication
* 👤 User profile API
* 💬 Create new chats
* 📋 Retrieve all chats for an authenticated user
* 🗨️ Store question-and-answer conversations
* 📖 Retrieve conversation history
* 🗑️ Delete chats and their associated conversations
* 💾 MongoDB database integration
* 🌐 RESTful API architecture
* ⚡ Express.js backend with ES Modules

## 🛠️ Tech Stack

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| Node.js    | JavaScript runtime              |
| Express.js | REST API framework              |
| MongoDB    | Database                        |
| Mongoose   | MongoDB ODM                     |
| JWT        | Authentication                  |
| Resend     | OTP email delivery              |
| Nodemailer | Email-related dependency        |
| dotenv     | Environment variable management |
| CORS       | Cross-origin request handling   |
| Nodemon    | Development server              |

The current `package.json` confirms Express, Mongoose, JWT, dotenv, CORS, Resend, Nodemailer, and Nodemon as project dependencies.

## 🏗️ Project Structure

```text
Chatbot/
│
├── controllers/
│   ├── chatControllers.js
│   └── userControllers.js
│
├── database/
│   └── db.js
│
├── middlewares/
│   ├── isAuth.js
│   └── sendMail.js
│
├── models/
│   ├── Chat.js
│   ├── Conversation.js
│   └── User.js
│
├── routes/
│   ├── chatRoutes.js
│   └── userRoutes.js
│
├── index.js
├── package.json
├── package-lock.json
└── .gitignore
```

The repository currently follows this controllers → routes → middleware → models → database organization.

## 🔄 Authentication Flow

The application uses **email OTP authentication**.

```text
User enters email
       ↓
POST /api/user/login
       ↓
Check if user exists
       ↓
Create user if necessary
       ↓
Generate OTP
       ↓
Send OTP through Resend
       ↓
Return verification token
       ↓
User enters OTP
       ↓
POST /api/user/verify
       ↓
Verify OTP + verification token
       ↓
Generate JWT
       ↓
User authenticated
```

The login controller generates a six-digit OTP and creates a short-lived verification JWT. After successful OTP verification, another JWT is generated with a five-day expiry.

## 🔐 Authorization

Protected routes use the `isAuth` middleware.

The middleware:

1. Reads the JWT from the request's `token` header.
2. Verifies the token using `Jwt_sec`.
3. Finds the corresponding user.
4. Stores the user in `req.user`.
5. Allows the request to continue.

### Authentication Header

For protected endpoints, send:

```http
token: YOUR_JWT_TOKEN
```

## 💬 Chat Flow

```text
Authenticated User
       ↓
Create Chat
       ↓
Chat ID generated
       ↓
User sends question
       ↓
AI/frontend generates answer
       ↓
Question + Answer sent to backend
       ↓
Conversation stored in MongoDB
       ↓
Conversation can be retrieved later
```

The backend's conversation controller stores the supplied `question` and `answer` against a chat. It also updates the chat's `latestMessage`.

## 🤖 Gemini Integration

The chatbot application is designed to work with an AI response generator such as **Google Gemini**.

However, in the current repository, the backend **does not directly call the Gemini API**.

The backend's responsibility is to:

```text
Frontend / AI Layer
        ↓
Generate AI Answer
        ↓
Backend API
        ↓
Store Question + Answer
        ↓
MongoDB
```

For example, the backend conversation endpoint accepts:

```json
{
  "question": "What is JavaScript?",
  "answer": "JavaScript is a programming language used to build interactive web applications."
}
```

The current `chatControllers.js` stores these values in the `Conversation` model.

> **Note:** If Gemini API integration is added to the backend later, this section can be updated to document the Gemini service, API key, model, and request flow.

## 🗄️ Database Design

### User

The `User` model currently stores:

```text
User
├── email
├── createdAt
└── updatedAt
```

Email addresses are unique.

### Chat

```text
Chat
├── user
├── latestMessage
├── createdAt
└── updatedAt
```

Each chat belongs to a user.

### Conversation

```text
Conversation
├── chat
├── question
├── answer
├── createdAt
└── updatedAt
```

Each conversation belongs to a chat and contains a question-answer pair.

## 📡 API Endpoints

### Authentication

#### Login / Request OTP

```http
POST /api/user/login
```

Request:

```json
{
  "email": "user@example.com"
}
```

The backend generates an OTP, sends it through Resend, and returns a verification token.

---

#### Verify OTP

```http
POST /api/user/verify
```

Request:

```json
{
  "otp": 123456,
  "verifyToken": "YOUR_VERIFICATION_TOKEN"
}
```

Successful verification returns a JWT authentication token.

---

#### Get Profile

```http
GET /api/user/me
```

Requires authentication.

Returns the authenticated user's profile.

---

### Chat

#### Create New Chat

```http
POST /api/chat/new
```

Requires authentication.

---

#### Get All Chats

```http
GET /api/chat/all
```

Requires authentication.

Chats are returned for the authenticated user and sorted by creation date.

---

#### Add Conversation

```http
POST /api/chat/:id
```

Requires authentication.

Request:

```json
{
  "question": "Your question",
  "answer": "AI generated answer"
}
```

The question and answer are stored as a conversation associated with the specified chat.

---

#### Get Conversation

```http
GET /api/chat/:id
```

Requires authentication.

Returns conversations associated with the specified chat.

---

#### Delete Chat

```http
DELETE /api/chat/:id
```

Requires authentication.

Deletes the chat and its associated conversations. The controller also checks that the authenticated user owns the chat.

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/GoelDivya2/Chatbot.git
```

### 2. Navigate to the project

```bash
cd Chatbot
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create `.env`

Create a `.env` file in the project root:

```env
PORT=5000

Db_url=your_mongodb_connection_string

Jwt_sec=your_jwt_secret

Activation_sec=your_activation_secret

RESEND_API_KEY=your_resend_api_key
```

The current code reads `Db_url` for MongoDB, `Jwt_sec` for the authentication JWT, `Activation_sec` for the OTP verification token, and `RESEND_API_KEY` for email delivery.

### 5. Start the development server

```bash
npm run dev
```

The project uses Nodemon for development.

### 6. Start normally

```bash
npm start
```

The server starts on port `5000` by default unless another port is provided through the environment variables.

## 📁 API Base Routes

The application mounts:

```text
/api/user
/api/chat
```

These routes are registered directly in `index.js`.

## 🔒 Environment Variables

Do not commit your `.env` file.

Required variables:

```text
Db_url
Jwt_sec
Activation_sec
RESEND_API_KEY
PORT
```

Keep API keys, database credentials, and JWT secrets private.

## 🔮 Future Improvements

* Integrate Gemini directly into the backend
* Add a dedicated Gemini service layer
* Add conversation context to Gemini requests
* Add request validation
* Add centralized error handling
* Add rate limiting
* Add API documentation with Swagger/OpenAPI
* Add automated API tests
* Add streaming AI responses

## 👨‍💻 Author

**Divya Goel**

B.Tech Computer Science & Engineering
