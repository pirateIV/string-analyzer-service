import express from "express";

import { env } from "./config/env.js";
import {
	getCharacterFrequencyMap,
	getSha256Encryption,
	getUniqueCharCount,
	getWordCount,
	isPalindrome,
} from "./utils/index.js";

const app = express();
app.use(express.json());

const { PORT } = env;

// In-memory database store
const mockDbStore = new Map();

// Get all strings and their properties, filters not yet implemented

app.get("/strings", (req, res) => {
	const {} = req.params;

	return res.status(200).json({
		data: Array.from(mockDbStore.values()),
		count: mockDbStore.size,
		filtersApplied: {},
	});
});

// Store a specific string and its properties

app.post("/strings", (req, res) => {
	const { value } = req.body;

	// Handle invalid of missing request body or field "value"
	if (!value) {
		return res.status(400).json({ error: "Missing required field: value" });
	}

	// Handle invalid "value" format
	if (typeof value !== "string") {
		return res.status(422).json({ error: "'value' must be a string" });
	}

	// We get the string data from our in-memory db by its encryption,
	// so we compare the hashes if it matches
	const hash = getSha256Encryption(value);

	// If string already exist in our in-memory db
	if (mockDbStore.has(hash)) {
		return res.status(409).json({ error: "String already exists" });
	}

	// Get the response format
	const analyzedString = {
		id: hash,
		value,
		properties: {
			length: value.length,
			is_palindrome: isPalindrome(value),
			unique_characters: getUniqueCharCount(value),
			word_count: getWordCount(value),
			sha256_hash: hash,
			character_frequency_map: getCharacterFrequencyMap(value),
		},
		createdAt: new Date().toISOString(),
	};

	// Store the string in our in-memory db
	mockDbStore.set(hash, analyzedString);
	res.status(201).json(analyzedString);
});

app.get("/strings/:string_value", (req, res) => {
	const param = req.params.string_value;

	// Check in case of invalid paramters
	if (typeof param !== "string") {
		return res.status(422).json({ error: `Invalid param ${param}: it must be a string` });
	}

	// decode our string param, hash it and lookup our string on the db if it exists
	const stringValue = decodeURIComponent(param);
	const hash = getSha256Encryption(stringValue);
	const stringData = mockDbStore.get(hash);

	// Handle cases whereby the string might not exist or deleted
	if (!stringData) {
		return res.status(400).json({ error: "string not found or deleted" });
	}

	res.status(200).json(stringData);
});

// Get strings by natural language

app.get("/strings/filter-by-natural-language", (req, res) => {
	const { query } = req.params;

	res.status(200).json({
		data: [],
		count: 0,
		interpreted_query: {
			original: query,
			parsed_filters: {
				word_count: 0,
				is_palindrome: true,
			},
		},
	});
});

// Handle invalid routes (404)
app.use((_req, res) => {
	res.status(404).json({
		status: "error",
		message: "Route not found",
	});
});

// Error handling middleware
app.use((err, _req, res, _next) => {
	console.error(err);
	res.status(500).json({
		status: "error",
		message: "Internal Server Error",
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
