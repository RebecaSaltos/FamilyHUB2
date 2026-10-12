import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Edit2, 
  Trash2, 
  Heart, 
  Sparkles, 
  Phone, 
  Mail, 
  Shield, 
  CheckCircle2,
  ExternalLink,
  Edit3,
  KeyRound,
  LogIn
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember } from '../../types';

export const FamilyTab: React.FC = () => {
  const { 
    familyName, 
    setFamilyName, 
    members, 
    addMember, 
    updateMember, 
    deleteMember, 
    activeMemberId, 
    setActiveMemberId, 
    inviteCode,
    currentUser,
    openAuthModal,
    showToast 
  } = useFamily();

  const [copied, setCopied] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  // New Member Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<FamilyMember['role']>('Hijo');
  const [newAvatar, setNewAvatar] = useState('🧑');
  const [newColor, setNewColor] = useState('#6366f1');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBloodType, setNewBloodType] = useState('0+');
  const [newAllergies, setNewAllergies] = useState('');
  const [newEmergencyContact, setNewEmergencyContact] = useState('');
  const [newMedicalNotes, setNewMedicalNotes] = useState('');

  const avatarChoices = ['👩‍💼', '👨‍🔧', '👧', '👦', '👵', '👴', '🧑‍🎨', '👩‍⚕️', '👨‍🎓', '🐶', '🐱'];
  const colorChoices = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#6366f1', '#e11d48'];

  const inviteUrl = `${window.location.origin}?invitacion=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    showToast('Enlace de invitación copiado al portapapeles', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addMember({
      name: newName.trim(),
      role: newRole,
      avatar: newAvatar,
      color: newColor,
      email: newEmail.trim() || undefined,
      phone: newPhone.trim() || undefined,
      bloodType: newBloodType,
      allergies: newAllergies ? newAllergies.split(',').map(s => s.trim()).filter(Boolean) : [],
      emergencyContact: newEmergencyContact.trim() || undefined,
      medicalNotes: newMedicalNotes.trim() || undefined,
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewAllergies('');
    setNewEmergencyContact('');
    setNewMedicalNotes('');
    setShowAddMemberModal(false);
  };

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    updateMember(editingMember.id, {
      name: editingMember.name,
      role: editingMember.role,
      avatar: editingMember.avatar,
      color: editingMember.color,
      email: editingMember.email,
      phone: editingMember.phone,
      bloodType: editingMember.bloodType,
      allergies: Array.isArray(editingMember.allergies) 
        ? editingMember.allergies 
        : typeof editingMember.allergies === 'string'
        ? (editingMember.allergies as string).split(',').map(s => s.trim()).filter(Boolean)
        : [],
      emergencyContact: editingMember.emergencyContact,
      medicalNotes: editingMember.medicalNotes,
    });

    setEditingMember(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            Familia & Perfiles Editables
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Personaliza el perfil completo de cada miembro: nombre, correo, tipo de sangre, alergias y contactos.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto flex-wrap gap-y-2">
          {!currentUser ? (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 transition-colors"
            >
              <LogIn className="w-4 h-4 text-indigo-600" />
              <span>Autenticar con Correo</span>
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Conectado: {currentUser.email}</span>
            </div>
          )}

          <button
            onClick={() => setShowAddMemberModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Agregar Miembro</span>
          </button>
        </div>
      </div>

      {/* Invitation Link Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
              <Share2 className="w-3.5 h-3.5" />
              <span>Invitaciones para tu Hogar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Invita a nuevos miembros con este enlace
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Tus familiares solo deben abrir este enlace o ingresar con su correo electrónico para sincronizar tareas, gastos, calendario y salud.
            </p>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 bg-white/10 border border-white/25 rounded-2xl px-4 py-3 text-xs sm:text-sm font-mono text-white outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xs sm:text-sm transition-colors shrink-0 shadow-md"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center flex flex-col items-center justify-center shrink-0 self-start md:self-auto">
            <div className="bg-white p-2 rounded-xl mb-2 text-stone-900">
              <QrCode className="w-20 h-20" />
            </div>
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-200">
              CÓDIGO: {inviteCode}
            </span>
            <span className="text-[10px] text-white/70 mt-0.5">Escanea con tu cámara móvil</span>
          </div>
        </div>
      </div>

      {/* Household Members List (With prominent EDIT buttons on every single profile) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
              Perfiles Familiares ({members.length})
            </h2>
            <p className="text-xs text-stone-500">
              Puedes editar cualquier dato personal o de salud tocando el botón "✏️ Editar Perfil".
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {members.map(member => {
            const isActive = activeMemberId === member.id;
            return (
              <div
                key={member.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between shadow-xs ${
                  isActive
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-500 dark:border-indigo-600 ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0"
                        style={{ backgroundColor: `${member.color}25` }}
                      >
                        {member.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-black text-stone-900 dark:text-white truncate">
                            {member.name}
                          </h3>
                          {isActive && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                              Viendo como
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Prominent Edit and Delete buttons */}
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition-colors"
                        title="Editar perfil completo de este miembro"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => deleteMember(member.id)}
                        className="p-1.5 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="Eliminar de la familia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Personal & Health Details */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-700/70 space-y-2.5 text-xs">
                    
                    {/* Blood type & Allergies highlight */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                      <span className="text-stone-500 font-semibold flex items-center gap-1">
                        🩸 Tipo de sangre:
                      </span>
                      <span className="font-black text-rose-600 dark:text-rose-400 text-xs px-2 py-0.5 bg-rose-50 dark:bg-rose-950/50 rounded-lg">
                        {member.bloodType || 'A+'}
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-500 font-semibold block mb-1">
                        ⚠️ Alergias:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {member.allergies && member.allergies.length > 0 ? (
                          member.allergies.map((alg, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                              {alg}
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-400 italic">Ninguna alergia registrada</span>
                        )}
                      </div>
                    </div>

                    {member.email && (
                      <div className="flex items-center space-x-2 text-stone-600 dark:text-stone-300 pt-1">
                        <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate font-mono text-[11px]">{member.email}</span>
                      </div>
                    )}

                    {member.phone && (
                      <div className="flex items-center space-x-2 text-stone-600 dark:text-stone-300">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{member.phone}</span>
                      </div>
                    )}

                    {member.emergencyContact && (
                      <div className="pt-1 text-[11px] text-stone-500">
                        <span className="font-semibold text-stone-600 dark:text-stone-400">Contacto emergencia: </span>
                        <span>{member.emergencyContact}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row Actions */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setActiveMemberId(member.id);
                      showToast(`Navegando como ${member.name}`, 'info');
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isActive ? 'Perfil Activo' : 'Ver como este perfil'}</span>
                  </button>

                  <button
                    onClick={() => setEditingMember(member)}
                    className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-indigo-600 font-bold text-xs"
                    title="Editar información"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add Member */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                Agregar Nuevo Miembro
              </h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-stone-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleCreateMember} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Nombre completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mateo Morales, Abuela Carmen..."
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Rol en la familia</label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    <option value="Mamá">Mamá</option>
                    <option value="Papá">Papá</option>
                    <option value="Hijo">Hijo</option>
                    <option value="Hija">Hija</option>
                    <option value="Abuelo">Abuelo</option>
                    <option value="Abuela">Abuela</option>
                    <option value="Tutor">Tutor / Pareja</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Grupo Sanguíneo (Salud)</label>
                  <select
                    value={newBloodType}
                    onChange={e => setNewBloodType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="0+">0+</option>
                    <option value="0-">0-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* Avatar choices */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Elige un Avatar</label>
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {avatarChoices.map(av => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setNewAvatar(av)}
                      className={`text-2xl p-2 rounded-xl border transition-all ${
                        newAvatar === av ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 scale-110' : 'border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color choices */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Color de perfil</label>
                <div className="flex items-center space-x-2">
                  {colorChoices.map(col => (
                    <button
                      type="button"
                      key={col}
                      onClick={() => setNewColor(col)}
                      className={`w-7 h-7 rounded-full transition-transform ${newColor === col ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Email para iniciar sesión</label>
                  <input
                    type="email"
                    placeholder="email@ejemplo.com"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+34 600 000 000"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Alergias Conocidas (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="Ej. Polen, Penicilina, Frutos secos..."
                  value={newAllergies}
                  onChange={e => setNewAllergies(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Contacto de Emergencia</label>
                <input
                  type="text"
                  placeholder="Ej. Nombre y teléfono de emergencia"
                  value={newEmergencyContact}
                  onChange={e => setNewEmergencyContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                >
                  Guardar Miembro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: EDIT MEMBER PROFILE FULLY (Name, Role, Blood, Allergies, Email, Phone, Medical Notes) */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                Editar Perfil Completo: {editingMember.name}
              </h3>
              <button onClick={() => setEditingMember(null)} className="text-stone-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleUpdateMember} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Rol</label>
                  <select
                    value={editingMember.role}
                    onChange={e => setEditingMember({ ...editingMember, role: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    <option value="Mamá">Mamá</option>
                    <option value="Papá">Papá</option>
                    <option value="Hijo">Hijo</option>
                    <option value="Hija">Hija</option>
                    <option value="Abuelo">Abuelo</option>
                    <option value="Abuela">Abuela</option>
                    <option value="Tutor">Tutor / Pareja</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    🩸 Tipo de Sangre
                  </label>
                  <select
                    value={editingMember.bloodType || 'A+'}
                    onChange={e => setEditingMember({ ...editingMember, bloodType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="0+">0+</option>
                    <option value="0-">0-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  ⚠️ Alergias Conocidas (separadas por comas)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Penicilina, Polen, Frutos secos"
                  value={Array.isArray(editingMember.allergies) ? editingMember.allergies.join(', ') : (editingMember.allergies || '')}
                  onChange={e => setEditingMember({ ...editingMember, allergies: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              {/* Avatar choices */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Avatar</label>
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                  {avatarChoices.map(av => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setEditingMember({ ...editingMember, avatar: av })}
                      className={`text-xl p-1.5 rounded-xl border transition-all ${
                        editingMember.avatar === av ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 scale-110' : 'border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color choices */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Color de perfil</label>
                <div className="flex items-center space-x-2">
                  {colorChoices.map(col => (
                    <button
                      type="button"
                      key={col}
                      onClick={() => setEditingMember({ ...editingMember, color: col })}
                      className={`w-7 h-7 rounded-full transition-transform ${editingMember.color === col ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Correo Electrónico (Login)</label>
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={editingMember.phone || ''}
                    onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Contacto de Emergencia</label>
                <input
                  type="text"
                  placeholder="Ej. Nombre y número de teléfono"
                  value={editingMember.emergencyContact || ''}
                  onChange={e => setEditingMember({ ...editingMember, emergencyContact: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Notas Médicas y Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Condiciones médicas o recomendaciones..."
                  value={editingMember.medicalNotes || ''}
                  onChange={e => setEditingMember({ ...editingMember, medicalNotes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                >
                  Guardar Cambios del Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
