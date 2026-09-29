import { CarryBeeFormData } from '../types/form';
import { formatRemarksHtml } from './formatRemarks';

/**
 * Generates an editable Microsoft Word document (.doc format with Word XML/HTML schema)
 * Compatible with Microsoft Word, LibreOffice, and Google Docs.
 * Designed with compact box spacing to perfectly adjust content inside tables.
 */
export const downloadWordDocument = (data: CarryBeeFormData) => {
  const fileName = `CarryBee_Asset_Form_${(data.company.date || 'doc').replace(/\//g, '-')}.doc`;

  // Standard Asset Rows
  const standardRowsHtml = data.showStandardTable && data.standardItems.length > 0
    ? data.standardItems.map((item, idx) => {
        const formattedRemarks = formatRemarksHtml(escapeHtml(String(item.remarks || '')));
        return `
          <tr style="mso-yfti-irow:${idx + 1};">
            <td style="border:1pt solid windowtext;padding:3pt 4pt;text-align:center;font-size:9.5pt;vertical-align:top;">${item.sl ?? idx + 1}</td>
            <td style="border:1pt solid windowtext;padding:3pt 4pt;text-align:left;font-size:9.5pt;font-weight:bold;vertical-align:top;">${escapeHtml(String(item.assetName || ''))}</td>
            <td style="border:1pt solid windowtext;padding:3pt 4pt;text-align:center;font-size:9.5pt;vertical-align:top;">${escapeHtml(String(item.qty || '1'))}</td>
            <td style="border:1pt solid windowtext;padding:3pt 4pt;text-align:center;font-size:9.5pt;vertical-align:top;">${escapeHtml(String(item.tagNo || ''))}</td>
            <td style="border:1pt solid windowtext;padding:3pt 4pt;text-align:left;font-size:9pt;line-height:1.2;vertical-align:top;">${formattedRemarks}</td>
          </tr>
        `;
      }).join('')
    : '';

  // Custom Sections Tables
  const customSectionsHtml = data.customSections.map((sec) => {
    let headerBg = '#ffffff';
    let headerColor = '#000000';
    if (sec.headerTheme === 'yellow') {
      headerBg = '#ffff00';
    } else if (sec.headerTheme === 'green') {
      headerBg = '#00e600';
    } else if (sec.headerTheme === 'blue') {
      headerBg = '#b8cce4';
    } else if (sec.headerTheme === 'gray') {
      headerBg = '#e2e8f0';
    }

    const colsHtml = sec.columns.map(col => `
      <th style="border:1pt solid windowtext;background-color:${headerBg};color:${headerColor};padding:3pt 4pt;text-align:${col.align || 'left'};font-size:9.5pt;font-weight:bold;">
        ${escapeHtml(col.label)}
      </th>
    `).join('');

    const rowsHtml = sec.rows.map(row => `
      <tr>
        ${sec.columns.map(col => `
          <td style="border:1pt solid windowtext;padding:3pt 4pt;text-align:${col.align || 'left'};font-size:9pt;vertical-align:top;">
            ${escapeHtml(row.cells[col.id] || '')}
          </td>
        `).join('')}
      </tr>
    `).join('');

    return `
      <div style="margin-top:8pt;margin-bottom:6pt;">
        ${sec.mailSubject ? `<p style="font-size:9.5pt;font-style:italic;margin:1pt 0;font-weight:bold;">${escapeHtml(sec.mailSubject)}</p>` : ''}
        ${sec.sectionTitle ? `<p style="font-size:10pt;font-weight:bold;margin:1pt 0 3pt 0;">${escapeHtml(sec.sectionTitle)}</p>` : ''}
        <table style="width:100%;border-collapse:collapse;border:1pt solid windowtext;margin-top:2pt;">
          <thead>
            <tr>${colsHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${escapeHtml(data.company.formTitle)}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: 595.3pt 841.9pt; /* A4 */
          margin: 28.0pt 28.0pt 28.0pt 28.0pt;
          mso-header-margin: 20.0pt;
          mso-footer-margin: 20.0pt;
          mso-paper-source: 0;
        }
        div.Section1 {
          page: Section1;
        }
        body {
          font-family: Arial, "Helvetica Neue", Calibri, sans-serif;
          font-size: 10pt;
          color: #000000;
          line-height: 1.15;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          table-layout: auto;
        }
        td, th {
          word-break: break-word;
          overflow-wrap: break-word;
        }
        p {
          margin: 1.5pt 0;
        }
        b {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <!-- Header -->
        <div style="text-align:center;margin-bottom:6pt;">
          <h1 style="font-size:18pt;font-weight:bold;margin:0 0 1pt 0;color:#000000;letter-spacing:-0.5pt;">
            ${escapeHtml(data.company.name)}
          </h1>
          <p style="font-size:9.5pt;color:#222222;margin:0;">${escapeHtml(data.company.address)}</p>
          <p style="font-size:9.5pt;font-style:italic;color:#222222;margin:0 0 4pt 0;">${escapeHtml(data.company.hotline)}</p>
          
          <div style="display:inline-block;background-color:#000000;color:#ffffff;padding:2.5pt 14pt;font-weight:bold;font-size:11.5pt;letter-spacing:0.8pt;">
            ${escapeHtml(data.company.formTitle)}
          </div>
          <p style="font-size:10pt;margin-top:3pt;color:#000000;">${escapeHtml(data.company.department)}</p>
        </div>

        <!-- Date -->
        <table style="width:100%;border:none;margin-bottom:3pt;">
          <tr>
            <td style="border:none;text-align:right;font-size:10pt;font-weight:bold;">
              Date: <span style="font-weight:bold;">${escapeHtml(data.company.date)}</span>
            </td>
          </tr>
        </table>

        <!-- From / To Box (Compact & clear) -->
        <table style="width:100%;border:1pt dashed #555555;border-collapse:collapse;margin-bottom:8pt;">
          <tr>
            <td style="width:50%;border-right:1pt dashed #555555;padding:4pt 6pt;vertical-align:top;font-size:10pt;line-height:1.2;">
              <b>From,</b><br/>
              <b>${escapeHtml(data.parties.fromBranch)}</b><br/>
              Name: <b>${escapeHtml(data.parties.fromName)}</b><br/>
              Mobile No: <b>${escapeHtml(data.parties.fromMobile)}</b>
            </td>
            <td style="width:50%;padding:4pt 6pt;vertical-align:top;font-size:10pt;line-height:1.2;">
              <b>To,</b><br/>
              <b>${escapeHtml(data.parties.toBranch)}</b><br/>
              Name: <b>${escapeHtml(data.parties.toName)}</b><br/>
              Mobile No: <b>${escapeHtml(data.parties.toMobile)}</b>
            </td>
          </tr>
        </table>

        <!-- Standard Table -->
        ${data.showStandardTable && data.standardItems.length > 0 ? `
          <table style="width:100%;border-collapse:collapse;border:1pt solid windowtext;margin-bottom:8pt;">
            <thead>
              <tr style="background-color:#ffff00;">
                <th style="border:1pt solid windowtext;padding:4pt 2pt;text-align:center;font-size:9.5pt;font-weight:bold;width:30pt;">SL</th>
                <th style="border:1pt solid windowtext;padding:4pt 3pt;text-align:center;font-size:9.5pt;font-weight:bold;width:110pt;">Asset Name</th>
                <th style="border:1pt solid windowtext;padding:4pt 2pt;text-align:center;font-size:9.5pt;font-weight:bold;width:32pt;">QTY</th>
                <th style="border:1pt solid windowtext;padding:4pt 3pt;text-align:center;font-size:9.5pt;font-weight:bold;width:70pt;">Tag No</th>
                <th style="border:1pt solid windowtext;padding:4pt 4pt;text-align:center;font-size:9.5pt;font-weight:bold;">Hub/Attention Person/Mail/Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${standardRowsHtml}
            </tbody>
          </table>
        ` : ''}

        <!-- Custom Sub-Tables -->
        ${customSectionsHtml}

        <!-- Signatures Area (Compact & Avoids Page Break) -->
        <table style="width:100%;border:none;margin-top:28pt;page-break-inside:avoid;">
          <tr>
            <td style="width:33%;border:none;text-align:center;vertical-align:bottom;padding:0 5pt;">
              <div style="border-top:1.5pt solid #000000;text-align:center;padding-top:3pt;">
                <b>${escapeHtml(data.signatures.preparedByLabel || 'Prepared By')}</b>
              </div>
            </td>
            <td style="width:33%;border:none;text-align:center;vertical-align:bottom;padding:0 5pt;">
              <div style="border-top:1.5pt solid #000000;text-align:center;padding-top:3pt;">
                <b>${escapeHtml(data.signatures.authorizedByLabel || 'Authorized by')}</b>
              </div>
            </td>
            <td style="width:33%;border:none;text-align:center;vertical-align:bottom;padding:0 5pt;">
              <div style="border-top:1.5pt solid #000000;text-align:center;padding-top:3pt;">
                <b>${escapeHtml(data.signatures.receivedByLabel || 'Received by')}</b>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
