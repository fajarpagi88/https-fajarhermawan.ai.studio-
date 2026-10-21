import React, { useState } from 'react';
import { Copy, Check, Download, X, AlertTriangle, ExternalLink } from 'lucide-react';

interface ManualPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptText: string;
  onDownloadTxt: () => void;
}

export const ManualPromptModal: React.FC<ManualPromptModalProps> = ({
  isOpen,
  onClose,
  promptText,
  onDownloadTxt,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 border border-white/30 text-white">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Mode Manual Cadangan</h3>
              <p className="text-xs text-amber-100">
                Gunakan jika Gemini API tidak tersedia, kuota limit, atau untuk eksekusi mandiri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-100 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Notice: Does not pretend to have answered automatically */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
            <strong>Catatan Penting:</strong> Mode manual ini menyusun <em>blueprint prompt</em> instruksi terstandar berdasarkan formulir yang telah Anda lengkapi. Mode ini tidak menghasilkan jawaban atau soal secara otomatis di aplikasi, melainkan memberikan teks prompt yang siap Anda salin dan jalankan langsung pada layanan AI (seperti Google Gemini di <code>gemini.google.com</code> atau ChatGPT).
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Teks Prompt Terstruktur SUPM Tegal:
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Prompt Cadangan'}</span>
                </button>
                <button
                  onClick={onDownloadTxt}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Unduh .txt</span>
                </button>
              </div>
            </div>

            <textarea
              readOnly
              rows={12}
              value={promptText}
              className="w-full bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-slate-800 leading-relaxed outline-none select-all resize-none shadow-inner"
            />
          </div>

          {/* Quick steps */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
            <h5 className="font-bold text-slate-900">Langkah Penggunaan Prompt Cadangan:</h5>
            <ol className="list-decimal list-inside space-y-1">
              <li>Klik tombol <strong>"Salin Prompt Cadangan"</strong> di atas.</li>
              <li>Buka <a href="https://gemini.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5">Google Gemini <ExternalLink className="w-3 h-3" /></a> atau AI Studio.</li>
              <li>Tempel (Paste) teks prompt ke dalam kotak chat.</li>
              <li>Tekan Enter, dan salin hasil asesmen yang dihasilkan kembali ke dokumen pengajaran Anda.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
          >
            Selesai / Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
