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

app.get("/strings", (req, res) => {
	const {} = req.params;

	return res.status(200).json({
		data: Array.from(mockDbStore.values()),
		count: mockDbStore.size,
		filtersApplied: {},
	});
});

app.post("/strings", (req, res) => {
	const { value } = req.body;

	if (!value) {
		return res.status(400).json({ error: "Missing required field: value" });
	}

	if (typeof value !== "string") {
		return res.status(422).json({ error: "'value' must be a string" });
	}

	const hash = getSha256Encryption(value);
	if (mockDbStore.has(hash)) {
		return res.status(409).json({ error: "String already exists" });
	}

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

	mockDbStore.set(hash, analyzedString);
	res.status(201).json(analyzedString);
});

app.get("/strings/:string_value", (req, res) => {
	const param = req.params.string_value;

	if (typeof param !== "string") {
		return res.status(422).json({ error: `Invalid param ${param}: it must be a string` });
	}

	const stringValue = decodeURIComponent(param);
	const hash = getSha256Encryption(stringValue);
	const stringData = mockDbStore.get(hash);

	if (!stringData) {
		return res.status(400).json({ error: "string not found or deleted" });
	}

	res.status(200).json(stringData);
});

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
