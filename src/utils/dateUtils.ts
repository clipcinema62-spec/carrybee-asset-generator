/**
 * Utility functions for handling formatted dates (DD/MM/YYYY)
 */

export function getCurrentDateFormatted(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Converts "DD/MM/YYYY" string to "YYYY-MM-DD" for standard HTML date input
 */
export function ddmmyyyyToIso(ddmmyyyy: string): string {
  if (!ddmmyyyy) return '';
  const parts = ddmmyyyy.trim().split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return '';
}

/**
 * Converts "YYYY-MM-DD" string from HTML date input to "DD/MM/YYYY"
 */
export function isoToDdmmyyyy(iso: string): string {
  if (!iso) return '';
  const parts = iso.trim().split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
  }
  return iso;
}
