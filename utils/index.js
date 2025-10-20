import crypto from "crypto";

export function isPalindrome(value) {
	return Array.from(value).reverse().join("") === value;
}

export function getWordCount(str) {
	return str.split(" ").length;
}

export function getSha256Encryption(string) {
	return crypto.createHash("256").update(string).digest("hex");
}

export function getStringUniqueChars(string) {
	const uniqueElems = new Set();
	const stringArr = Array.from(string);
}
