import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('failing test', () => {
	it('fails', () => {
		expect(1).toBe(2);
	});
});
