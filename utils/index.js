import crypto from "crypto";

export function isPalindrome(string) {
	const normalized = string.toLowerCase().replace(/\s+/g, "");
	return normalized === Array.from(normalized).reverse().join("");
}

export function getWordCount(str) {
	const trimmed = str.trim();
	return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function getSha256Encryption(string) {
	return crypto.createHash("sha256").update(string).digest("hex");
}

export function getUniqueCharCount(string) {
	return new Set(Array.from(string)).size;
}

export function getCharacterFrequencyMap(string) {
	const map = {};
	for (const char of Array.from(string)) {
		map[char] = (map[char] || 0) + 1;
	}
	return map;
}
