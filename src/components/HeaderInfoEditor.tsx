import React from 'react';
import { CarryBeeFormData } from '../types/form';
import { Building2, ArrowRightLeft, Calendar, FileCheck } from 'lucide-react';

interface HeaderInfoEditorProps {
  data: CarryBeeFormData;
  onChange: (updated: CarryBeeFormData) => void;
}

export const HeaderInfoEditor: React.FC<HeaderInfoEditorProps> = ({ data, onChange }) => {
  const updateCompany = (field: keyof CarryBeeFormData['company'], val: string) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    cloned.company[field] = val;
    onChange(cloned);
  };

  const updateParties = (field: keyof CarryBeeFormData['parties'], val: string) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    cloned.parties[field] = val;
    onChange(cloned);
  };

  const updateSignatures = (field: keyof CarryBeeFormData['signatures'], val: string) => {
    const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
    cloned.signatures[field] = val;
    onChange(cloned);
  };

  const handleSetTodayDate = () => {
    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2, '0')}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${today.getFullYear()}`;
    updateCompany('date', formatted);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Company & Form Letterhead */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            Letterhead & Document Details
          </span>
          <button
            type="button"
            onClick={handleSetTodayDate}
            className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
          >
            <Calendar className="w-3 h-3" />
            Set Today's Date
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Company Name</label>
            <input
              type="text"
              value={data.company.name}
              onChange={(e) => updateCompany('name', e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Company Address</label>
            <input
              type="text"
              value={data.company.address}
              onChange={(e) => updateCompany('address', e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">IT Hotline</label>
            <input
              type="text"
              value={data.company.hotline}
              onChange={(e) => updateCompany('hotline', e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Document Date</label>
            <input
              type="text"
              value={data.company.date}
              onChange={(e) => updateCompany('date', e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Form Badge Title</label>
            <input
              type="text"
              value={data.company.formTitle}
              onChange={(e) => updateCompany('formTitle', e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Department Name</label>
            <input
              type="text"
              value={data.company.department}
              onChange={(e) => updateCompany('department', e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* From & To Sender / Recipient Box */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
            From (Sender) & To (Recipient)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* FROM */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 text-[11px] block border-b border-slate-200 pb-1">
              From (Sender)
            </span>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Branch / Hub</label>
              <input
                type="text"
                value={data.parties.fromBranch}
                onChange={(e) => updateParties('fromBranch', e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Name</label>
              <input
                type="text"
                value={data.parties.fromName}
                onChange={(e) => updateParties('fromName', e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Mobile No</label>
              <input
                type="text"
                value={data.parties.fromMobile}
                onChange={(e) => updateParties('fromMobile', e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 bg-white"
              />
            </div>
          </div>

          {/* TO */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 text-[11px] block border-b border-slate-200 pb-1">
              To (Recipient)
            </span>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Branch / Hub</label>
              <input
                type="text"
                value={data.parties.toBranch}
                onChange={(e) => updateParties('toBranch', e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Name</label>
              <input
                type="text"
                value={data.parties.toName}
                onChange={(e) => updateParties('toName', e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Mobile No</label>
              <input
                type="text"
                value={data.parties.toMobile}
                onChange={(e) => updateParties('toMobile', e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Signatures & Page Controls */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            Signatures & Page Options
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={data.hasPto}
              onChange={(e) => {
                const cloned = JSON.parse(JSON.stringify(data)) as CarryBeeFormData;
                cloned.hasPto = e.target.checked;
                onChange(cloned);
              }}
              className="w-3.5 h-3.5 text-blue-600 rounded"
            />
            <span>Show P.T.O (Page Turn Over)</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Signatory 1 Label</label>
            <input
              type="text"
              value={data.signatures.preparedByLabel}
              onChange={(e) => updateSignatures('preparedByLabel', e.target.value)}
              className="w-full border border-slate-300 rounded px-2 py-1 font-medium"
            />
            <input
              type="text"
              placeholder="Name (Optional)"
              value={data.signatures.preparedByName || ''}
              onChange={(e) => updateSignatures('preparedByName', e.target.value)}
              className="w-full border border-slate-200 rounded px-2 py-0.5 mt-1 text-[11px]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Signatory 2 Label</label>
            <input
              type="text"
              value={data.signatures.authorizedByLabel}
              onChange={(e) => updateSignatures('authorizedByLabel', e.target.value)}
              className="w-full border border-slate-300 rounded px-2 py-1 font-medium"
            />
            <input
              type="text"
              placeholder="Name (Optional)"
              value={data.signatures.authorizedByName || ''}
              onChange={(e) => updateSignatures('authorizedByName', e.target.value)}
              className="w-full border border-slate-200 rounded px-2 py-0.5 mt-1 text-[11px]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Signatory 3 Label</label>
            <input
              type="text"
              value={data.signatures.receivedByLabel}
              onChange={(e) => updateSignatures('receivedByLabel', e.target.value)}
              className="w-full border border-slate-300 rounded px-2 py-1 font-medium"
            />
            <input
              type="text"
              placeholder="Name (Optional)"
              value={data.signatures.receivedByName || ''}
              onChange={(e) => updateSignatures('receivedByName', e.target.value)}
              className="w-full border border-slate-200 rounded px-2 py-0.5 mt-1 text-[11px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
