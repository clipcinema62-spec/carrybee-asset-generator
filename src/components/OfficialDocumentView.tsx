import React from 'react';
import { CarryBeeFormData, CustomSection, StandardAssetItem } from '../types/form';
import { FormattedRemarks } from '../utils/formatRemarks';
import { ddmmyyyyToIso, isoToDdmmyyyy, getCurrentDateFormatted } from '../utils/dateUtils';
import { Calendar } from 'lucide-react';

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
  const dateInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleDateChange = (isoVal: string) => {
    if (!onUpdate) return;
    const formatted = isoToDdmmyyyy(isoVal);
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    cloned.company.date = formatted;
    onUpdate(cloned);
  };

  const currentDateDisplay = data.company.date || getCurrentDateFormatted();

  // If multi-page array exists and has pages, render each page
  const pages = (data.pages && data.pages.length > 0)
    ? data.pages
    : [
        {
          id: 'page-1',
          pageNumber: 1,
          showStandardTable: data.showStandardTable,
          standardItems: data.standardItems,
          customSections: data.customSections,
        },
      ];

  return (
    <div className="space-y-8 print:space-y-0">
      {pages.map((page, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const isLastPage = pageIdx === pages.length - 1;

        return (
          <div
            key={page.id || pageIdx}
            className={`document-container w-full bg-white text-black mx-auto p-5 sm:p-7 md:p-9 shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-0 font-sans leading-tight min-h-[1050px] flex flex-col justify-between selection:bg-amber-100 relative ${
              !isLastPage ? 'print-page-break' : ''
            }`}
          >
            {/* Top Content Zone */}
            <div className="flex-1">
              {/* Document Header (Always on Page 1, or compact header on subsequent pages) */}
              {isFirstPage ? (
                <div className="text-center mb-2">
                  <h1 
                    contentEditable={interactive}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange('company.name', e.currentTarget.textContent || '')}
                    className="text-[24px] md:text-[27px] font-bold tracking-tight text-black outline-none focus:bg-amber-50"
                  >
                    {data.company.name}
                  </h1>
                  <p 
                    contentEditable={interactive}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange('company.address', e.currentTarget.textContent || '')}
                    className="text-[12px] text-gray-800 outline-none focus:bg-amber-50"
                  >
                    {data.company.address}
                  </p>
                  <p 
                    contentEditable={interactive}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange('company.hotline', e.currentTarget.textContent || '')}
                    className="text-[12px] italic text-gray-800 outline-none focus:bg-amber-50"
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
                    className="text-[12.5px] font-normal text-gray-900 mt-0.5 outline-none focus:bg-amber-50"
                  >
                    {data.company.department}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between border-b border-black pb-1 mb-3 text-xs">
                  <span className="font-bold">{data.company.name} - {data.company.formTitle}</span>
                  <span className="font-semibold text-slate-600">Page {pageIdx + 1} of {pages.length}</span>
                </div>
              )}

              {/* Date Row (Interactive with Calendar icon & direct date picker) */}
              <div className="flex justify-end items-center mb-1 text-[12.5px]">
                <span className="font-bold mr-1 text-black">Date:</span>
                <div className="relative inline-flex items-center group">
                  <span 
                    contentEditable={interactive}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextChange('company.date', e.currentTarget.textContent || '')}
                    className="font-bold outline-none focus:bg-amber-50 min-w-[75px] text-right cursor-pointer group-hover:text-blue-700"
                    title="Click calendar icon to pick date"
                  >
                    {currentDateDisplay}
                  </span>
                  <button
                    type="button"
                    onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
                    className="ml-1 text-slate-400 hover:text-black no-print p-0.5"
                    title="Select date with calendar"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={ddmmyyyyToIso(currentDateDisplay)}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="absolute opacity-0 pointer-events-none w-0 h-0"
                  />
                </div>
              </div>

              {/* From / To Dotted Box (Page 1) */}
              {isFirstPage && (
                <div className="border border-dashed border-gray-600 grid grid-cols-2 text-[11.5px] md:text-[12px] mb-2.5">
                  {/* From Column */}
                  <div className="p-1.5 border-r border-dashed border-gray-600 leading-snug">
                    <div className="font-bold text-[12.5px]">From,</div>
                    <div 
                      contentEditable={interactive}
                      suppressContentEditableWarning
                      onBlur={(e) => handleTextChange('parties.fromBranch', e.currentTarget.textContent || '')}
                      className="font-bold outline-none focus:bg-amber-50"
                    >
                      {data.parties.fromBranch}
                    </div>
                    <div className="flex">
                      <span className="shrink-0 mr-1 font-semibold">Name:</span>
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
                      <span className="shrink-0 mr-1 font-semibold">Mobile No:</span>
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
                    <div className="font-bold text-[12.5px]">To,</div>
                    <div 
                      contentEditable={interactive}
                      suppressContentEditableWarning
                      onBlur={(e) => handleTextChange('parties.toBranch', e.currentTarget.textContent || '')}
                      className="font-bold outline-none focus:bg-amber-50"
                    >
                      {data.parties.toBranch}
                    </div>
                    <div className="flex">
                      <span className="shrink-0 mr-1 font-semibold">Name:</span>
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
                      <span className="shrink-0 mr-1 font-semibold">Mobile No:</span>
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
              )}

              {/* Standard Assets Table */}
              {page.showStandardTable && page.standardItems.length > 0 && (
                <div className="mb-3">
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
                      {page.standardItems.map((item, rowIdx) => (
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
                                {isRemarks && value && !interactive ? (
                                  <div className="min-h-[16px]">
                                    <FormattedRemarks text={String(value)} />
                                  </div>
                                ) : (
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
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Custom Sub-Tables */}
              {page.customSections.map((section, secIdx) => (
                <div key={section.id || secIdx} className="mb-3.5 print-avoid-break">
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
                      className="italic text-[12px] text-gray-800 mb-0.5 outline-none focus:bg-amber-50 font-bold"
                    >
                      {section.mailSubject}
                    </div>
                  )}

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
                      className="text-[12.5px] font-bold text-black mb-1 outline-none focus:bg-amber-50"
                    >
                      {section.sectionTitle}
                    </div>
                  )}

                  <table className="w-full border-collapse border border-black text-[10.5px] md:text-[11px]">
                    <thead>
                      <tr className={getHeaderThemeClass(section.headerTheme)}>
                        {section.columns.map((col) => (
                          <th
                            key={col.id}
                            className={`border border-black px-1.5 py-1 text-${col.align || 'left'} text-[11px]`}
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

              {/* P.T.O indicator if not last page */}
              {(!isLastPage || data.hasPto) && (
                <div className="text-right text-[12px] font-bold text-gray-800 pr-2 my-2">
                  P.T.O
                </div>
              )}
            </div>

            {/* Signatures Section: ALWAYS PINNED TO BOTTOM */}
            <div className="mt-auto pt-6 pb-2 print-avoid-break">
              <div className="grid grid-cols-3 text-center text-[12px] md:text-[12.5px]">
                <div>
                  <div className="w-36 md:w-44 border-b-2 border-black mx-auto mb-1"></div>
                  <div className="font-bold text-black">{data.signatures.preparedByLabel}</div>
                  {data.signatures.preparedByName && (
                    <div className="text-[11px] text-gray-700 mt-0.5 font-medium">{data.signatures.preparedByName}</div>
                  )}
                </div>
                <div>
                  <div className="w-36 md:w-44 border-b-2 border-black mx-auto mb-1"></div>
                  <div className="font-bold text-black">{data.signatures.authorizedByLabel}</div>
                  {data.signatures.authorizedByName && (
                    <div className="text-[11px] text-gray-700 mt-0.5 font-medium">{data.signatures.authorizedByName}</div>
                  )}
                </div>
                <div>
                  <div className="w-36 md:w-44 border-b-2 border-black mx-auto mb-1"></div>
                  <div className="font-bold text-black">{data.signatures.receivedByLabel}</div>
                  {data.signatures.receivedByName && (
                    <div className="text-[11px] text-gray-700 mt-0.5 font-medium">{data.signatures.receivedByName}</div>
                  )}
                </div>
              </div>

              {pages.length > 1 && (
                <div className="text-center text-[10px] text-gray-400 mt-2 font-medium">
                  Page {pageIdx + 1} of {pages.length}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
