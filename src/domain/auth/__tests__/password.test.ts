
import { validatePassword } from '../password';

describe('validatePassword', () => {
  it('should return null for a valid password', () => {
    expect(validatePassword('Abc1234!')).toBeNull();
  });

  it('should return error for short password', () => {
    expect(validatePassword('Abc1!')).toBe('Mínimo 8 caracteres.');
  });

  it('should return error if no uppercase', () => {
    expect(validatePassword('abc1234!')).toBe('Debe incluir al menos una mayúscula.');
  });

  it('should return error if no lowercase', () => {
    expect(validatePassword('ABC1234!')).toBe('Debe incluir al menos una minúscula.');
  });

  it('should return error if no number', () => {
    expect(validatePassword('Abcdefgh!')).toBe('Debe incluir al menos un número.');
  });

  it('should return error if no special character', () => {
    expect(validatePassword('Abc12345')).toBe('Debe incluir al menos un carácter especial.');
  });

  it('should return error if in denylist', () => {
    expect(validatePassword('Password123!')).toBe('La contraseña es demasiado común.');
  });
});
