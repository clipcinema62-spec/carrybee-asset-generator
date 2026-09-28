import { CarryBeeFormData } from '../types/form';

/**
 * Generates an editable Microsoft Word document (.doc format with Word XML/HTML schema)
 * Compatible with Microsoft Word, LibreOffice, and Google Docs.
 */
export const downloadWordDocument = (data: CarryBeeFormData) => {
  const fileName = `CarryBee_Asset_Form_${(data.company.date || 'doc').replace(/\//g, '-')}.doc`;

  // Standard Asset Rows
  const standardRowsHtml = data.showStandardTable && data.standardItems.length > 0
    ? data.standardItems.map((item, idx) => {
        return `
          <tr style="mso-yfti-irow:${idx + 1};">
            <td style="border:1pt solid windowtext;padding:4pt;text-align:center;font-size:10pt;">${item.sl ?? idx + 1}</td>
            <td style="border:1pt solid windowtext;padding:4pt;text-align:left;font-size:10pt;font-weight:bold;">${escapeHtml(String(item.assetName || ''))}</td>
            <td style="border:1pt solid windowtext;padding:4pt;text-align:center;font-size:10pt;">${escapeHtml(String(item.qty || '1'))}</td>
            <td style="border:1pt solid windowtext;padding:4pt;text-align:center;font-size:10pt;">${escapeHtml(String(item.tagNo || ''))}</td>
            <td style="border:1pt solid windowtext;padding:4pt;text-align:left;font-size:9.5pt;white-space:pre-wrap;">${escapeHtml(String(item.remarks || '')).replace(/\n/g, '<br/>')}</td>
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
      <th style="border:1pt solid windowtext;background-color:${headerBg};color:${headerColor};padding:4pt;text-align:${col.align || 'left'};font-size:10pt;font-weight:bold;">
        ${escapeHtml(col.label)}
      </th>
    `).join('');

    const rowsHtml = sec.rows.map(row => `
      <tr>
        ${sec.columns.map(col => `
          <td style="border:1pt solid windowtext;padding:4pt;text-align:${col.align || 'left'};font-size:9.5pt;">
            ${escapeHtml(row.cells[col.id] || '')}
          </td>
        `).join('')}
      </tr>
    `).join('');

    return `
      <div style="margin-top:12pt;margin-bottom:10pt;">
        ${sec.mailSubject ? `<p style="font-size:10.5pt;font-style:italic;margin:2pt 0;font-weight:bold;">${escapeHtml(sec.mailSubject)}</p>` : ''}
        ${sec.sectionTitle ? `<p style="font-size:11pt;font-weight:bold;margin:2pt 0 4pt 0;">${escapeHtml(sec.sectionTitle)}</p>` : ''}
        <table style="width:100%;border-collapse:collapse;border:1pt solid windowtext;margin-top:4pt;">
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
          margin: 36.0pt 36.0pt 36.0pt 36.0pt;
          mso-header-margin: 35.4pt;
          mso-footer-margin: 35.4pt;
          mso-paper-source: 0;
        }
        div.Section1 {
          page: Section1;
        }
        body {
          font-family: Arial, Calibri, sans-serif;
          font-size: 11pt;
          color: #000000;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        p {
          margin: 2pt 0;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <!-- Header -->
        <div style="text-align:center;margin-bottom:8pt;">
          <h1 style="font-size:20pt;font-weight:bold;margin:0 0 2pt 0;color:#000000;">
            ${escapeHtml(data.company.name)}
          </h1>
          <p style="font-size:10pt;color:#333333;margin:0;">${escapeHtml(data.company.address)}</p>
          <p style="font-size:10pt;font-style:italic;color:#333333;margin:0 0 6pt 0;">${escapeHtml(data.company.hotline)}</p>
          
          <div style="display:inline-block;background-color:#000000;color:#ffffff;padding:3pt 16pt;font-weight:bold;font-size:12pt;letter-spacing:1pt;">
            ${escapeHtml(data.company.formTitle)}
          </div>
          <p style="font-size:10.5pt;margin-top:4pt;color:#000000;">${escapeHtml(data.company.department)}</p>
        </div>

        <!-- Date -->
        <table style="width:100%;border:none;margin-bottom:4pt;">
          <tr>
            <td style="border:none;text-align:right;font-size:11pt;font-weight:bold;">
              Date: <span style="font-weight:normal;">${escapeHtml(data.company.date)}</span>
            </td>
          </tr>
        </table>

        <!-- From / To Box -->
        <table style="width:100%;border:1pt dashed #666666;border-collapse:collapse;margin-bottom:12pt;">
          <tr>
            <td style="width:50%;border-right:1pt dashed #666666;padding:6pt;vertical-align:top;font-size:10.5pt;">
              <b>From,</b><br/>
              <b>${escapeHtml(data.parties.fromBranch)}</b><br/>
              Name: ${escapeHtml(data.parties.fromName)}<br/>
              Mobile No: ${escapeHtml(data.parties.fromMobile)}
            </td>
            <td style="width:50%;padding:6pt;vertical-align:top;font-size:10.5pt;">
              <b>To,</b><br/>
              <b>${escapeHtml(data.parties.toBranch)}</b><br/>
              Name: ${escapeHtml(data.parties.toName)}<br/>
              Mobile No: ${escapeHtml(data.parties.toMobile)}
            </td>
          </tr>
        </table>

        <!-- Standard Table -->
        ${data.showStandardTable && data.standardItems.length > 0 ? `
          <table style="width:100%;border-collapse:collapse;border:1pt solid windowtext;margin-bottom:12pt;">
            <thead>
              <tr style="background-color:#ffff00;">
                <th style="border:1pt solid windowtext;padding:5pt;text-align:center;font-size:10pt;font-weight:bold;width:35pt;">SL</th>
                <th style="border:1pt solid windowtext;padding:5pt;text-align:center;font-size:10pt;font-weight:bold;">Asset Name</th>
                <th style="border:1pt solid windowtext;padding:5pt;text-align:center;font-size:10pt;font-weight:bold;width:40pt;">QTY</th>
                <th style="border:1pt solid windowtext;padding:5pt;text-align:center;font-size:10pt;font-weight:bold;width:80pt;">Tag No</th>
                <th style="border:1pt solid windowtext;padding:5pt;text-align:center;font-size:10pt;font-weight:bold;">Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${standardRowsHtml}
            </tbody>
          </table>
        ` : ''}

        <!-- Custom Sub-Tables -->
        ${customSectionsHtml}

        <!-- Signatures Area -->
        <table style="width:100%;border:none;margin-top:40pt;page-break-inside:avoid;">
          <tr>
            <td style="width:50%;border:none;text-align:left;vertical-align:bottom;">
              <div style="width:160pt;border-top:1.5pt solid #000000;text-align:center;padding-top:4pt;">
                <b>Sender Signature & Date</b>
              </div>
            </td>
            <td style="width:50%;border:none;text-align:right;vertical-align:bottom;">
              <div style="width:160pt;border-top:1.5pt solid #000000;text-align:center;padding-top:4pt;margin-left:auto;">
                <b>Receiver Signature & Date</b>
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
