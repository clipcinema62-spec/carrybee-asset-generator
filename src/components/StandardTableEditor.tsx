import React, { useState } from 'react';
import { CarryBeeFormData, StandardAssetItem, StandardColumn } from '../types/form';
import { Plus, Trash2, ArrowUp, ArrowDown, Copy, Hash, Columns, Sparkles } from 'lucide-react';

interface StandardTableEditorProps {
  data: CarryBeeFormData;
  onChange: (updated: CarryBeeFormData) => void;
}

const COMMON_HUBS = [
  'Mohakhali',
  'Central Sort',
  'Kalabagan',
  'CTG-Patiya',
  'Narail-Sadar',
  'Rajshahi-Sadar',
  'Dinajpur-Sadar',
  'Bhulta-Gawsia',
  'Sylhet-Dakshin Surma',
  'Dhonia',
  'Bagerhat-Sadar',
  'Lakshmipur-Ramganj',
  'Khulna-Paikgacha',
  'Head Office',
];

const COMMON_ASSETS = [
  'Laptop',
  'Laptop + Charger',
  'Laptop Charger',
  'Laptop Power Cable',
  'Canon LBP6030 Printer',
  'Label Printer',
  'Dotmax 2D Scanner',
  'Headphone',
  'CPU HP, Core i5',
];

export const StandardTableEditor: React.FC<StandardTableEditorProps> = ({ data, onChange }) => {
  const [newColName, setNewColName] = useState('');
  const [showColModal, setShowColModal] = useState(false);

  const updateItem = (index: number, field: keyof StandardAssetItem | string, value: string) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    if (!cloned.standardItems[index]) return;

    if (['sl', 'assetName', 'qty', 'tagNo', 'remarks'].includes(field)) {
      (cloned.standardItems[index] as any)[field] = value;
    } else {
      if (!cloned.standardItems[index].customValues) {
        cloned.standardItems[index].customValues = {};
      }
      cloned.standardItems[index].customValues![field] = value;
    }
    onChange(cloned);
  };

  const handleAddRow = () => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    const nextSl = cloned.standardItems.length + 1;
    const newItem: StandardAssetItem = {
      id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sl: nextSl,
      assetName: '',
      qty: 1,
      tagNo: '',
      remarks: '',
    };
    cloned.standardItems.push(newItem);
    onChange(cloned);
  };

  const handleAddMultipleRows = (count: number) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    const startSl = cloned.standardItems.length;
    for (let i = 0; i < count; i++) {
      cloned.standardItems.push({
        id: `row-${Date.now()}-${i}`,
        sl: startSl + i + 1,
        assetName: '',
        qty: 1,
        tagNo: '',
        remarks: '',
      });
    }
    onChange(cloned);
  };

  const handleDeleteRow = (index: number) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    cloned.standardItems.splice(index, 1);
    onChange(cloned);
  };

  const handleDuplicateRow = (index: number) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    const source = cloned.standardItems[index];
    const duplicated: StandardAssetItem = {
      ...JSON.parse(JSON.stringify(source)),
      id: `row-${Date.now()}`,
      sl: cloned.standardItems.length + 1,
    };
    cloned.standardItems.splice(index + 1, 0, duplicated);
    onChange(cloned);
  };

  const handleMoveRow = (index: number, direction: 'up' | 'down') => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= cloned.standardItems.length) return;

    const temp = cloned.standardItems[index];
    cloned.standardItems[index] = cloned.standardItems[targetIdx];
    cloned.standardItems[targetIdx] = temp;
    onChange(cloned);
  };

  const handleAutoNumberSL = () => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    cloned.standardItems.forEach((item, idx) => {
      item.sl = idx + 1;
    });
    onChange(cloned);
  };

  const handleAddColumn = () => {
    if (!newColName.trim()) return;
    const colId = `col_${Date.now()}`;
    const newCol: StandardColumn = {
      id: colId,
      label: newColName.trim(),
      key: colId,
      align: 'left',
    };
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    cloned.standardColumns.push(newCol);
    onChange(cloned);
    setNewColName('');
    setShowColModal(false);
  };

  const handleDeleteColumn = (colId: string) => {
    if (['sl', 'assetName', 'qty', 'tagNo', 'remarks'].includes(colId)) {
      alert('Default core columns cannot be deleted. You can rename their label if needed.');
      return;
    }
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    cloned.standardColumns = cloned.standardColumns.filter((c) => c.id !== colId);
    onChange(cloned);
  };

  const handleQuickInsertRemarks = (index: number, hub: string) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    const current = cloned.standardItems[index].remarks || '';
    const template = `${hub} (Hub Incharge)\nRemarks: Replace\nMail: IT Asset Request - ${hub} Hub`;
    cloned.standardItems[index].remarks = current ? `${current}\n${template}` : template;
    onChange(cloned);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-slate-800">
            <input
              type="checkbox"
              checked={data.showStandardTable}
              onChange={(e) => {
                const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
                cloned.showStandardTable = e.target.checked;
                onChange(cloned);
              }}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Show Standard Table</span>
          </label>
          <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
            {data.standardItems.length} rows
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAutoNumberSL}
            className="flex items-center gap-1 text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded shadow-sm font-medium"
            title="Automatically renumber SL column 1, 2, 3..."
          >
            <Hash className="w-3.5 h-3.5 text-slate-500" />
            Renumber SL
          </button>

          <button
            type="button"
            onClick={() => setShowColModal(!showColModal)}
            className="flex items-center gap-1 text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded shadow-sm font-medium"
          >
            <Columns className="w-3.5 h-3.5 text-blue-600" />
            Columns ({data.standardColumns.length})
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Clear all rows to have a clean, blank table?')) {
                const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
                cloned.standardItems = Array.from({ length: 10 }, (_, i) => ({
                  id: `blank-row-${Date.now()}-${i}`,
                  sl: i + 1,
                  assetName: '',
                  qty: 1,
                  tagNo: '',
                  remarks: '',
                }));
                onChange(cloned);
              }
            }}
            className="flex items-center gap-1 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded shadow-sm font-medium"
            title="Clear all rows and make table completely blank"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            Clear / Blank
          </button>

          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded shadow-sm font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Row
          </button>

          <button
            type="button"
            onClick={() => handleAddMultipleRows(5)}
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-900 text-white px-2.5 py-1.5 rounded shadow-sm font-medium"
          >
            +5 Rows
          </button>
        </div>
      </div>

      {/* Column Manager Popup */}
      {showColModal && (
        <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Manage Standard Table Columns
          </div>
          <div className="flex flex-wrap gap-2">
            {data.standardColumns.map((col) => (
              <div
                key={col.id}
                className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 px-2 py-1 rounded text-xs"
              >
                <input
                  type="text"
                  value={col.label}
                  onChange={(e) => {
                    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
                    const c = cloned.standardColumns.find((x) => x.id === col.id);
                    if (c) c.label = e.target.value;
                    onChange(cloned);
                  }}
                  className="bg-transparent border-b border-dashed border-slate-400 font-medium text-slate-800 w-24 outline-none text-xs"
                />
                {!['sl', 'assetName', 'qty', 'tagNo', 'remarks'].includes(col.id) && (
                  <button
                    type="button"
                    onClick={() => handleDeleteColumn(col.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove column"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder="New column name (e.g. Serial No, Condition)"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 grow outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddColumn}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded"
            >
              Add Column
            </button>
          </div>
        </div>
      )}

      {/* Row List */}
      <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
        {data.standardItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition-colors space-y-2"
          >
            {/* Row Header & Action Buttons */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  {item.sl || idx + 1}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {item.assetName ? item.assetName : 'New Item'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => handleMoveRow(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 hover:text-slate-700 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveRow(idx, 'down')}
                  disabled={idx === data.standardItems.length - 1}
                  className="p-1 hover:text-slate-700 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicateRow(idx)}
                  className="p-1 hover:text-blue-600"
                  title="Duplicate Row"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRow(idx)}
                  className="p-1 hover:text-red-600"
                  title="Delete Row"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-12 gap-2 text-xs">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">SL</label>
                <input
                  type="text"
                  value={item.sl}
                  onChange={(e) => updateItem(idx, 'sl', e.target.value)}
                  className="w-full border border-slate-200 rounded px-2 py-1 text-center font-semibold bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="col-span-10 sm:col-span-5">
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[10px] font-semibold text-slate-500">Asset Name</label>
                  <div className="relative group">
                    <span className="text-[10px] text-blue-600 cursor-pointer font-medium hover:underline">
                      Quick Pick
                    </span>
                    <div className="hidden group-hover:block absolute right-0 top-4 z-20 bg-white border border-slate-200 shadow-md rounded p-1.5 w-48 text-left space-y-1">
                      {COMMON_ASSETS.map((asset) => (
                        <div
                          key={asset}
                          onClick={() => updateItem(idx, 'assetName', asset)}
                          className="hover:bg-slate-100 px-1.5 py-1 rounded cursor-pointer text-[11px]"
                        >
                          {asset}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  value={item.assetName}
                  onChange={(e) => updateItem(idx, 'assetName', e.target.value)}
                  placeholder="e.g. Laptop, Printer, Scanner"
                  className="w-full border border-slate-200 rounded px-2 py-1 font-medium text-slate-800"
                />
              </div>

              <div className="col-span-4 sm:col-span-2">
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Qty / QNT</label>
                <input
                  type="text"
                  value={item.qty}
                  onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                  className="w-full border border-slate-200 rounded px-2 py-1 text-center"
                />
              </div>

              <div className="col-span-8 sm:col-span-4">
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Tag No</label>
                <input
                  type="text"
                  value={item.tagNo}
                  onChange={(e) => updateItem(idx, 'tagNo', e.target.value)}
                  placeholder="e.g. 387 or USBEX-IT-CPU-0073 or -"
                  className="w-full border border-slate-200 rounded px-2 py-1 font-mono text-slate-700"
                />
              </div>
            </div>

            {/* Custom columns inputs if any */}
            {data.standardColumns.filter((c) => !['sl', 'assetName', 'qty', 'tagNo', 'remarks'].includes(c.id)).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                {data.standardColumns
                  .filter((c) => !['sl', 'assetName', 'qty', 'tagNo', 'remarks'].includes(c.id))
                  .map((col) => (
                    <div key={col.id}>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">{col.label}</label>
                      <input
                        type="text"
                        value={item.customValues?.[col.key] || ''}
                        onChange={(e) => updateItem(idx, col.key, e.target.value)}
                        className="w-full border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                    </div>
                  ))}
              </div>
            )}

            {/* Remarks with formatting helpers */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[10px] font-semibold text-slate-500">
                  Remarks / Hub / Attention Person / Mail Info
                </label>
                {/* Hub quick insert chips */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-[280px]">
                  <span className="text-[10px] text-slate-400">Quick Hub:</span>
                  {COMMON_HUBS.slice(0, 4).map((hub) => (
                    <button
                      key={hub}
                      type="button"
                      onClick={() => handleQuickInsertRemarks(idx, hub)}
                      className="text-[9.5px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-1 py-0.5 rounded text-slate-600 shrink-0 font-medium"
                    >
                      {hub}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={item.remarks}
                onChange={(e) => updateItem(idx, 'remarks', e.target.value)}
                rows={3}
                placeholder="Mohakhali (Hub Incharge)&#10;Remarks: Replace CBE-IT-LabelPrinter-374&#10;Mail: Request for Urgent Printer Replacement..."
                className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-800 leading-snug font-sans focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        ))}

        {data.standardItems.length === 0 && (
          <div className="text-center py-8 text-slate-400 bg-white border border-dashed border-slate-200 rounded-lg">
            No rows in the standard table. Click "+ Add Row" or load a preset above.
          </div>
        )}
      </div>
    </div>
  );
};
