/** `Ahmet Yılmaz` → `A*** YILMAZ`, as the public participant lists show names. */
export function maskName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const surname = parts.pop() ?? '';
  const given = parts.map(part => `${part.charAt(0).toLocaleUpperCase('tr-TR')}***`).join(' ');
  return `${given} ${surname.toLocaleUpperCase('tr-TR')}`.trim();
}

/** Turkish-aware uppercase for the condensed labels. */
export const upper = (value: string) => value.toLocaleUpperCase('tr-TR');

/** Validates the Turkish identity number checksum. */
export function isValidTckn(value: string): boolean {
  if (!/^[1-9]\d{10}$/.test(value)) return false;
  const digits = value.split('').map(Number);
  const odd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const even = digits[1] + digits[3] + digits[5] + digits[7];
  const tenth = (odd * 7 - even) % 10;
  const eleventh = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10;
  return tenth === digits[9] && eleventh === digits[10];
}

export const isExternalUrl = (url: string) => /^(https?:)?\/\//.test(url) || /^(mailto|tel):/.test(url);
