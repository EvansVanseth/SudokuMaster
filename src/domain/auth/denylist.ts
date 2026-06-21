
// Raw list of common passwords (subset for demonstration, to be expanded)
export const RAW_DENYLIST = [
  '12345678',
  'password',
  '123456789',
  '1234567890',
  'qwertyuiop',
  'Password123!', // Validates!
  'Admin123456!', // Validates!
  'Qwerty1234!', // Validates!
  '123123123',
  'Contraseña1',
  'Contraseña1!',
];

// Validation rules used to filter the denylist
const isValid = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
};

// Filter the denylist: remove passwords that already fail validation
export const getFilteredDenylist = (): Set<string> => {
  const filtered = RAW_DENYLIST.filter((p) => isValid(p));
  return new Set(filtered.map((p) => p.toLowerCase()));
};
