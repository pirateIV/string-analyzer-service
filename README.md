# String Analyzer Service - HNG Backend Stage 1

A lightweight Express.js API for analyzing and managing strings.
It computes and stores string properties such as **length**, **palindromic status**, **unique characters**, **word count**, and **SHA256 encryption** — all in memory.

---

### Features

-  Compute SHA256 hash of any string.
-  Detect if a string is a palindrome.
-  Get character frequency map and word count.
-  Store analyzed strings in an in-memory database.
-  Retrieve all stored strings or a specific one.
-  Query strings using **natural language** (e.g., “strings containing the letter z”).

---

### Tech Stack

-  **Node.js** + **Express.js**
-  **JavaScript (ES Modules)**
-  In-memory storage (using `Map`)
-  Crypto utilities for hashing
-  dotenv (not required, unless to change the default port)

---

### Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/string-analyzer-service.git
   cd string-analyzer-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create an `.env` file in the root directory:

   ```bash
   PORT=3000
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

   The service runs on [http://localhost:3000](http://localhost:3000).

---

### API Routes

#### **POST /strings**

Analyze and store a new string.

**Request Body:**

```json
{
	"value": "level"
}
```

**Response:**

```json
{
	"id": "<sha256_hash>",
	"value": "level",
	"properties": {
		"length": 5,
		"is_palindrome": true,
		"unique_characters": 4,
		"word_count": 1,
		"sha256_hash": "<sha256_hash>",
		"character_frequency_map": {
			"l": 2,
			"e": 1,
			"v": 1
		}
	},
	"createdAt": "2025-10-21T00:00:00.000Z"
}
```

---

#### **GET /strings**

Retrieve all analyzed strings.

**Example Request:**

```
GET /strings
```

**Query Filters (optional):**

```
/strings?is_palindrome=true
/strings?min_length=10
/strings?word_count=2
/strings?contains_character=z
```

---

#### **GET /strings/:string_value**

Retrieve a specific analyzed string.

**Example:**

```
GET /strings/level
```

**Response:**

```json
{
  "id": "<sha256_hash>",
  "value": "level",
  "properties": { ... }
}
```

---

#### **GET /strings/filter-by-natural-language**

Perform natural-language filtering.

**Example:**

```
GET /strings/filter-by-natural-language?query=all single word palindromic strings
```

**Response:**

```json
{
  "data": [
    {
      "value": "level",
      "properties": { ... }
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

---

### Example Strings for Testing

```js
[
	"level",
	"madam",
	"hello world",
	"racecar",
	"A man a plan a canal Panama",
	"amazing",
	"Zebra zone",
	"this is a very long string for testing",
];
```

---

### How It Works

1. The service hashes every string using SHA256 to ensure uniqueness.
2. It stores the computed properties in an in-memory `Map`.
3. Subsequent requests check against this hash before insertion.
4. Natural-language queries map to preset filters (like length, word count, etc.).

---

### My notes

> “I built this project to understand string algorithms, natural language parsing, and efficient in-memory data management in Node.js.”

---

### Future Improvements

-  Implement persistent storage using MongoDB.
-  Extend the natural-language parser to handle more flexible queries.
-  Add input normalization (ignore case and punctuation in palindrome check).
-  Introduce automated tests with Jest or Supertest.
