import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Heart, 
  Trash2, 
  Upload, 
  X, 
  Download, 
  FolderPlus, 
  Tag, 
  Calendar, 
  Sparkles,
  Users
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { GalleryPhoto, GalleryAlbum } from '../../types';

export const GalleryTab: React.FC = () => {
  const { 
    albums, 
    photos, 
    addPhoto, 
    deletePhoto, 
    likePhoto, 
    addAlbum, 
    members,
    showToast 
  } = useFamily();

  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewAlbumModal, setShowNewAlbumModal] = useState(false);

  // New photo form state
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoAlbum, setPhotoAlbum] = useState(albums[0]?.id || 'alb-1');
  const [photoDate, setPhotoDate] = useState(new Date().toISOString().split('T')[0]);
  const [taggedMembers, setTaggedMembers] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');

  // New album form state
  const [albumName, setAlbumName] = useState('');
  const [albumCover, setAlbumCover] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!photoTitle) setPhotoTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoUrl) return;

    addPhoto({
      title: photoTitle.trim(),
      imageUrl: photoUrl,
      album: photoAlbum,
      date: photoDate,
      taggedMembers,
    });

    setPhotoTitle('');
    setPhotoUrl('');
    setTaggedMembers([]);
    setShowUploadModal(false);
  };

  const handleSaveAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumName.trim()) return;

    addAlbum({
      name: albumName.trim(),
      coverUrl: albumCover.trim() || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
      description: albumDesc.trim() || undefined,
    });

    setAlbumName('');
    setAlbumCover('');
    setAlbumDesc('');
    setShowNewAlbumModal(false);
  };

  const filteredPhotos = photos.filter(p => {
    if (selectedAlbum === 'all') return true;
    return p.album === selectedAlbum;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Galería Familiar Segura
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Un espacio privado para fotos del hogar, viajes familiares y momentos especiales.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setShowNewAlbumModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Nuevo Álbum</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Subir Foto</span>
          </button>
        </div>
      </div>

      {/* Albums Carousel / Selector (Big Touch) */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedAlbum('all')}
          className={`flex-shrink-0 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
            selectedAlbum === 'all'
              ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-md'
              : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-50'
          }`}
        >
          <span>📸 Todas las Fotos ({photos.length})</span>
        </button>

        {albums.map(alb => {
          const isSelected = selectedAlbum === alb.id;
          const albCount = photos.filter(p => p.album === alb.id).length;
          return (
            <button
              key={alb.id}
              onClick={() => setSelectedAlbum(alb.id)}
              className={`flex-shrink-0 flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-50'
              }`}
            >
              <img 
                src={alb.coverUrl} 
                alt={alb.name} 
                className="w-8 h-8 rounded-xl object-cover shrink-0" 
              />
              <div className="text-left">
                <span className="block truncate max-w-[130px]">{alb.name}</span>
                <span className={`text-[10px] font-normal block ${isSelected ? 'text-indigo-100' : 'text-stone-400'}`}>
                  {albCount} fotos
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {filteredPhotos.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
            <ImageIcon className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">Álbum vacío</h3>
            <p className="text-xs text-stone-400 mt-1">Sube fotos familiares para guardar los recuerdos.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Subir primera foto</span>
            </button>
          </div>
        ) : (
          filteredPhotos.map(photo => {
            const alb = albums.find(a => a.id === photo.album);
            return (
              <div
                key={photo.id}
                className="group relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Photo Image Aspect 4:3 */}
                <div 
                  className="aspect-4/3 w-full bg-stone-100 dark:bg-stone-800 relative cursor-pointer overflow-hidden"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold flex items-center gap-1.5">
                      Ver foto en grande
                    </span>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-stone-900 dark:text-white line-clamp-1">
                        {photo.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          likePhoto(photo.id);
                        }}
                        className="flex items-center space-x-1 text-xs text-rose-500 font-bold hover:scale-110 transition-transform shrink-0"
                        title="Me gusta"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        <span>{photo.likes}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-stone-400 mt-1">
                      <span>{alb?.name.split(' ')[0]}</span>
                      <span>•</span>
                      <span>{photo.date}</span>
                    </div>
                  </div>

                  {/* Tagged members */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      {photo.taggedMembers.map(mId => {
                        const m = members.find(mem => mem.id === mId);
                        return m ? (
                          <span key={mId} className="text-sm" title={m.name}>
                            {m.avatar}
                          </span>
                        ) : null;
                      })}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePhoto(photo.id);
                      }}
                      className="text-stone-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 text-white">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] flex items-center justify-center bg-black/90">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>

            <div className="p-6 bg-stone-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white">{selectedPhoto.title}</h3>
                <p className="text-xs text-stone-400 mt-0.5">Capturado el {selectedPhoto.date}</p>
                <div className="flex items-center space-x-1.5 mt-2">
                  <span className="text-xs text-stone-400">En la foto:</span>
                  {selectedPhoto.taggedMembers.map(mId => {
                    const m = members.find(mem => mem.id === mId);
                    return m ? (
                      <span key={mId} className="text-xs font-semibold px-2 py-0.5 bg-stone-800 rounded-lg">
                        {m.avatar} {m.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    likePhoto(selectedPhoto.id);
                    setSelectedPhoto(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{selectedPhoto.likes} Me Gusta</span>
                </button>

                <button
                  onClick={() => {
                    showToast('Descarga iniciada con éxito', 'success');
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload Photo */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Subir Foto a la Galería Familiar
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-stone-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleSavePhoto} className="mt-4 space-y-4">
              
              <div className="border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl p-4 text-center hover:border-indigo-500 transition-colors">
                <input
                  type="file"
                  id="photo-file-input"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <label htmlFor="photo-file-input" className="cursor-pointer block">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="max-h-36 mx-auto rounded-xl object-contain mb-2" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  )}
                  <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
                    {photoUrl ? 'Cambiar imagen' : 'Seleccionar foto desde la cámara o galería'}
                  </p>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Título del recuerdo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cumpleaños de Sofía, Paseo con Toby..."
                  value={photoTitle}
                  onChange={e => setPhotoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Álbum</label>
                  <select
                    value={photoAlbum}
                    onChange={e => setPhotoAlbum(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    {albums.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={photoDate}
                    onChange={e => setPhotoDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Etiquetar a miembros</label>
                <div className="flex flex-wrap gap-2">
                  {members.map(m => {
                    const isTagged = taggedMembers.includes(m.id);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => {
                          setTaggedMembers(prev => 
                            prev.includes(m.id) ? prev.filter(id => id !== m.id) : [...prev, m.id]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isTagged
                            ? 'bg-indigo-600 text-white'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {m.avatar} {m.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
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
                  disabled={!photoUrl}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm"
                >
                  Guardar en Álbum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Album */}
      {showNewAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-700">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Crear Nuevo Álbum Familiar</h3>
            
            <form onSubmit={handleSaveAlbum} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Nombre del álbum *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Navidad 2026, Viaje a Roma..."
                  value={albumName}
                  onChange={e => setAlbumName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="De qué trata este álbum..."
                  value={albumDesc}
                  onChange={e => setAlbumDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewAlbumModal(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Crear Álbum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
