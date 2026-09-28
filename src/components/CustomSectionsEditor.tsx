import React, { useState } from 'react';
import { CarryBeeFormData, CustomSection, CustomTableColumn, CustomTableRow } from '../types/form';
import { Plus, Trash2, ArrowUp, ArrowDown, Palette, Columns, Layers, ClipboardPaste, Sparkles, Check, AlertCircle } from 'lucide-react';

interface CustomSectionsEditorProps {
  data: CarryBeeFormData;
  onChange: (updated: CarryBeeFormData) => void;
}

export const CustomSectionsEditor: React.FC<CustomSectionsEditorProps> = ({ data, onChange }) => {
  const [newColNames, setNewColNames] = useState<Record<string, string>>({});
  const [pasteSecIdx, setPasteSecIdx] = useState<number | null>(null);
  const [pasteText, setPasteText] = useState<string>('');
  const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);
  const [pasteError, setPasteError] = useState<string | null>(null);

  // New section creation from pasted table directly
  const [showNewPasteTableModal, setShowNewPasteTableModal] = useState<boolean>(false);
  const [newTablePasteText, setNewTablePasteText] = useState<string>('');
  const [newTableTitle, setNewTableTitle] = useState<string>('');
  const [newTableMail, setNewTableMail] = useState<string>('');
  const [newTableTheme, setNewTableTheme] = useState<CustomSection['headerTheme']>('yellow');

  const handleAddSection = (theme: CustomSection['headerTheme'] = 'yellow') => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    const secId = `sec-${Date.now()}`;
    const newSection: CustomSection = {
      id: secId,
      mailSubject: 'Mail: Requisition Request',
      sectionTitle: 'New Requisition Item',
      headerTheme: theme,
      columns: [
        { id: 'c1', label: 'ID', align: 'center' },
        { id: 'c2', label: 'Name', align: 'left' },
        { id: 'c3', label: 'Designation', align: 'left' },
        { id: 'c4', label: 'Department / Hub', align: 'left' },
        { id: 'c5', label: 'Workstation', align: 'left' },
        { id: 'c6', label: 'TN', align: 'center' },
      ],
      rows: [
        {
          id: `r-${Date.now()}-1`,
          cells: {
            c1: 'CL-84000',
            c2: 'Employee Name',
            c3: 'Associate',
            c4: 'Hub Operations',
            c5: 'Workplace / Hub',
            c6: 'Laptop-001',
          },
        },
      ],
    };
    cloned.customSections.push(newSection);
    onChange(cloned);
  };

  const handleDeleteSection = (index: number) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    cloned.customSections.splice(index, 1);
    onChange(cloned);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= cloned.customSections.length) return;
    const temp = cloned.customSections[index];
    cloned.customSections[index] = cloned.customSections[target];
    cloned.customSections[target] = temp;
    onChange(cloned);
  };

  const handleUpdateSectionMeta = (
    index: number,
    field: 'mailSubject' | 'sectionTitle' | 'headerTheme',
    value: string
  ) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    if (!cloned.customSections[index]) return;
    (cloned.customSections[index] as any)[field] = value;
    onChange(cloned);
  };

  const handleAddColumnToSection = (secIdx: number) => {
    const sec = data.customSections[secIdx];
    if (!sec) return;
    const colName = newColNames[sec.id]?.trim();
    if (!colName) return;

    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    const newColId = `c_${Date.now()}`;
    cloned.customSections[secIdx].columns.push({
      id: newColId,
      label: colName,
      align: 'left',
    });

    // Clear text input
    setNewColNames({ ...newColNames, [sec.id]: '' });
    onChange(cloned);
  };

  const handleDeleteColumnFromSection = (secIdx: number, colId: string) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    const sec = cloned.customSections[secIdx];
    if (!sec) return;
    if (sec.columns.length <= 1) {
      alert('A section table must have at least 1 column.');
      return;
    }
    sec.columns = sec.columns.filter((c) => c.id !== colId);
    // Cleanup cells
    sec.rows.forEach((r) => {
      delete r.cells[colId];
    });
    onChange(cloned);
  };

  const handleAddRowToSection = (secIdx: number) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    const sec = cloned.customSections[secIdx];
    if (!sec) return;

    const emptyCells: Record<string, string> = {};
    sec.columns.forEach((col) => {
      emptyCells[col.id] = '';
    });

    const newRow: CustomTableRow = {
      id: `r-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      cells: emptyCells,
    };
    sec.rows.push(newRow);
    onChange(cloned);
  };

  const handleDeleteRowFromSection = (secIdx: number, rowIdx: number) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    cloned.customSections[secIdx].rows.splice(rowIdx, 1);
    onChange(cloned);
  };

  const handleUpdateCell = (secIdx: number, rowIdx: number, colId: string, val: string) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    if (!cloned.customSections[secIdx]?.rows[rowIdx]) return;
    cloned.customSections[secIdx].rows[rowIdx].cells[colId] = val;
    onChange(cloned);
  };

  // Parse raw pasted table text (from Excel, Google Sheets, or TSV/CSV)
  const parseTableText = (text: string) => {
    const clean = text.trim();
    if (!clean) return [];

    const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);
    return lines.map((line) => {
      // If tab separated (Excel copy)
      if (line.includes('\t')) {
        return line.split('\t').map((c) => c.trim().replace(/^"|"$/g, ''));
      }
      // If comma separated
      if (line.includes(',')) {
        return line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      }
      // Otherwise split by 2 or more spaces or pipes
      if (line.includes('|')) {
        return line
          .split('|')
          .map((c) => c.trim())
          .filter(Boolean);
      }
      return line.split(/\s{2,}/).map((c) => c.trim());
    });
  };

  // Paste into existing section
  const handleApplyPasteToExisting = (secIdx: number) => {
    const parsedGrid = parseTableText(pasteText);
    if (parsedGrid.length === 0) {
      setPasteError('Please paste some valid table rows.');
      return;
    }

    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    const sec = cloned.customSections[secIdx];
    if (!sec) return;

    let rowData = parsedGrid;
    // If user indicates first row is column headers
    if (firstRowIsHeader && parsedGrid.length > 1) {
      const headerRow = parsedGrid[0];
      // Update existing columns or add missing
      const newCols: CustomTableColumn[] = headerRow.map((h, i) => ({
        id: sec.columns[i]?.id || `c_p_${Date.now()}_${i}`,
        label: h || `Col ${i + 1}`,
        align: 'left',
      }));
      sec.columns = newCols;
      rowData = parsedGrid.slice(1);
    }

    // Replace or append rows
    const newRows: CustomTableRow[] = rowData.map((rowCells, rIdx) => {
      const cells: Record<string, string> = {};
      sec.columns.forEach((col, cIdx) => {
        cells[col.id] = rowCells[cIdx] || '';
      });
      return {
        id: `r_p_${Date.now()}_${rIdx}`,
        cells,
      };
    });

    sec.rows = newRows;
    onChange(cloned);
    setPasteSecIdx(null);
    setPasteText('');
    setPasteError(null);
  };

  // Create brand new table directly from pasted content
  const handleCreateNewSectionFromPaste = () => {
    const parsedGrid = parseTableText(newTablePasteText);
    if (parsedGrid.length === 0) {
      setPasteError('Please paste some valid table rows.');
      return;
    }

    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    let headerRow: string[] = [];
    let bodyRows = parsedGrid;

    if (firstRowIsHeader && parsedGrid.length > 1) {
      headerRow = parsedGrid[0];
      bodyRows = parsedGrid.slice(1);
    } else {
      const colCount = Math.max(...parsedGrid.map((r) => r.length));
      headerRow = Array.from({ length: colCount }, (_, i) => `Col ${i + 1}`);
    }

    const cols: CustomTableColumn[] = headerRow.map((label, idx) => ({
      id: `c_${Date.now()}_${idx}`,
      label: label.trim() || `Col ${idx + 1}`,
      align: 'left',
    }));

    const rows: CustomTableRow[] = bodyRows.map((r, rIdx) => {
      const cells: Record<string, string> = {};
      cols.forEach((col, cIdx) => {
        cells[col.id] = r[cIdx] || '';
      });
      return {
        id: `r_new_${Date.now()}_${rIdx}`,
        cells,
      };
    });

    const newSec: CustomSection = {
      id: `sec_paste_${Date.now()}`,
      mailSubject: newTableMail || 'Mail: Requisition Request',
      sectionTitle: newTableTitle || `${rows.length} Items Requisition`,
      headerTheme: newTableTheme,
      columns: cols,
      rows: rows,
    };

    cloned.customSections.push(newSec);
    onChange(cloned);

    // Reset modal
    setShowNewPasteTableModal(false);
    setNewTablePasteText('');
    setNewTableTitle('');
    setNewTableMail('');
    setPasteError(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Presets */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Dynamic Requisition Sections / Custom Sub-Tables
          </h3>
          <p className="text-[11px] text-slate-500">
            Add custom sub-tables like Laptop Bags (Blue), Mobile Scanners (Green), or Multi-Dept Requisitions (Yellow).
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setShowNewPasteTableModal(true);
              setPasteError(null);
            }}
            className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-2.5 py-1.5 rounded shadow-xs"
            title="Paste Excel / Google Sheet data directly to create a new sub-table"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Paste Table from Excel</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddSection('yellow')}
            className="flex items-center gap-1 text-xs bg-[#eab308] hover:bg-[#ca8a04] text-slate-900 font-semibold px-2.5 py-1.5 rounded shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            + Yellow
          </button>
          <button
            type="button"
            onClick={() => handleAddSection('green')}
            className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1.5 rounded shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            + Green
          </button>
          <button
            type="button"
            onClick={() => handleAddSection('blue')}
            className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2.5 py-1.5 rounded shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            + Blue
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {data.customSections.map((section, secIdx) => (
          <div
            key={section.id || secIdx}
            className="p-3.5 bg-white rounded-lg border-2 border-slate-200 shadow-xs space-y-3"
          >
            {/* Section Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Section #{secIdx + 1}
                </span>

                {/* Color theme badges */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded">
                  {(['yellow', 'green', 'blue', 'gray', 'white'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleUpdateSectionMeta(secIdx, 'headerTheme', t)}
                      className={`w-4 h-4 rounded-full border border-slate-300 ${
                        t === 'yellow'
                          ? 'bg-[#ffff00]'
                          : t === 'green'
                          ? 'bg-[#00e600]'
                          : t === 'blue'
                          ? 'bg-[#93c5fd]'
                          : t === 'gray'
                          ? 'bg-slate-300'
                          : 'bg-white'
                      } ${section.headerTheme === t ? 'ring-2 ring-slate-800 scale-110' : 'opacity-70 hover:opacity-100'}`}
                      title={`Header Theme: ${t}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => handleMoveSection(secIdx, 'up')}
                  disabled={secIdx === 0}
                  className="p-1 hover:text-slate-700 disabled:opacity-30"
                  title="Move Section Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveSection(secIdx, 'down')}
                  disabled={secIdx === data.customSections.length - 1}
                  className="p-1 hover:text-slate-700 disabled:opacity-30"
                  title="Move Section Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSection(secIdx)}
                  className="p-1 hover:text-red-600 ml-1"
                  title="Delete Section"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Title & Mail Subject Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                  Mail Subject / Memo Line (Italic in document)
                </label>
                <input
                  type="text"
                  value={section.mailSubject || ''}
                  onChange={(e) => handleUpdateSectionMeta(secIdx, 'mailSubject', e.target.value)}
                  placeholder="e.g. Mail: Laptop Requisition of September 2026..."
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 italic text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                  Section Bold Title / Quantity Summary
                </label>
                <input
                  type="text"
                  value={section.sectionTitle || ''}
                  onChange={(e) => handleUpdateSectionMeta(secIdx, 'sectionTitle', e.target.value)}
                  placeholder="e.g. 5 Laptops + Chargers or 3 Laptop Side Bag"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Dynamic Columns Manager */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Columns className="w-3 h-3 text-slate-500" />
                  Table Columns ({section.columns.length})
                </span>
                <span className="text-[10px] text-slate-400">Rename or remove column</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {section.columns.map((col) => (
                  <div
                    key={col.id}
                    className="flex items-center gap-1 bg-white border border-slate-300 px-2 py-0.5 rounded text-xs"
                  >
                    <input
                      type="text"
                      value={col.label}
                      onChange={(e) => {
                        const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
                        const c = cloned.customSections[secIdx].columns.find((x) => x.id === col.id);
                        if (c) c.label = e.target.value;
                        onChange(cloned);
                      }}
                      className="bg-transparent border-b border-dashed border-slate-300 text-slate-800 font-medium w-20 outline-none text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteColumnFromSection(secIdx, col.id)}
                      className="text-red-400 hover:text-red-700 text-xs px-0.5"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Column Input */}
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Add custom column (e.g. Serial, Hub, Workplace)"
                  value={newColNames[section.id] || ''}
                  onChange={(e) =>
                    setNewColNames({ ...newColNames, [section.id]: e.target.value })
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColumnToSection(secIdx)}
                  className="text-xs border border-slate-300 rounded px-2 py-1 grow outline-none bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddColumnToSection(secIdx)}
                  className="text-xs bg-slate-700 hover:bg-slate-800 text-white px-2.5 py-1 rounded font-medium"
                >
                  + Add Col
                </button>
              </div>
            </div>

            {/* Rows Table in Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Rows ({section.rows.length})</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPasteSecIdx(secIdx);
                      setPasteText('');
                      setPasteError(null);
                    }}
                    className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold px-2 py-1 rounded flex items-center gap-1 border border-indigo-200"
                    title="Paste table rows from Excel into this section"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    Paste Excel Rows
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddRowToSection(secIdx)}
                    className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Row
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {section.rows.map((row, rowIdx) => (
                  <div
                    key={row.id || rowIdx}
                    className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded border border-slate-200"
                  >
                    <span className="text-[10px] text-slate-400 w-4 text-center shrink-0">
                      {rowIdx + 1}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5 grow">
                      {section.columns.map((col) => (
                        <div key={col.id}>
                          <input
                            type="text"
                            placeholder={col.label}
                            value={row.cells[col.id] || ''}
                            onChange={(e) =>
                              handleUpdateCell(secIdx, rowIdx, col.id, e.target.value)
                            }
                            className="w-full text-xs border border-slate-300 bg-white rounded px-1.5 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteRowFromSection(secIdx, rowIdx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Delete row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {data.customSections.length === 0 && (
          <div className="text-center py-6 text-slate-400 bg-white border border-dashed border-slate-200 rounded-lg text-xs">
            No custom sub-tables active. Click "Paste Table from Excel" or "+ Yellow" to add one!
          </div>
        )}
      </div>

      {/* MODAL 1: Create New Sub-Table by Pasting Excel */}
      {showNewPasteTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-4 md:p-5 space-y-3.5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                  <ClipboardPaste className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Paste Table from Excel / Sheets</h3>
                  <p className="text-[11px] text-slate-500">Copy table from Excel or Google Sheets and paste here</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPasteTableModal(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold px-2 py-0.5"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Section Title</label>
                <input
                  type="text"
                  placeholder="e.g. 5 pcs Mobile Scanner or 3 Laptop Bag"
                  value={newTableTitle}
                  onChange={(e) => setNewTableTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Mail Subject / Memo</label>
                <input
                  type="text"
                  placeholder="e.g. Mail: Regarding PTN Device Requirements..."
                  value={newTableMail}
                  onChange={(e) => setNewTableMail(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 italic"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Select Header Color Theme</label>
              <div className="flex items-center gap-2">
                {(['yellow', 'green', 'blue', 'gray', 'white'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewTableTheme(t)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded border capitalize ${
                      newTableTheme === t ? 'ring-2 ring-indigo-600 font-bold border-indigo-600' : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full border border-slate-300 ${
                        t === 'yellow'
                          ? 'bg-[#ffff00]'
                          : t === 'green'
                          ? 'bg-[#00e600]'
                          : t === 'blue'
                          ? 'bg-[#93c5fd]'
                          : t === 'gray'
                          ? 'bg-slate-300'
                          : 'bg-white'
                      }`}
                    />
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paste TextArea */}
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <label className="font-semibold text-slate-700">Paste Table Rows (Ctrl+V)</label>
                <label className="flex items-center gap-1 text-slate-600 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={firstRowIsHeader}
                    onChange={(e) => setFirstRowIsHeader(e.target.checked)}
                    className="w-3.5 h-3.5 text-indigo-600 rounded"
                  />
                  <span>First line contains column headers</span>
                </label>
              </div>
              <textarea
                value={newTablePasteText}
                onChange={(e) => setNewTablePasteText(e.target.value)}
                rows={6}
                placeholder="ID	Name	Designation	Department	Workstation	TN
CL-84965	Md. Raihan Munshi	Associate	Hub Operations	CTG-Nasirabad	Laptop-115
CL-84966	Kamrul Islam Bhuiyan	Associate	Hub Operations	Feni-Sadar	Laptop-912"
                className="w-full border border-slate-300 rounded p-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Tip: Copy cells directly from Microsoft Excel or Google Sheets and paste above. Tabs and commas are automatically recognized!
              </p>
            </div>

            {pasteError && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{pasteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewPasteTableModal(false)}
                className="text-xs px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateNewSectionFromPaste}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded shadow-xs"
              >
                Generate Sub-Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Paste Rows Into Existing Sub-Table */}
      {pasteSecIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-4 md:p-5 space-y-3.5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                  <ClipboardPaste className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Paste Rows into Section #{pasteSecIdx + 1}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Target Table: {data.customSections[pasteSecIdx]?.sectionTitle || 'Requisition'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPasteSecIdx(null)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold px-2 py-0.5"
              >
                ×
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <label className="font-semibold text-slate-700">Paste Table Cells (Ctrl+V)</label>
                <label className="flex items-center gap-1 text-slate-600 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={firstRowIsHeader}
                    onChange={(e) => setFirstRowIsHeader(e.target.checked)}
                    className="w-3.5 h-3.5 text-indigo-600 rounded"
                  />
                  <span>First line contains column names</span>
                </label>
              </div>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={6}
                placeholder="Manikganj-Sadar	CL-86234	Md. Khan Zahan Ali Sinbad
Rajbari-Sadar	CL-86231	Md. Abdul Momen Pramanik"
                className="w-full border border-slate-300 rounded p-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Rows will replace or fill the columns in this sub-table.
              </p>
            </div>

            {pasteError && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{pasteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPasteSecIdx(null)}
                className="text-xs px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApplyPasteToExisting(pasteSecIdx)}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded shadow-xs"
              >
                Apply to Sub-Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
