import crypto from "crypto";

export function isPalindrome(string) {
	return Array.from(string).reverse().join("") === string;
}

export function getWordCount(str) {
	return str.split(" ").length;
}

export function getSha256Encryption(string) {
	return crypto.createHash("256").update(string).digest("hex");
}

export function getStringUniqueChars(string) {
	return Array.from(string).filter((char, _i, arr) => arr.indexOf(char) === arr.lastIndexOf(char));
}

export function getCharacterFrequencyMap(string) {
	const map = new Map();
	const stringArr = Array.from(string);

	for (const char of stringArr) {
		map.set(char, (map.get(char) || 0) + 1);
	}

	// convert map to object
	return Object.fromEntries(map);
}
