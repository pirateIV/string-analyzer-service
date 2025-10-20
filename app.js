import express from "express";

import { env } from "./config/env.js";
import {
	getCharacterFrequencyMap,
	getSha256Encryption,
	getStringUniqueChars,
	getWordCount,
	isPalindrome,
} from "./utils/index.js";

const app = express();

const mockAnalyzerDB = new Map();

const { PORT } = env;

app.get("/strings", (req, res) => {
	const {} = req.params;

	return res.status(200).json({
		data: [],
		count: mockAnalyzerDB.length,
		filtersApplied: {},
	});
});

app.post("/strings", (req, res) => {
	const string = req.body.value;

	if (mockAnalyzerDB.has(string)) {
		return res.status(400).json({});
	}

	const analyzedString = {
		id: getSha256Encryption(string),
		value: string,
		properties: {
			length: string.length,
			uniqueCharacters: getStringUniqueChars().length,
			is_palindrome: isPalindrome(string),
			word_count: getWordCount(string),
			sha256_hash: getSha256Encryption(string),
			character_frequency_map: getCharacterFrequencyMap(string),
		},
		createdAt: new Date().toISOString(),
	};

	res.status(201).json(analyzedString);
});

app.get("/strings/:string", (req, res) => {
	const { string } = req.query;

	const stringData = mockAnalyzerDB.get(string);

	if (!stringData) {
	}
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
