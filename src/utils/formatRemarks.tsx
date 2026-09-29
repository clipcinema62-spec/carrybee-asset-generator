import React from 'react';

/**
 * Parses remarks text and bolds keywords like:
 * - "Remarks:"
 * - "Mail:"
 * - Location / Hub names (e.g., Mohakhali, Kalabagan, etc. or lines ending with (Hub Incharge))
 * - Custom prefixes like "Attention:", "Ref:"
 */
export function formatRemarksHtml(text: string): string {
  if (!text) return '';

  const lines = text.split('\n');
  const formattedLines = lines.map((line) => {
    let trimmed = line.trim();
    if (!trimmed) return '';

    // If line has "Remarks:" or "Remarks -"
    trimmed = trimmed.replace(/^(Remarks\s*[:\-–])\s*(.*)$/i, '<b>$1</b> $2');

    // If line has "Mail:" or "Mail -"
    trimmed = trimmed.replace(/^(Mail\s*[:\-–])\s*(.*)$/i, '<b>$1</b> $2');

    // If line starts with "Attention:" or "Ref:"
    trimmed = trimmed.replace(/^(Attention\s*[:\-–]|Ref\s*[:\-–])\s*(.*)$/i, '<b>$1</b> $2');

    // If line has "(Hub Incharge)" or "(Hub In-charge)"
    if (/\(Hub\s*In-?charge\)/i.test(trimmed)) {
      // Bold the hub name and hub incharge or the whole hub prefix
      trimmed = trimmed.replace(/^([^\(]+)(\(Hub\s*In-?charge\))(.*)$/i, '<b>$1$2</b>$3');
    }

    return trimmed;
  });

  return formattedLines.join('<br/>');
}

/**
 * React Component to render parsed remarks with bold keywords
 */
export const FormattedRemarks: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-0.5 leading-snug">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Match "Remarks:" or "Remarks -"
        const remarksMatch = trimmed.match(/^(Remarks\s*[:\-–])\s*(.*)$/i);
        if (remarksMatch) {
          return (
            <div key={idx} className="text-slate-800">
              <span className="font-bold text-black">{remarksMatch[1]}</span>{' '}
              <span>{remarksMatch[2]}</span>
            </div>
          );
        }

        // Match "Mail:" or "Mail -"
        const mailMatch = trimmed.match(/^(Mail\s*[:\-–])\s*(.*)$/i);
        if (mailMatch) {
          return (
            <div key={idx} className="text-slate-800">
              <span className="font-bold text-black">{mailMatch[1]}</span>{' '}
              <span>{mailMatch[2]}</span>
            </div>
          );
        }

        // Match Hub incharge pattern, e.g. "Mohakhali (Hub Incharge)"
        const hubMatch = trimmed.match(/^([^\(]+)(\(Hub\s*In-?charge\))(.*)$/i);
        if (hubMatch) {
          return (
            <div key={idx} className="text-slate-900">
              <span className="font-bold text-black">
                {hubMatch[1].trim()} {hubMatch[2]}
              </span>
              {hubMatch[3] ? ` ${hubMatch[3]}` : ''}
            </div>
          );
        }

        // If line is just a Hub Name or starts with Hub:
        const hubPrefixMatch = trimmed.match(/^(Hub\s*[:\-–])\s*(.*)$/i);
        if (hubPrefixMatch) {
          return (
            <div key={idx} className="text-slate-800">
              <span className="font-bold text-black">{hubPrefixMatch[1]}</span>{' '}
              <span className="font-bold text-black">{hubPrefixMatch[2]}</span>
            </div>
          );
        }

        // Default line
        return <div key={idx} className="text-slate-800">{line}</div>;
      })}
    </div>
  );
};
