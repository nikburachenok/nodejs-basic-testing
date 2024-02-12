import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(simpleCalculator({ a: 5, b: 1, action: Action.Add })).toBe(6);
    expect(simpleCalculator({ a: 5, b: 1, action: '+' })).toBe(6);
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a: 10, b: 3, action: Action.Subtract })).toBe(7);
    expect(simpleCalculator({ a: 10, b: 3, action: '-' })).toBe(7);
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a: 3, b: 6, action: Action.Multiply })).toBe(18);
    expect(simpleCalculator({ a: 3, b: 6, action: '*' })).toBe(18);
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a: 32, b: 8, action: Action.Divide })).toBe(4);
    expect(simpleCalculator({ a: 32, b: 8, action: '/' })).toBe(4);
    expect(simpleCalculator({ a: 32, b: 0, action: '/' })).toBe(Infinity);
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a: 3, b: 2, action: Action.Exponentiate })).toBe(
      9,
    );
    expect(simpleCalculator({ a: 3, b: 2, action: '^' })).toBe(9);
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 3, b: 2, action: 1 })).toBeNull();
    expect(simpleCalculator({ a: 3, b: 2, action: 'a' })).toBeNull();
    expect(simpleCalculator({ a: 3, b: 2, action: null })).toBeNull();
    expect(simpleCalculator({ a: 3, b: 2, action: '/*' })).toBeNull();
    expect(
      simpleCalculator({ a: 3, b: 2, action: { operator: '*' } }),
    ).toBeNull();
    expect(simpleCalculator({ a: 3, b: 2, action: ['*'] })).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    expect(
      simpleCalculator({ a: 'a', b: 2, action: Action.Exponentiate }),
    ).toBeNull();
    expect(
      simpleCalculator({ a: 3, b: 'b', action: Action.Exponentiate }),
    ).toBeNull();
    expect(
      simpleCalculator({ a: 'a', b: 'b', action: Action.Exponentiate }),
    ).toBeNull();
  });
});
