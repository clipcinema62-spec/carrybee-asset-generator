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

/**
 * Formats a date string into DD-MM-YYYY format with dashes for filenames
 * Supports DD/MM/YYYY, YYYY-MM-DD, or DD-MM-YYYY
 */
export function getDashFormattedDate(dateStr?: string): string {
  if (!dateStr || !dateStr.trim()) {
    return getCurrentDateFormatted().replace(/\//g, '-');
  }

  const clean = dateStr.trim();

  // If already in DD-MM-YYYY or DD/MM/YYYY
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${day}-${month}-${year}`;
    }
  }

  if (clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.length === 3) {
      // Check if it's YYYY-MM-DD
      if (parts[0].length === 4) {
        const year = parts[0];
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        return `${day}-${month}-${year}`;
      }
      // If DD-MM-YYYY
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${day}-${month}-${year}`;
    }
  }

  return clean.replace(/[\/\s]/g, '-');
}

/**
 * Generates official document filename matching user specification:
 * "IT Asset Send-Received Form - DD-MM-YYYY"
 * Example: "IT Asset Send-Received Form - 01-10-2026.doc" / ".pdf"
 */
export function getDocumentFileName(dateStr?: string, extension?: string): string {
  const formattedDate = getDashFormattedDate(dateStr);
  const baseName = `IT Asset Send-Received Form - ${formattedDate}`;
  return extension ? `${baseName}.${extension.replace(/^\./, '')}` : baseName;
}
