import React, { useRef } from 'react';
import { CarryBeeFormData } from '../types/form';
import { ALL_PRESETS } from '../data/presets';
import { downloadWordDocument } from '../utils/exportWord';
import {
  Printer,
  Download,
  Upload,
  RotateCcw,
  Eye,
  Edit3,
  Columns,
  Copy,
  FileSpreadsheet,
  Check,
  Github,
  HelpCircle,
  FileText,
  FileType,
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
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedCsv, setCopiedCsv] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CarryBee_Asset_Form_${currentData.company.date.replace(/\//g, '-') || 'export'}.json`;
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
    } else if (currentData.customSections.length > 0) {
      csv = currentData.customSections
        .map((s) => {
          const headers = s.columns.map((c) => `"${c.label}"`).join('\t');
          const rows = s.rows
            .map((r) => s.columns.map((c) => `"${(r.cells[c.id] || '').replace(/"/g, '""')}"`).join('\t'))
            .join('\n');
          return `${s.sectionTitle || ''}\n${headers}\n${rows}`;
        })
        .join('\n\n');
    }

    if (csv) {
      navigator.clipboard.writeText(csv);
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2000);
    }
  };

  return (
    <header className="no-print sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-amber-400 text-black flex items-center justify-center font-black text-sm tracking-wider">
            CB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">CarryBee Express</span>
              <span className="bg-amber-400 text-black text-[9.5px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                IT Form
              </span>
            </div>
            <div className="text-[10.5px] text-slate-400 hidden sm:block">
              Asset Send / Received Form Generator
            </div>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <span className="text-slate-400 pl-1.5 text-[11px] font-medium hidden md:inline">Preset:</span>
          <select
            value={currentData.id}
            onChange={(e) => {
              const selected = ALL_PRESETS.find((p) => p.id === e.target.value);
              if (selected) onSelectPreset(selected);
            }}
            className="bg-slate-900 text-white rounded px-2 py-1 text-xs border border-slate-700 outline-none font-medium cursor-pointer max-w-[200px] sm:max-w-xs truncate"
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
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
              viewMode === 'split' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Split
          </button>
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
              viewMode === 'editor' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Editor
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
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
            className={`text-xs px-2.5 py-1.5 rounded flex items-center gap-1 font-medium transition-colors ${
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
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded flex items-center gap-1 font-medium"
            title="Copy table data formatted for Excel or Google Sheets"
          >
            {copiedCsv ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400 hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Excel Copy</span>
              </>
            )}
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
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded flex items-center gap-1 font-medium"
            title="Export Form data as JSON file for backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">JSON</span>
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
            <span className="hidden lg:inline">Open</span>
          </button>

          {/* Help Modal */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 p-1.5 rounded font-medium"
            title="GitHub Setup & Help"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>

          {/* Primary Print / Save PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="text-xs bg-amber-400 hover:bg-amber-500 text-black px-3.5 py-1.5 rounded font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            title="Print directly to printer or save as vector PDF via browser Print dialog"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
