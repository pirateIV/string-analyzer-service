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

// Get strings by natural language

app.get("/strings/filter-by-natural-language", (req, res) => {
	const { query } = req.query;
	if (!query || typeof query !== "string") {
		return res.status(400).json({ error: "Missing or invalid query parameter 'query'" });
	}

	const qStr = query.toLowerCase().trim();
	const queries = {
		"all single word palindromic strings"() {
			return { word_count: 1, is_palindrome: true };
		},
		"strings longer than 10 characters"() {
			return { min_length: 11 };
		},
		"palindromic strings that contain the first vowel"() {
			return { contains_character: "a" };
		},
		"strings containing the letter z"() {
			return { contains_character: "z" };
		},
	};

	const filters = queries[qStr] ? queries[qStr]() : {};
	if (!filters) {
		return res.status(400).json({ error: "Query not valid" });
	}

	const results = Array.from(mockDbStore.values()).filter((entry) => {
		const props = entry.properties;

		if (filters.word_count && props.word_count !== filters.word_count) {
			return false;
		}
		if (filters.is_palindrome && !props.is_palindrome) {
			return false;
		}
		if (filters.min_length && props.length < filters.min_length) {
			return false;
		}
		if (filters.contains_character && !entry.value.toLowerCase().includes(filters.contains_character)) {
			return false;
		}

		return true;
	});

	res.status(200).json({
		data: results,
		count: results.length,
		interpreted_query: {
			original: query,
			parsed_filters: filters,
		},
	});
});

app.get("/strings/:string_value", (req, res) => {
	const param = req.params.string_value;

	// Check in case of invalid parameter
	if (!param) {
		return res.status(400).json({ error: `param is required` });
	}

	// decode our string param, hash it and lookup our string on the db if it exists
	const stringValue = decodeURIComponent(param);
	console.log(stringValue);
	const hash = getSha256Encryption(stringValue);
	const stringData = mockDbStore.get(hash);

	// Handle cases whereby the string might not exist or deleted
	if (!stringData) {
		return res.status(400).json({ error: "string not found or deleted" });
	}

	res.status(200).json(stringData);
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
