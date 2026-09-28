import React from 'react';
import { X, Github, ExternalLink, Printer, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base">CarryBee IT Asset Form System Guide</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* Bengali Guide Summary */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 space-y-1">
            <p className="font-bold text-sm">CarryBee Express Ltd. IT Asset Form ব্যবহার নির্দেশিকা:</p>
            <p>
              আপনার দেওয়া ৪টি ছবি অনুযায়ী সব ধরণের ডাটা ফরম্যাট ও ডাইনামিক টেবিল যুক্ত করা হয়েছে:
            </p>
            <ul className="list-disc pl-4 space-y-0.5 mt-1">
              <li><strong>Preset 1 (১ম ছবি):</strong> স্ট্যান্ডার্ড ১৫-টি আইটেমের IT Asset তালিকা (Canon Printer, CPU, Laptop, Hub Incharge, Remarks ও Mail বিবরণী সহ)।</li>
              <li><strong>Preset 2 (২য় ছবি):</strong> ডাইনামিক রিকুইজিশন সেকশন (Laptop Bag এর Blue Table এবং Mobile Scanner এর Green Table)।</li>
              <li><strong>Preset 3 (৩য় ছবি):</strong> মাল্টি-ডিপার্টমেন্ট মিক্সড রিকুইজিশন (Standard table + একাধিক Yellow Table এবং P.T.O সহ)।</li>
              <li><strong>Preset 4 (৪র্থ ছবি):</strong> অফিশিয়াল ব্ল্যাঙ্ক ফরম (১৫টি খালি সারি সহ সরাসরি প্রিন্ট করার জন্য)।</li>
            </ul>
          </div>

          {/* GitHub Upload & Web Base Deployment */}
          <div className="border border-slate-200 rounded-lg p-3 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Github className="w-4 h-4 text-slate-700" />
              GitHub-এ আপলোড ও ওয়েব থেকে ব্যবহার করার উপায়:
            </h3>
            <p className="text-slate-600">
              আপনি এই সম্পূর্ণ সোর্স কোডটি আপনার গিটহাবে পুশ করে খুব সহজেই <strong>GitHub Pages</strong> অথবা <strong>Vercel</strong>-এ ফ্রি হোস্ট করে ওয়েবে সবসময় ব্যবহার করতে পারবেন:
            </p>
            <div className="bg-slate-900 text-emerald-300 font-mono p-2.5 rounded text-[11px] space-y-1 overflow-x-auto">
              <div># ১. গিট ইনিশিয়ালাইজ করুন এবং রিপোজিটরিতে পুশ করুন:</div>
              <div className="text-slate-200">git init</div>
              <div className="text-slate-200">git add .</div>
              <div className="text-slate-200">git commit -m "CarryBee IT Asset Form Generator"</div>
              <div className="text-slate-200">git branch -M main</div>
              <div className="text-slate-200">git remote add origin https://github.com/YOUR_USERNAME/carrybee-asset-form.git</div>
              <div className="text-slate-200">git push -u origin main</div>
            </div>
            <p className="text-[11px] text-slate-500">
              টিপস: Vercel.com-এ গিয়ে আপনার গিটহাব রিপোটি সিলেক্ট করলেই মাত্র ১ ক্লিকে অটোমেটিক লাইভ ওয়েব লিংক তৈরি হয়ে যাবে!
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                ডাইনামিক ফিল্ড ও টেবিল
              </span>
              <p className="text-slate-600 text-[11px]">
                স্ট্যান্ডার্ড টেবিলে যেকোনো সময় নতুন কলাম (যেমন Serial No, Condition) বা নতুন রো যোগ করা যায়। এছাড়াও ইচ্ছামতো Yellow, Green বা Blue রঙের সাব-টেবিল সেকশন তৈরি করা সম্ভব।
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Printer className="w-3.5 h-3.5 text-amber-600" />
                Pixel-Perfect A4 Print & PDF
              </span>
              <p className="text-slate-600 text-[11px]">
                <strong>Print / PDF</strong> বাটনে চাপ দিলে ব্রাউজার প্রিন্ট ডায়লগ থেকে সরাসরি সঠিক A4 মার্জিন ও লেআউটে সেভ বা প্রিন্ট হবে। কোনো অতিরিক্ত ওয়াটারমার্ক বা ব্লার থাকবে না।
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-4 py-1.5 rounded text-xs"
          >
            বুঝেছি / Close
          </button>
        </div>
      </div>
    </div>
  );
};
