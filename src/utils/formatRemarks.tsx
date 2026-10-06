import React from 'react';

/**
 * Parses markdown **bold** syntax and predefined patterns like:
 * - **bold text**
 * - "Remarks:" or "Remarks -"
 * - "Mail:" or "Mail -"
 * - Hub / Location names e.g. "Mohakhali (Hub Incharge)"
 * - "Attention:" or "Ref:"
 * Returns HTML string compatible with Microsoft Word export and standard DOM.
 */
export function formatRemarksHtml(text: string): string {
  if (!text) return '';

  const lines = text.split('\n');
  const formattedLines = lines.map((line) => {
    let trimmed = line.trim();
    if (!trimmed) return '';

    // Convert Markdown **bold** to <b>bold</b>
    trimmed = trimmed.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // If line has "Remarks:" or "Remarks -"
    trimmed = trimmed.replace(/^(Remarks\s*[:\-–])\s*(.*)$/i, '<b>$1</b> $2');

    // If line has "Mail:" or "Mail -"
    trimmed = trimmed.replace(/^(Mail\s*[:\-–])\s*(.*)$/i, '<b>$1</b> $2');

    // If line starts with "Attention:" or "Ref:"
    trimmed = trimmed.replace(/^(Attention\s*[:\-–]|Ref\s*[:\-–])\s*(.*)$/i, '<b>$1</b> $2');

    // If line has "(Hub Incharge)" or "(Hub In-charge)"
    if (/\(Hub\s*In-?charge\)/i.test(trimmed) && !trimmed.includes('<b>')) {
      trimmed = trimmed.replace(/^([^\(]+)(\(Hub\s*In-?charge\))(.*)$/i, '<b>$1$2</b>$3');
    }

    return trimmed;
  });

  return formattedLines.join('<br/>');
}

/**
 * Helper to render inline string with **bold** markers
 */
function renderInlineWithBold(text: string): React.ReactNode {
  if (!text.includes('**')) {
    return text;
  }

  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);
          return (
            <strong key={index} className="font-bold text-black">
              {content}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

/**
 * React Component to render parsed remarks with bold keywords and manual **bold** markup
 */
export const FormattedRemarks: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-0.5 leading-snug">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Explicit markdown bold in the line
        if (trimmed.includes('**')) {
          return (
            <div key={idx} className="text-slate-800">
              {renderInlineWithBold(trimmed)}
            </div>
          );
        }

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
