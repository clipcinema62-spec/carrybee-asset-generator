import React, { useRef } from 'react';
import { CarryBeeFormData } from '../types/form';
import { ALL_PRESETS } from '../data/presets';
import { downloadWordDocument } from '../utils/exportWord';
import { getDocumentFileName } from '../utils/dateUtils';
import {
  Printer,
  Download,
  Upload,
  RotateCcw,
  Undo2,
  Redo2,
  Eye,
  Edit3,
  Columns,
  FileSpreadsheet,
  Check,
  HelpCircle,
  FileText,
  FilePlus2,
  Trash2,
} from 'lucide-react';

interface ToolbarProps {
  currentData: CarryBeeFormData;
  onSelectPreset: (preset: CarryBeeFormData) => void;
  onReset: () => void;
  onImportData: (data: CarryBeeFormData) => void;
  viewMode: 'split' | 'editor' | 'preview';
  setViewMode: (mode: 'split' | 'editor' | 'preview') => void;
  interactive: boolean;
  setInteractive: (interactive: boolean) => void;
  onOpenHelp: () => void;
  // Undo & Redo
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  // Multi-page controls
  pageCount: number;
  onAddPage: () => void;
  onRemovePage?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentData,
  onSelectPreset,
  onReset,
  onImportData,
  viewMode,
  setViewMode,
  interactive,
  setInteractive,
  onOpenHelp,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  pageCount,
  onAddPage,
  onRemovePage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedCsv, setCopiedCsv] = React.useState(false);

  const handlePrint = () => {
    const originalTitle = document.title;
    const targetTitle = getDocumentFileName(currentData.company.date);
    document.title = targetTitle;
    window.print();
    // Restore title after print dialog closes
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getDocumentFileName(currentData.company.date, 'json');
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.company && parsed.parties) {
          onImportData(parsed);
        } else {
          alert('Invalid CarryBee Form JSON format.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopyCsv = () => {
    let csv = '';
    if (currentData.showStandardTable && currentData.standardItems.length > 0) {
      const headers = currentData.standardColumns.map((c) => `"${c.label}"`).join('\t');
      const rows = currentData.standardItems
        .map((item) => {
          return currentData.standardColumns
            .map((col) => {
              const val = (item as any)[col.key] || item.customValues?.[col.key] || '';
              return `"${String(val).replace(/"/g, '""')}"`;
            })
            .join('\t');
        })
        .join('\n');
      csv = `${headers}\n${rows}`;
    }

    navigator.clipboard.writeText(csv).then(() => {
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2000);
    });
  };

  return (
    <header className="no-print sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-amber-400 text-black flex items-center justify-center font-black text-sm tracking-wider">
            CB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">CarryBee</span>
              <span className="bg-amber-400 text-black text-[9.5px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                IT Form
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              Asset Send / Received Generator
            </div>
          </div>
        </div>

        {/* Undo / Redo Controls */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded flex items-center gap-1 text-xs font-medium transition-colors ${
              canUndo
                ? 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'
                : 'text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title="Undo last change (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Undo</span>
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded flex items-center gap-1 text-xs font-medium transition-colors ${
              canRedo
                ? 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'
                : 'text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title="Redo change (Ctrl+Y / Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Redo</span>
          </button>
        </div>

        {/* Page Add / Remove Controls */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            type="button"
            onClick={onAddPage}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded font-semibold text-xs transition-colors"
            title="Add a new page (Page 2, Page 3, etc.)"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>+ Add Page</span>
          </button>
          {pageCount > 1 && onRemovePage && (
            <button
              type="button"
              onClick={onRemovePage}
              className="flex items-center gap-1 bg-slate-700 hover:bg-rose-900 text-slate-300 hover:text-white px-2 py-1 rounded font-medium text-xs transition-colors"
              title="Delete the last page"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Del Page</span>
            </button>
          )}
          <span className="px-1.5 text-slate-400 font-medium text-[11px]">
            {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
          </span>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <span className="text-slate-400 pl-1 text-[11px] font-medium hidden md:inline">Preset:</span>
          <select
            value={currentData.id}
            onChange={(e) => {
              const selected = ALL_PRESETS.find((p) => p.id === e.target.value);
              if (selected) onSelectPreset(selected);
            }}
            className="bg-slate-900 text-white rounded px-2 py-1 text-xs border border-slate-700 outline-none font-medium cursor-pointer max-w-[150px] sm:max-w-[180px] truncate"
          >
            {ALL_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.presetName}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="hidden lg:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
              viewMode === 'split' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Split
          </button>
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
              viewMode === 'editor' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Editor
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
              viewMode === 'preview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Interactive Document Click-to-edit switch */}
          <button
            type="button"
            onClick={() => setInteractive(!interactive)}
            className={`text-xs px-2 py-1.5 rounded flex items-center gap-1 font-medium transition-colors ${
              interactive
                ? 'bg-amber-400 text-black font-semibold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="When active, click directly on any document text to edit inline"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inline Edit</span>
          </button>

          {/* Copy CSV to Excel */}
          <button
            type="button"
            onClick={handleCopyCsv}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2 py-1.5 rounded flex items-center gap-1 font-medium"
            title="Copy table data formatted for Excel"
          >
            {copiedCsv ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="hidden sm:inline">Excel</span>
          </button>

          {/* Export Word Document */}
          <button
            type="button"
            onClick={() => downloadWordDocument(currentData)}
            className="text-xs bg-blue-700 hover:bg-blue-800 text-white font-semibold px-2.5 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition-colors"
            title="Download as Microsoft Word document (.doc)"
          >
            <FileText className="w-3.5 h-3.5 text-blue-200" />
            <span className="font-bold">Word</span>
          </button>

          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJson}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2 py-1.5 rounded flex items-center gap-1 font-medium"
            title="Export Form data as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">JSON</span>
          </button>

          {/* Import JSON */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2 py-1.5 rounded flex items-center gap-1 font-medium"
            title="Import previously saved JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Open</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 p-1.5 rounded font-medium"
            title="Reset to blank form with today's date"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Help Modal */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 p-1.5 rounded font-medium"
            title="Help & Shortcuts"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>

          {/* Primary Print / Save PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="text-xs bg-amber-400 hover:bg-amber-500 text-black px-3 py-1.5 rounded font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            title="Print directly or save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
