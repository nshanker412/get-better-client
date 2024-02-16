import { timeAgo } from './timeAgo';

describe('timeAgo function', () => {
	const originalDateNow = Date.now;

	beforeEach(() => {
		global.Date.now = jest.fn(() => new Date().getTime());
	});

	afterEach(() => {
		global.Date.now = originalDateNow;
	});

	test('should return a string indicating time ago', () => {
		// Mock the post time (30 minutes ago)
		const epoch = Math.floor((global.Date.now() - 30 * 60 * 1000) / 1000);
		// Call the timeAgo function with the mocked time
		const result = timeAgo(epoch);

		// Assert the result
		expect(result).toBe('30 minutes ago');
	});

	test('should return a string indicating seconds ago', () => {
		// Mock the post time (10 seconds ago)
		const epoch = Math.floor((global.Date.now() - 10 * 1000) / 1000);

		// Call the timeAgo function with the mocked time
		const result = timeAgo(epoch);

		// Assert the result
		expect(result).toBe('10 seconds ago');
	});

	test('should return a string indicating minutes ago', () => {
		// Mock the post time (2 minutes ago)
		const epoch = Math.floor((global.Date.now() - 2 * 60 * 1000) / 1000);

		// Call the timeAgo function with the mocked time
		const result = timeAgo(epoch);

		// Assert the result
		expect(result).toBe('2 minutes ago');
	});

	test('should return a string indicating hours ago', () => {
		// Mock the post time (3 hours ago)
		const epoch = Math.floor(
			(global.Date.now() - 3 * 60 * 60 * 1000) / 1000,
		);

		// Call the timeAgo function with the mocked time
		const result = timeAgo(epoch);

		// Assert the result
		expect(result).toBe('3 hours ago');
	});

	test('should return a string indicating days ago', () => {
		// Mock the post time (5 days ago)
		const epoch = Math.floor(
			(global.Date.now() - 5 * 24 * 60 * 60 * 1000) / 1000,
		);

		// Call the timeAgo function with the mocked time
		const result = timeAgo(epoch);

		// Assert the result
		expect(result).toBe('5 days ago');
	});
});
