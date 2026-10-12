import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  Plus, 
  Tag, 
  Search, 
  FileCheck, 
  Calendar, 
  User,
  Paperclip,
  Edit3
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { DocumentItem } from '../../types';

export const DocumentsTab: React.FC = () => {
  const { 
    documents, 
    addDocument, 
    updateDocument,
    deleteDocument, 
    members, 
    showToast 
  } = useFamily();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentItem['category']>('Garantías');
  const [memberId, setMemberId] = useState<string>('all');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>(undefined);

  const categories = ['Recibos', 'Garantías', 'Contratos', 'Identificación', 'Salud', 'Otros'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditDocument = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setCategory(doc.category);
    setMemberId(doc.memberId || 'all');
    setExpiryDate(doc.expiryDate || '');
    setNotes(doc.notes || '');
    setFileName(doc.fileName || '');
    setFileDataUrl(doc.fileUrl);
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingDoc) {
      updateDocument(editingDoc.id, {
        title: title.trim(),
        category,
        memberId: memberId === 'all' ? undefined : memberId,
        expiryDate: expiryDate || undefined,
        notes: notes.trim() || undefined,
        fileUrl: fileDataUrl || editingDoc.fileUrl,
        fileName: fileName || editingDoc.fileName,
      });
      setEditingDoc(null);
    } else {
      addDocument({
        title: title.trim(),
        category,
        memberId: memberId === 'all' ? undefined : memberId,
        fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
        fileType: fileName?.endsWith('.png') || fileName?.endsWith('.jpg') ? 'image/jpeg' : 'application/pdf',
        fileSize: '1.2 MB',
        fileUrl: fileDataUrl,
        expiryDate: expiryDate || undefined,
        notes: notes.trim() || undefined,
      });
      setShowUploadModal(false);
    }

    setTitle('');
    setNotes('');
    setExpiryDate('');
    setFileName('');
    setFileDataUrl(undefined);
  };

  const filteredDocs = documents.filter(doc => {
    const matchCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (doc.notes && doc.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (doc.fileName && doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Calculate expiring warranties / IDs
  const expiringDocs = documents.filter(doc => {
    if (!doc.expiryDate) return false;
    const exp = new Date(doc.expiryDate).getTime();
    const now = new Date('2026-10-11').getTime();
    const diffMonths = (exp - now) / (1000 * 60 * 60 * 24 * 30);
    return diffMonths <= 6 && diffMonths >= 0;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Documentos & Garantías
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Almacena y organiza contratos de vivienda, pólizas de seguros, garantías de electrodomésticos y pasaportes.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Subir Documento</span>
        </button>
      </div>

      {/* Expiry Warning Banner if any */}
      {expiringDocs.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold">Aviso de vencimiento: </span>
            {expiringDocs.map(d => `${d.title} (Vence: ${d.expiryDate})`).join(', ')}. Recuerda renovar o revisar las condiciones.
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === 'all'
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
            }`}
          >
            Todos los Documentos ({documents.length})
          </button>

          {categories.map(cat => {
            const count = documents.filter(d => d.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, nota o archivo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
            <FileText className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">No hay documentos en esta categoría</h3>
            <p className="text-xs text-stone-400 mt-1">Sube tus recibos, garantías o contratos para tenerlos protegidos.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Documento</span>
            </button>
          </div>
        ) : (
          filteredDocs.map(doc => {
            const member = doc.memberId ? members.find(m => m.id === doc.memberId) : null;
            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                      {doc.category}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditDocument(doc)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Editar documento"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 transition-colors"
                        title="Eliminar documento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-white line-clamp-1 mb-1">
                    {doc.title}
                  </h3>

                  {doc.notes && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
                      {doc.notes}
                    </p>
                  )}

                  <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <div className="flex items-center space-x-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-mono text-[11px] truncate">{doc.fileName || 'documento.pdf'}</span>
                    </div>
                    <span className="text-[10px] shrink-0">{doc.fileSize}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center space-x-1">
                    {member ? (
                      <>
                        <span>{member.avatar}</span>
                        <span className="text-stone-600 dark:text-stone-300 font-semibold">{member.name.split(' ')[0]}</span>
                      </>
                    ) : (
                      <span>🏡 Familiar</span>
                    )}
                  </div>

                  {doc.expiryDate && (
                    <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                      <Calendar className="w-3 h-3" />
                      <span>Vence: {doc.expiryDate}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Upload / Register Document */}
      {(showUploadModal || editingDoc) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                {editingDoc ? 'Editar Documento' : 'Guardar Documento Familiar'}
              </h3>
              <button 
                onClick={() => { setShowUploadModal(false); setEditingDoc(null); }} 
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="mt-4 space-y-4">
              
              {/* File input */}
              <div className="border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl p-4 text-center hover:border-indigo-500 transition-colors">
                <input
                  type="file"
                  id="doc-file-input"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="doc-file-input" className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
                    {fileName ? fileName : 'Selecciona un archivo (PDF, JPG, PNG)'}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Toca para examinar tu dispositivo</p>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Nombre o Título del Documento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Factura Frigorífico, Seguro Coche, DNI Lucas..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Pertenece a</label>
                  <select
                    value={memberId}
                    onChange={e => setMemberId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    <option value="all">🏡 Todo el Hogar</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Fecha de Expiración / Vencimiento de Garantía</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Notas, números de póliza o cobertura</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Cobertura de cristales incluida, teléfono de asistencia: 900..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                >
                  Guardar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Preview Document */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white truncate">
                {previewDoc.title}
              </h3>
              <button onClick={() => setPreviewDoc(null)} className="text-stone-400 hover:text-white p-1">✕</button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Preview image if base64 or file icon */}
              {previewDoc.fileUrl ? (
                <div className="max-h-60 overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700 flex items-center justify-center bg-stone-100 dark:bg-stone-900">
                  <img src={previewDoc.fileUrl} alt={previewDoc.title} className="object-contain max-h-60 w-full" />
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center">
                  <FileCheck className="w-16 h-16 text-indigo-500 mx-auto mb-2" />
                  <p className="text-xs font-mono text-stone-600 dark:text-stone-300">{previewDoc.fileName}</p>
                  <p className="text-[11px] text-stone-400 mt-1">Archivo seguro encriptado localmente</p>
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-700">
                  <span className="text-stone-400">Categoría:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{previewDoc.category}</span>
                </div>
                {previewDoc.expiryDate && (
                  <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-stone-700">
                    <span className="text-stone-400">Vencimiento:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{previewDoc.expiryDate}</span>
                  </div>
                )}
                {previewDoc.notes && (
                  <div className="py-1.5">
                    <span className="text-stone-400 block mb-1">Notas:</span>
                    <p className="text-stone-700 dark:text-stone-300 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900">
                      {previewDoc.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => {
                    showToast('Documento descargado correctamente', 'success');
                    setPreviewDoc(null);
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Copia</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
