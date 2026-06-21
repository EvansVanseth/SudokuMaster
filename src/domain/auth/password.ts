
import { getFilteredDenylist } from './denylist';

const DENYLIST_SET = getFilteredDenylist();

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Mínimo 8 caracteres.';
  if (!/[A-Z]/.test(password)) return 'Debe incluir al menos una mayúscula.';
  if (!/[a-z]/.test(password)) return 'Debe incluir al menos una minúscula.';
  if (!/[0-9]/.test(password)) return 'Debe incluir al menos un número.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Debe incluir al menos un carácter especial.';
  if (DENYLIST_SET.has(password.toLowerCase())) return 'La contraseña es demasiado común.';
  return null;
};
