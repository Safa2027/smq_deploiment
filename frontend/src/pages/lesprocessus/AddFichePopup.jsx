export default function AddFichePopup({ processName, onUpload, onForm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[#2F4157]/30"
      onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-6 w-80 space-y-4"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#2F4157]">Déposer la fiche</h2>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#567C8E] text-lg cursor-pointer">
            ×
          </button>
        </div>


        <p className="text-xs text-[#567C8E]">Choisissez comment vous souhaitez déposer la fiche :</p>

        {/* Upload fichier */}
        <label className="flex items-center gap-3 p-3 border border-[#C8D9E6] rounded-lg cursor-pointer hover:bg-[#f0f4f8] transition-colors">
          <div className="w-9 h-9 rounded-lg bg-[#EEF4F8] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#567C8E" strokeWidth="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="11" x2="12" y2="17"/>
              <line x1="9" y1="14" x2="15" y2="14"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-[#2F4157]">Importer un fichier</p>
            <p className="text-[11px] text-[#567C8E]">PDF depuis votre ordinateur</p>
          </div>
          <input type="file" className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={e => { if (e.target.files[0]) onUpload(e.target.files[0]); }} />
        </label>

        {/* Formulaire */}
        <button onClick={onForm}
          className="w-full flex items-center gap-3 p-3 border border-[#C8D9E6] rounded-lg hover:bg-[#f0f4f8] transition-colors text-left">
          <div className="w-9 h-9 rounded-lg bg-[#EEF4F8] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#567C8E" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="7" y1="8" x2="17" y2="8"/>
              <line x1="7" y1="12" x2="17" y2="12"/>
              <line x1="7" y1="16" x2="11" y2="16"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-[#2F4157]">Remplir le formulaire</p>
            <p className="text-[11px] text-[#567C8E]">Saisir les informations manuellement</p>
          </div>
        </button>

      </div>
    </div>
  );
}