import React from 'react';
import { CarryBeeFormData, CustomSection, StandardAssetItem } from '../types/form';

interface OfficialDocumentViewProps {
  data: CarryBeeFormData;
  onUpdate?: (updated: CarryBeeFormData) => void;
  interactive?: boolean;
}

export const OfficialDocumentView: React.FC<OfficialDocumentViewProps> = ({
  data,
  onUpdate,
  interactive = false,
}) => {
  const getHeaderThemeClass = (theme: CustomSection['headerTheme']) => {
    switch (theme) {
      case 'yellow':
        return 'bg-[#ffff00] text-black';
      case 'green':
        return 'bg-[#00e600] text-black font-semibold';
      case 'blue':
        return 'bg-[#b8cce4] text-blue-950 font-semibold';
      case 'gray':
        return 'bg-slate-200 text-black';
      case 'white':
      default:
        return 'bg-white text-black font-bold';
    }
  };

  const handleTextChange = (path: string, value: string) => {
    if (!onUpdate) return;
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    
    // Simple path updater
    if (path.startsWith('company.')) {
      const field = path.replace('company.', '') as keyof typeof cloned.company;
      cloned.company[field] = value;
    } else if (path.startsWith('parties.')) {
      const field = path.replace('parties.', '') as keyof typeof cloned.parties;
      cloned.parties[field] = value;
    }
    onUpdate(cloned);
  };

  const handleStandardItemChange = (index: number, field: keyof StandardAssetItem, value: string) => {
    if (!onUpdate) return;
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    if (cloned.standardItems[index]) {
      cloned.standardItems[index][field] = value as any;
      onUpdate(cloned);
    }
  };

  const handleCustomCellChange = (sectionIdx: number, rowIdx: number, colId: string, value: string) => {
    if (!onUpdate) return;
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    if (cloned.customSections[sectionIdx]?.rows[rowIdx]) {
      cloned.customSections[sectionIdx].rows[rowIdx].cells[colId] = value;
      onUpdate(cloned);
    }
  };

  return (
    <div className="document-container w-full bg-white text-black mx-auto p-6 md:p-10 shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-0 font-sans leading-tight min-h-[1100px] flex flex-col justify-between selection:bg-amber-100">
      <div>
        {/* Document Header */}
        <div className="text-center mb-2">
          <h1 
            contentEditable={interactive}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange('company.name', e.currentTarget.textContent || '')}
            className="text-[25px] md:text-[28px] font-bold tracking-tight text-black outline-none focus:bg-amber-50"
          >
            {data.company.name}
          </h1>
          <p 
            contentEditable={interactive}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange('company.address', e.currentTarget.textContent || '')}
            className="text-[12.5px] text-gray-800 outline-none focus:bg-amber-50"
          >
            {data.company.address}
          </p>
          <p 
            contentEditable={interactive}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange('company.hotline', e.currentTarget.textContent || '')}
            className="text-[12.5px] italic text-gray-800 outline-none focus:bg-amber-50"
          >
            {data.company.hotline}
          </p>

          {/* Black Form Badge */}
          <div className="inline-block mt-1">
            <span 
              contentEditable={interactive}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('company.formTitle', e.currentTarget.textContent || '')}
              className="bg-black text-white px-4 py-0.5 text-[14px] md:text-[15px] font-bold tracking-wide uppercase inline-block outline-none"
            >
              {data.company.formTitle}
            </span>
          </div>

          <p 
            contentEditable={interactive}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange('company.department', e.currentTarget.textContent || '')}
            className="text-[13px] font-normal text-gray-900 mt-0.5 outline-none focus:bg-amber-50"
          >
            {data.company.department}
          </p>
        </div>

        {/* Date Row */}
        <div className="flex justify-end items-center mb-1 text-[13px]">
          <span className="font-bold mr-1">Date:</span>
          <span 
            contentEditable={interactive}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange('company.date', e.currentTarget.textContent || '')}
            className="font-medium outline-none focus:bg-amber-50 min-w-[70px] text-right"
          >
            {data.company.date}
          </span>
        </div>

        {/* From / To Dotted Box */}
        <div className="border border-dashed border-gray-500 grid grid-cols-2 text-[12px] md:text-[12.5px] mb-3">
          {/* From Column */}
          <div className="p-1.5 border-r border-dashed border-gray-500 leading-snug">
            <div className="font-bold text-[13px]">From,</div>
            <div 
              contentEditable={interactive}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('parties.fromBranch', e.currentTarget.textContent || '')}
              className="outline-none focus:bg-amber-50"
            >
              {data.parties.fromBranch}
            </div>
            <div className="flex">
              <span className="shrink-0 mr-1">Name:</span>
              <span 
                contentEditable={interactive}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('parties.fromName', e.currentTarget.textContent || '')}
                className="outline-none focus:bg-amber-50 grow"
              >
                {data.parties.fromName}
              </span>
            </div>
            <div className="flex">
              <span className="shrink-0 mr-1">Mobile No:</span>
              <span 
                contentEditable={interactive}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('parties.fromMobile', e.currentTarget.textContent || '')}
                className="outline-none focus:bg-amber-50 grow"
              >
                {data.parties.fromMobile}
              </span>
            </div>
          </div>

          {/* To Column */}
          <div className="p-1.5 leading-snug">
            <div className="font-bold text-[13px]">To,</div>
            <div 
              contentEditable={interactive}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('parties.toBranch', e.currentTarget.textContent || '')}
              className="outline-none focus:bg-amber-50"
            >
              {data.parties.toBranch}
            </div>
            <div className="flex">
              <span className="shrink-0 mr-1">Name:</span>
              <span 
                contentEditable={interactive}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('parties.toName', e.currentTarget.textContent || '')}
                className="outline-none focus:bg-amber-50 grow"
              >
                {data.parties.toName}
              </span>
            </div>
            <div className="flex">
              <span className="shrink-0 mr-1">Mobile No:</span>
              <span 
                contentEditable={interactive}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('parties.toMobile', e.currentTarget.textContent || '')}
                className="outline-none focus:bg-amber-50 grow"
              >
                {data.parties.toMobile}
              </span>
            </div>
          </div>
        </div>

        {/* Standard Assets Table (if enabled) */}
        {data.showStandardTable && data.standardItems.length > 0 && (
          <div className="mb-4">
            <table className="w-full border-collapse border border-black text-[11px] md:text-[11.5px]">
              <thead>
                <tr className="bg-white">
                  {data.standardColumns.map((col) => (
                    <th
                      key={col.id}
                      style={{ width: col.width }}
                      className={`border border-black px-1.5 py-1 font-bold text-${col.align || 'center'}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.standardItems.map((item, rowIdx) => (
                  <tr key={item.id || rowIdx} className="hover:bg-amber-50/20">
                    {data.standardColumns.map((col) => {
                      const value = (item as any)[col.key] || item.customValues?.[col.key] || '';
                      const isRemarks = col.key === 'remarks';

                      return (
                        <td
                          key={col.id}
                          className={`border border-black px-1.5 py-1 align-top text-${col.align || 'left'} ${
                            col.key === 'sl' ? 'font-medium' : ''
                          }`}
                        >
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleStandardItemChange(
                                rowIdx,
                                col.key as keyof StandardAssetItem,
                                e.currentTarget.innerText
                              )
                            }
                            className="outline-none min-h-[16px] whitespace-pre-wrap hover:bg-amber-50 focus:bg-amber-100/70 px-0.5 rounded cursor-text"
                            title="Click to edit cell directly"
                          >
                            {value}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dynamic Custom Sections (Requisitions, Mobile Scanners, Laptop Bags, etc.) */}
        {data.customSections.map((section, secIdx) => (
          <div key={section.id || secIdx} className="mb-3.5 print-avoid-break">
            {/* Mail Subject line if exists */}
            {section.mailSubject && (
              <div
                contentEditable={interactive}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!onUpdate) return;
                  const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
                  cloned.customSections[secIdx].mailSubject = e.currentTarget.textContent || '';
                  onUpdate(cloned);
                }}
                className="italic text-[12px] text-gray-800 mb-0.5 outline-none focus:bg-amber-50"
              >
                {section.mailSubject}
              </div>
            )}

            {/* Section Bold Title */}
            {section.sectionTitle && (
              <div
                contentEditable={interactive}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!onUpdate) return;
                  const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
                  cloned.customSections[secIdx].sectionTitle = e.currentTarget.textContent || '';
                  onUpdate(cloned);
                }}
                className="font-bold text-[13px] md:text-[13.5px] text-black mb-1 outline-none focus:bg-amber-50"
              >
                {section.sectionTitle}
              </div>
            )}

            {/* Sub-table with Colored Header */}
            <table className="w-full border-collapse border border-black text-[11px] md:text-[11.5px]">
              <thead>
                <tr className={getHeaderThemeClass(section.headerTheme)}>
                  {section.columns.map((col) => (
                    <th
                      key={col.id}
                      className={`border border-black px-1.5 py-1 text-${col.align || 'left'} text-[11.5px]`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, rowIdx) => (
                  <tr key={row.id || rowIdx} className="hover:bg-amber-50/20">
                    {section.columns.map((col) => {
                      const val = row.cells[col.id] || '';
                      return (
                        <td
                          key={col.id}
                          className={`border border-black px-1.5 py-1 align-middle text-${col.align || 'left'}`}
                        >
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              handleCustomCellChange(
                                secIdx,
                                rowIdx,
                                col.id,
                                e.currentTarget.innerText || ''
                              )
                            }
                            className="outline-none min-h-[16px] whitespace-pre-wrap hover:bg-amber-50 focus:bg-amber-100/70 px-0.5 rounded cursor-text"
                            title="Click to edit cell directly"
                          >
                            {val}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* P.T.O indicator if multi-page */}
        {data.hasPto && (
          <div className="text-right text-[12px] font-bold text-gray-800 pr-2 my-2">
            P.T.O
          </div>
        )}
      </div>

      {/* Signatures Footer */}
      <div className="mt-8 pt-4 print-avoid-break">
        <div className="grid grid-cols-3 text-center text-[12px] md:text-[12.5px]">
          <div>
            <div className="w-36 md:w-44 border-b border-black mx-auto mb-1"></div>
            <div className="font-semibold text-gray-900">{data.signatures.preparedByLabel}</div>
            {data.signatures.preparedByName && (
              <div className="text-[11px] text-gray-600 mt-0.5">{data.signatures.preparedByName}</div>
            )}
          </div>
          <div>
            <div className="w-36 md:w-44 border-b border-black mx-auto mb-1"></div>
            <div className="font-semibold text-gray-900">{data.signatures.authorizedByLabel}</div>
            {data.signatures.authorizedByName && (
              <div className="text-[11px] text-gray-600 mt-0.5">{data.signatures.authorizedByName}</div>
            )}
          </div>
          <div>
            <div className="w-36 md:w-44 border-b border-black mx-auto mb-1"></div>
            <div className="font-semibold text-gray-900">{data.signatures.receivedByLabel}</div>
            {data.signatures.receivedByName && (
              <div className="text-[11px] text-gray-600 mt-0.5">{data.signatures.receivedByName}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
