import express from "express";
import { env } from "./config/env.js";
import { getSha256Encryption, getWordCount, isPalindrome } from "./utils/index.js";

const app = express();

const mockAnalyzerDB = new Map();

const { PORT } = env;

app.post("/", (req, res) => {
	const string = req.body.value;

	const analyzedString = {
		properties: {
			length: string.length,
      uniqueCharacters: 7,
			is_palindrome: isPalindrome(string),
			word_count: getWordCount(string),
			sha256_hash: getSha256Encryption(string),
		},
	};

	if (!mockAnalyzerDB.has(string)) {
		mockAnalyzerDB.set("string", analyzedString);
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
