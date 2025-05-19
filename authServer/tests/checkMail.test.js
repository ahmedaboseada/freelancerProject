const { checkMail } = require('../utils/checkMail');

describe('checkMail function', () => {
  test('should return DELIVERABLE for valid email format', async () => {
    const result = await checkMail('test@example.com');
    expect(result).toBe('DELIVERABLE');
  });

  test('should return UNDELIVERABLE for invalid email format', async () => {
    const result = await checkMail('invalid-email');
    expect(result).toBe('UNDELIVERABLE');
  });

  test('should return UNDELIVERABLE for email without domain', async () => {
    const result = await checkMail('test@');
    expect(result).toBe('UNDELIVERABLE');
  });

  test('should return UNDELIVERABLE for email with invalid TLD', async () => {
    const result = await checkMail('test@example.c');
    expect(result).toBe('UNDELIVERABLE');
  });
});