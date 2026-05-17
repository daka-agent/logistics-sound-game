const fisherYatesShuffle = require('../src/utils/fisherYatesShuffle');

describe('Fisher-Yates Shuffle', () => {
  test('should return array with same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = fisherYatesShuffle(arr);
    expect(shuffled.length).toBe(arr.length);
  });

  test('should contain all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = fisherYatesShuffle(arr);
    arr.forEach(item => {
      expect(shuffled).toContain(item);
    });
  });

  test('should not modify original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    fisherYatesShuffle(arr);
    expect(arr).toEqual(original);
  });

  test('should handle empty array', () => {
    const shuffled = fisherYatesShuffle([]);
    expect(shuffled).toEqual([]);
  });

  test('should handle single element array', () => {
    const shuffled = fisherYatesShuffle([1]);
    expect(shuffled).toEqual([1]);
  });
});
