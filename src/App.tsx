import React, { useState, useEffect, useRef } from 'react';
import { CarryBeeFormData, DocumentPage } from './types/form';
import { ALL_PRESETS } from './data/presets';
import { createBlankCarryBeeForm } from './data/blankForm';
import { getCurrentDateFormatted, ddmmyyyyToIso, isoToDdmmyyyy } from './utils/dateUtils';
import { Toolbar } from './components/Toolbar';
import { OfficialDocumentView } from './components/OfficialDocumentView';
import { StandardTableEditor } from './components/StandardTableEditor';
import { CustomSectionsEditor } from './components/CustomSectionsEditor';
import { HeaderInfoEditor } from './components/HeaderInfoEditor';
import { HelpModal } from './components/HelpModal';
import {
  TableProperties,
  Layers,
  Building,
  Info,
  CheckCircle2,
  Sparkles,
  FileText,
  Printer,
  Calendar,
  Undo2,
  Redo2,
  FilePlus2,
  Trash2,
} from 'lucide-react';

const STORAGE_KEY = 'carrybee_it_asset_form_state_v3';

export default function App() {
  const [formData, setFormData] = useState<CarryBeeFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.company && parsed.parties) {
          // Always ensure valid date
          if (!parsed.company.date) {
            parsed.company.date = getCurrentDateFormatted();
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load stored form data', e);
    }
    return createBlankCarryBeeForm();
  });

  // Undo / Redo History Stacks
  const [history, setHistory] = useState<CarryBeeFormData[]>([]);
  const [future, setFuture] = useState<CarryBeeFormData[]>([]);
  const isUndoRedoAction = useRef(false);

  const [activeTab, setActiveTab] = useState<'standard' | 'custom' | 'header'>('standard');
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [interactive, setInteractive] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const datePickerRef = useRef<HTMLInputElement>(null);

  // Auto-save to localStorage whenever formData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Could not save to localStorage', e);
    }
  }, [formData]);

  // Keyboard shortcut listener for Ctrl+Z (Undo) and Ctrl+Y / Ctrl+Shift+Z (Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  /**
   * Update formData while tracking history for Undo/Redo
   */
  const updateFormDataWithHistory = (next: CarryBeeFormData) => {
    if (!isUndoRedoAction.current) {
      setHistory((prev) => [...prev.slice(-30), JSON.parse(JSON.stringify(formData))]);
      setFuture([]); // clear redo stack on new edit
    }
    setFormData(next);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);

    isUndoRedoAction.current = true;
    setFuture((prev) => [JSON.parse(JSON.stringify(formData)), ...prev]);
    setHistory(newHistory);
    setFormData(previous);
    isUndoRedoAction.current = false;
    showToast('Undo action');
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    isUndoRedoAction.current = true;
    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(formData))]);
    setFuture(newFuture);
    setFormData(next);
    isUndoRedoAction.current = false;
    showToast('Redo action');
  };

  const handleSelectPreset = (preset: CarryBeeFormData) => {
    updateFormDataWithHistory(JSON.parse(JSON.stringify(preset)));
    showToast(`Loaded ${preset.presetName}`);
  };

  const handleReset = () => {
    if (confirm("Reset form back to a clean blank form with today's date? Any unsaved edits will be cleared.")) {
      updateFormDataWithHistory(createBlankCarryBeeForm());
      showToast('Reset to blank official form');
    }
  };

  const handleImportData = (imported: CarryBeeFormData) => {
    updateFormDataWithHistory(imported);
    showToast('Imported form data successfully!');
  };

  /**
   * Multi-Page Document Support (Add Page / Delete Page)
   */
  const getPageCount = () => {
    if (formData.pages && formData.pages.length > 0) {
      return formData.pages.length;
    }
    return 1;
  };

  const handleAddPage = () => {
    const cloned = JSON.parse(JSON.stringify(formData)) as CarryBeeFormData;
    if (!cloned.pages || cloned.pages.length === 0) {
      // Initialize first page from existing items
      cloned.pages = [
        {
          id: 'page-1',
          pageNumber: 1,
          showStandardTable: cloned.showStandardTable,
          standardItems: [...cloned.standardItems],
          customSections: [...cloned.customSections],
        },
      ];
    }

    const nextPgNumber = cloned.pages.length + 1;
    const newPage: DocumentPage = {
      id: `page-${Date.now()}`,
      pageNumber: nextPgNumber,
      showStandardTable: true,
      standardItems: Array.from({ length: 8 }, (_, i) => ({
        id: `p${nextPgNumber}-row-${i + 1}`,
        sl: (nextPgNumber - 1) * 10 + i + 1,
        assetName: '',
        qty: 1,
        tagNo: '',
        remarks: '',
      })),
      customSections: [],
    };

    cloned.pages.push(newPage);
    cloned.hasPto = true; // Turn on P.T.O indicator automatically for multi-page
    updateFormDataWithHistory(cloned);
    showToast(`Added Page ${nextPgNumber}`);
  };

  const handleRemovePage = () => {
    const cloned = JSON.parse(JSON.stringify(formData)) as CarryBeeFormData;
    if (cloned.pages && cloned.pages.length > 1) {
      const removedNum = cloned.pages.length;
      cloned.pages.pop();
      if (cloned.pages.length === 1) {
        cloned.hasPto = false;
      }
      updateFormDataWithHistory(cloned);
      showToast(`Removed Page ${removedNum}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Application Toolbar */}
      <Toolbar
        currentData={formData}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onImportData={handleImportData}
        viewMode={viewMode}
        setViewMode={setViewMode}
        interactive={interactive}
        setInteractive={(val) => {
          setInteractive(val);
          if (val) {
            showToast('Inline editing active: Click any text on the right document to edit!');
          }
        }}
        onOpenHelp={() => setShowHelp(true)}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        pageCount={getPageCount()}
        onAddPage={handleAddPage}
        onRemovePage={formData.pages && formData.pages.length > 1 ? handleRemovePage : undefined}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-3.5 py-2 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-fade-in no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-2 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Editor Panel */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div
              className={`no-print ${
                viewMode === 'editor'
                  ? 'lg:col-span-12 max-w-4xl mx-auto w-full'
                  : 'lg:col-span-6 xl:col-span-5'
              } space-y-4`}
            >
              {/* Top Quick Document Header Bar (Date & Quick Info) */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{formData.presetName}</div>
                      <div className="text-[11px] text-slate-500">
                        {formData.standardItems.length} items • {getPageCount()} {getPageCount() === 1 ? 'page' : 'pages'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleAddPage}
                      className="text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-2 py-1 rounded flex items-center gap-1 border border-blue-200 transition-colors"
                      title="Add another page to this form"
                    >
                      <FilePlus2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>+ Page</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-[11px] text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded hover:bg-slate-100"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Direct Document Date Picker Bar (Auto date, manual text, or calendar popup) */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 whitespace-nowrap flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      Document Date:
                    </span>
                    <input
                      type="text"
                      value={formData.company.date}
                      onChange={(e) => {
                        const cloned = JSON.parse(JSON.stringify(formData)) as CarryBeeFormData;
                        cloned.company.date = e.target.value;
                        updateFormDataWithHistory(cloned);
                      }}
                      placeholder="DD/MM/YYYY"
                      className="border border-slate-300 rounded px-2.5 py-1 text-xs font-bold text-slate-900 bg-white shadow-inner w-32 focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                    {/* Native Calendar Picker Icon button */}
                    <button
                      type="button"
                      onClick={() => datePickerRef.current?.showPicker?.() || datePickerRef.current?.click()}
                      className="p-1 text-slate-600 hover:text-black hover:bg-amber-200/60 rounded cursor-pointer"
                      title="Open Calendar Date Picker"
                    >
                      <Calendar className="w-4 h-4 text-blue-700" />
                    </button>
                    <input
                      ref={datePickerRef}
                      type="date"
                      value={ddmmyyyyToIso(formData.company.date)}
                      onChange={(e) => {
                        const converted = isoToDdmmyyyy(e.target.value);
                        const cloned = JSON.parse(JSON.stringify(formData)) as CarryBeeFormData;
                        cloned.company.date = converted;
                        updateFormDataWithHistory(cloned);
                        showToast(`Date updated to: ${converted}`);
                      }}
                      className="opacity-0 pointer-events-none w-0 h-0 absolute"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const todayFormatted = getCurrentDateFormatted();
                      const cloned = JSON.parse(JSON.stringify(formData)) as CarryBeeFormData;
                      cloned.company.date = todayFormatted;
                      updateFormDataWithHistory(cloned);
                      showToast(`Date set to today: ${todayFormatted}`);
                    }}
                    className="text-[11px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2 py-1 rounded shadow-xs font-semibold shrink-0"
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* Editor Tabs Navigation */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="flex border-b border-slate-200 bg-slate-50/70 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('standard')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'standard'
                        ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <TableProperties className="w-3.5 h-3.5" />
                    <span>Standard Items</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
                      {formData.standardItems.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('custom')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'custom'
                        ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Sub-Tables</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
                      {formData.customSections.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('header')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'header'
                        ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Header & Parties</span>
                  </button>
                </div>

                <div className="p-3.5">
                  {activeTab === 'standard' && (
                    <StandardTableEditor
                      data={formData}
                      onChange={updateFormDataWithHistory}
                    />
                  )}

                  {activeTab === 'custom' && (
                    <CustomSectionsEditor
                      data={formData}
                      onChange={updateFormDataWithHistory}
                    />
                  )}

                  {activeTab === 'header' && (
                    <HeaderInfoEditor
                      data={formData}
                      onChange={updateFormDataWithHistory}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Right Live Document Preview */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className={`${
                viewMode === 'preview'
                  ? 'lg:col-span-12 max-w-4xl mx-auto w-full'
                  : 'lg:col-span-6 xl:col-span-7'
              }`}
            >
              {/* Document Preview Controls Header */}
              <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-2 bg-white border border-slate-200 p-2 sm:px-3 rounded-xl shadow-xs">
                <div className="flex items-center gap-1.5 font-medium text-xs text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold">Official Paper View</span>
                  {getPageCount() > 1 && (
                    <span className="bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      {getPageCount()} Pages
                    </span>
                  )}
                  {interactive && (
                    <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      Inline Editing
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      import('./utils/exportWord').then((mod) => mod.downloadWordDocument(formData));
                      showToast('Downloading editable Microsoft Word file...');
                    }}
                    className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1.2 rounded font-bold flex items-center gap-1.5 transition-colors"
                    title="Download as Microsoft Word document (.doc)"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download Word (.doc)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="text-xs bg-amber-400 hover:bg-amber-500 text-black px-3 py-1.2 rounded font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                    title="Print directly or save as PDF"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>

              {/* The Paper Document */}
              <div className="overflow-x-auto pb-6">
                <OfficialDocumentView
                  data={formData}
                  onUpdate={updateFormDataWithHistory}
                  interactive={interactive}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* GitHub & How-to-use Guide Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
