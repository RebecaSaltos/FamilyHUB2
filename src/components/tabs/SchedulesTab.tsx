import React, { useState } from 'react';
import { 
  Clock, 
  RotateCw, 
  CheckCircle2, 
  ArrowRightLeft, 
  Plus, 
  User, 
  Sparkles, 
  Calendar,
  Check,
  AlertCircle,
  Edit3,
  Trash2
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { ChoreRotation } from '../../types';

export const SchedulesTab: React.FC = () => {
  const { 
    chores, 
    rotateChore, 
    toggleChoreCompleted, 
    swapChoreMember, 
    addChore, 
    updateChore,
    deleteChore,
    members,
    activeMemberId,
    showToast 
  } = useFamily();

  const [showNewChoreModal, setShowNewChoreModal] = useState(false);
  const [editingChore, setEditingChore] = useState<ChoreRotation | null>(null);
  const [swapModalChore, setSwapModalChore] = useState<ChoreRotation | null>(null);
  const [swapTargetMember, setSwapTargetMember] = useState<string>(members[0]?.id || '');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'diaria' | 'semanal'>('diaria');
  const [icon, setIcon] = useState('🧹');
  const [selectedMembersOrder, setSelectedMembersOrder] = useState<string[]>(members.map(m => m.id));

  const popularIcons = ['🍽️', '🐕', '🗑️', '🧼', '🧺', '🌱', '🍳', '🧹', '📦', '🛒'];

  const openEditChore = (chore: ChoreRotation) => {
    setEditingChore(chore);
    setName(chore.name);
    setDescription(chore.description);
    setFrequency(chore.frequency);
    setIcon(chore.icon);
    setSelectedMembersOrder(chore.membersOrder);
  };

  const handleCreateChore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingChore) {
      updateChore(editingChore.id, {
        name: name.trim(),
        description: description.trim(),
        frequency,
        icon: icon || '🧹',
        membersOrder: selectedMembersOrder.length > 0 ? selectedMembersOrder : editingChore.membersOrder,
      });
      setEditingChore(null);
    } else {
      addChore({
        name: name.trim(),
        description: description.trim(),
        frequency,
        membersOrder: selectedMembersOrder.length > 0 ? selectedMembersOrder : members.map(m => m.id),
        icon: icon || '🧹',
      });
      setShowNewChoreModal(false);
    }

    setName('');
    setDescription('');
  };

  const handleExecuteSwap = () => {
    if (swapModalChore && swapTargetMember) {
      swapChoreMember(swapModalChore.id, swapTargetMember);
      setSwapModalChore(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Horarios & Turnos Rotativos
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Distribución equitativa y rotación automática de tareas y responsabilidades del hogar.
          </p>
        </div>

        <button
          onClick={() => setShowNewChoreModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Turno Rotativo</span>
        </button>
      </div>

      {/* Chores Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {chores.map((chore) => {
          const currentMemberId = chore.membersOrder[chore.currentMemberIndex];
          const currentMember = members.find(m => m.id === currentMemberId);
          const nextIndex = (chore.currentMemberIndex + 1) % chore.membersOrder.length;
          const nextMemberId = chore.membersOrder[nextIndex];
          const nextMember = members.find(m => m.id === nextMemberId);

          const isCurrentActive = activeMemberId === 'all' || activeMemberId === currentMemberId;

          return (
            <div
              key={chore.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between shadow-xs ${
                chore.completedToday
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                  : isCurrentActive
                  ? 'bg-white dark:bg-stone-900 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/10'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
              }`}
            >
              <div>
                {/* Top Row: Icon, Title & Frequency */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-stone-100 dark:bg-stone-800 shrink-0">
                      {chore.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          Rotación {chore.frequency}
                        </span>
                        {chore.completedToday && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                            <Check className="w-3 h-3" /> ¡Hecho hoy!
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white mt-1 truncate">
                        {chore.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => openEditChore(chore)}
                      className="p-2 rounded-xl text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Editar turno y frecuencia"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Seguro que deseas eliminar el turno rotativo "${chore.name}"?`)) {
                          deleteChore(chore.id);
                        }
                      }}
                      className="p-2 rounded-xl text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Eliminar este turno rotativo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 mb-5">
                  {chore.description}
                </p>

                {/* Responsible Person Spotlight */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 mb-5">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Le toca ahora a:</span>
                    <span className="text-stone-500 font-normal">Siguiente: {nextMember?.name.split(' ')[0]}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                        style={{ backgroundColor: currentMember?.color ? `${currentMember.color}20` : '#e0e7ff' }}
                      >
                        {currentMember?.avatar || '👤'}
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-black text-stone-900 dark:text-white leading-tight">
                          {currentMember?.name || 'Miembro asignado'}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {currentMember?.role} • En turno activo
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSwapModalChore(chore)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center space-x-1 transition-colors"
                      title="Intercambiar este turno con otro familiar"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      <span className="hidden sm:inline">Cambiar</span>
                    </button>
                  </div>
                </div>

                {/* Rotation Queue visualizer */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Orden de rotación cíclica:
                  </span>
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {chore.membersOrder.map((memId, idx) => {
                      const m = members.find(mem => mem.id === memId);
                      const isCurrent = idx === chore.currentMemberIndex;
                      return (
                        <div
                          key={memId + idx}
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                            isCurrent
                              ? 'bg-indigo-600 text-white font-bold shadow-xs scale-105'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                          }`}
                        >
                          <span>{m?.avatar}</span>
                          <span>{m?.name.split(' ')[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Complete today & Rotate */}
              <div className="flex items-center space-x-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => toggleChoreCompleted(chore.id)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                    chore.completedToday
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{chore.completedToday ? 'Completado ✓' : 'Marcar Hecho'}</span>
                </button>

                <button
                  onClick={() => rotateChore(chore.id)}
                  className="py-3 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-colors"
                  title="Pasar turno al siguiente miembro de la lista"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Rotar Turno</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Swap Chore Turn */}
      {swapModalChore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-700">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
              Intercambiar Turno de {swapModalChore.name}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              ¿Quién asumirá la responsabilidad para este turno en lugar del miembro actual?
            </p>

            <div className="space-y-3">
              {members.map(member => (
                <button
                  key={member.id}
                  onClick={() => setSwapTargetMember(member.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-2xl border text-left transition-all ${
                    swapTargetMember === member.id
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 font-bold'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-2xl">{member.avatar}</span>
                  <div>
                    <p className="text-sm text-stone-900 dark:text-white">{member.name}</p>
                    <p className="text-xs text-stone-400">{member.role}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <button
                onClick={() => setSwapModalChore(null)}
                className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteSwap}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Confirmar Intercambio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New or Edit Chore */}
      {(showNewChoreModal || editingChore) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                {editingChore ? 'Editar Turno Rotativo' : 'Nuevo Turno Rotativo'}
              </h3>
              <button 
                onClick={() => { setShowNewChoreModal(false); setEditingChore(null); }} 
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChore} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Nombre de la responsabilidad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Limpiar el arenero del gato, Sacar reciclaje..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Icono representativo</label>
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {popularIcons.map(ic => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setIcon(ic)}
                      className={`text-2xl p-2 rounded-xl border transition-all ${
                        icon === ic ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 scale-110' : 'border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Frecuencia de rotación</label>
                <select
                  value={frequency}
                  onChange={e => setFrequency(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                >
                  <option value="diaria">Rotación Diaria (cada día rota)</option>
                  <option value="semanal">Rotación Semanal (cada semana rota)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Detalles o instrucciones</label>
                <textarea
                  rows={2}
                  placeholder="Instrucciones sobre cómo realizar la tarea..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                {editingChore ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Seguro que deseas eliminar definitivamente el turno "${editingChore.name}"?`)) {
                        deleteChore(editingChore.id);
                        setEditingChore(null);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar Turno</span>
                  </button>
                ) : <div />}

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => { setShowNewChoreModal(false); setEditingChore(null); }}
                    className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                  >
                    {editingChore ? 'Guardar Cambios' : 'Crear Turno Rotativo'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
