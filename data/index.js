// Mock data for testing my requests manually (includes palindromes, single characters, mutliple words)
export const mockData = [
	"a",
	"z",
  "abc",
	"madam",
	"racecar",
	"hello world",
	"javascript",
	"Anna",
	"never odd or even",
	"palindrome test",
	"zz top",
	"abracadabra",
	"no lemon no melon",
	"a man a plan a canal panama",
	"Zebra zone",
	"testing words",
	"rotator",
	"step on no pets",
];

// Populate in-memory store - for testing
// for (const value of mockData) {
// 	const hash = getSha256Encryption(value);

// 	const analyzedString = {
// 		id: hash,
// 		value,
// 		properties: {
// 			length: value.length,
// 			is_palindrome: isPalindrome(value),
// 			unique_characters: getUniqueCharCount(value),
// 			word_count: getWordCount(value),
// 			sha256_hash: hash,
// 			character_frequency_map: getCharacterFrequencyMap(value),
// 		},
// 		createdAt: new Date().toISOString(),
// 	};

// 	mockDbStore.set(hash, analyzedString);
// }

// Get all strings and their properties, filters not yet implemented
