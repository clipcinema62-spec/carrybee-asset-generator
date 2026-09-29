import React, { useState, useEffect } from 'react';
import { CarryBeeFormData } from './types/form';
import { ALL_PRESETS } from './data/presets';
import { createBlankCarryBeeForm } from './data/blankForm';
import { getCurrentDateFormatted } from './utils/dateUtils';
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
} from 'lucide-react';

const STORAGE_KEY = 'carrybee_it_asset_form_state_v2';

export default function App() {
  const [formData, setFormData] = useState<CarryBeeFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.company && parsed.parties) {
          // If date was not updated or empty, always ensure current date
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

  const [activeTab, setActiveTab] = useState<'standard' | 'custom' | 'header'>('standard');
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [interactive, setInteractive] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save to localStorage whenever formData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Could not save to localStorage', e);
    }
  }, [formData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectPreset = (preset: CarryBeeFormData) => {
    setFormData(JSON.parse(JSON.stringify(preset)));
    showToast(`Loaded ${preset.presetName}`);
  };

  const handleReset = () => {
    if (confirm('Reset form back to a clean blank form with today\'s date? Any unsaved edits will be cleared.')) {
      setFormData(createBlankCarryBeeForm());
      showToast('Reset to blank official form');
    }
  };

  const handleImportData = (imported: CarryBeeFormData) => {
    setFormData(imported);
    showToast('Imported form data successfully!');
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
                        {formData.standardItems.length} items • {formData.customSections.length} custom tables
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded hover:bg-slate-100"
                  >
                    Reset
                  </button>
                </div>

                {/* Direct Document Date input right on left panel */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                      Document Date:
                    </span>
                    <input
                      type="text"
                      value={formData.company.date}
                      onChange={(e) => {
                        const cloned = JSON.parse(JSON.stringify(formData)) as CarryBeeFormData;
                        cloned.company.date = e.target.value;
                        setFormData(cloned);
                      }}
                      placeholder="DD/MM/YYYY"
                      className="border border-slate-300 rounded px-2.5 py-1 text-xs font-bold text-slate-900 bg-white shadow-inner w-32 focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const formatted = `${String(today.getDate()).padStart(2, '0')}/${String(
                        today.getMonth() + 1
                      ).padStart(2, '0')}/${today.getFullYear()}`;
                      const cloned = JSON.parse(JSON.stringify(formData)) as CarryBeeFormData;
                      cloned.company.date = formatted;
                      setFormData(cloned);
                      showToast(`Date set to today: ${formatted}`);
                    }}
                    className="text-[11px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2 py-1 rounded shadow-xs font-semibold shrink-0"
                  >
                    Today's Date
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
                    <span>Dynamic Sub-Tables</span>
                    {formData.customSections.length > 0 && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                        {formData.customSections.length}
                      </span>
                    )}
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
                    <span>Header & Sender</span>
                  </button>
                </div>

                {/* Tab Body */}
                <div className="p-3 sm:p-4">
                  {activeTab === 'standard' && (
                    <StandardTableEditor data={formData} onChange={setFormData} />
                  )}

                  {activeTab === 'custom' && (
                    <CustomSectionsEditor data={formData} onChange={setFormData} />
                  )}

                  {activeTab === 'header' && (
                    <HeaderInfoEditor data={formData} onChange={setFormData} />
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
                  <span className="font-bold">Official A4 Paper View</span>
                  {interactive && (
                    <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      Click-to-Edit Enabled
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
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>

              {/* The Paper Document */}
              <div className="overflow-x-auto pb-6">
                <OfficialDocumentView
                  data={formData}
                  onUpdate={setFormData}
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
