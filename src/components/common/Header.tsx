import React, { useState } from 'react';
import { 
  Users, 
  Moon, 
  Sun, 
  Share2, 
  Check, 
  Copy, 
  ChevronDown, 
  HeartHandshake,
  QrCode,
  Bell,
  LogIn,
  LogOut,
  Edit2,
  Shield,
  UserCheck,
  Mail,
  Send,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const Header: React.FC = () => {
  const { 
    familyName, 
    setFamilyName,
    members, 
    activeMemberId, 
    setActiveMemberId, 
    darkMode, 
    toggleDarkMode,
    inviteCode,
    showToast,
    tasks,
    events,
    medications,
    chores,
    currentUser,
    sentEmails,
    sendEmailReminder,
    clearSentEmails,
    browserNotificationsEnabled,
    requestBrowserNotifications,
    openAuthModal,
    logout,
    setActiveTab
  } = useFamily();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState<'avisos' | 'historial'>('avisos');
  const [isEditingFamilyName, setIsEditingFamilyName] = useState(false);
  const [tempFamilyName, setTempFamilyName] = useState(familyName);

  const activeMember = members.find(m => m.id === activeMemberId);

  // Quick stats
  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const pendingMedsCount = medications.filter(m => !m.takenToday).length;
  const pendingChoresCount = chores.filter(c => !c.completedToday).length;
  const totalAlerts = pendingMedsCount + (pendingChoresCount > 0 ? 1 : 0);

  const handleSendDailyDigest = () => {
    const targetEmail = currentUser?.email || 'lachicadelaesquinita@gmail.com';
    sendEmailReminder({
      to: targetEmail,
      subject: `Resumen Familiar FamiliApp (${familyName})`,
      body: `Hola ${currentUser?.name || 'Familia'}, aquí tienes el estado de hoy: ${pendingTasksCount} tareas pendientes, ${pendingChoresCount} turnos activos y ${pendingMedsCount} medicinas pendientes por confirmar.`,
      sourceType: 'calendario'
    });
  };

  const inviteUrl = `${window.location.origin}?invitacion=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    showToast('Enlace de invitación copiado al portapapeles', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveFamilyName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempFamilyName.trim()) {
      setFamilyName(tempFamilyName.trim());
      setIsEditingFamilyName(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Logo & Family name with quick inline edit */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={() => setActiveTab('resumen')}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 active:scale-95 transition-transform cursor-pointer"
              title="Ir al inicio"
            >
              <HeartHandshake className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span 
                  onClick={() => setActiveTab('resumen')}
                  className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-white cursor-pointer"
                >
                  Famili<span className="text-indigo-600 dark:text-indigo-400">App</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Hogar Conectado
                </span>
              </div>

              {isEditingFamilyName ? (
                <form onSubmit={handleSaveFamilyName} className="flex items-center space-x-1.5 mt-0.5">
                  <input
                    type="text"
                    value={tempFamilyName}
                    onChange={e => setTempFamilyName(e.target.value)}
                    className="text-xs px-2 py-0.5 rounded-lg border border-indigo-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-white outline-none"
                    autoFocus
                  />
                  <button type="submit" className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    Guardar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingFamilyName(false)}
                    className="text-[11px] text-stone-400"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <div className="flex items-center space-x-1.5 group">
                  <p className="text-xs sm:text-sm font-medium text-stone-500 dark:text-stone-400 truncate max-w-[160px] sm:max-w-xs">
                    {familyName}
                  </p>
                  <button
                    onClick={() => {
                      setTempFamilyName(familyName);
                      setIsEditingFamilyName(true);
                    }}
                    className="p-1 text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
                    title="Editar nombre de la familia"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions & Profiles */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Account / Profile Badge with Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-750 transition-all text-left group"
                  title="Gestionar perfil y cuenta"
                  aria-label="Menú de perfil"
                >
                  <div 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm shadow-inner"
                    style={{ backgroundColor: activeMember?.color ? `${activeMember.color}25` : '#e2e8f0' }}
                  >
                    {activeMember ? activeMember.avatar : currentUser.avatar}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-extrabold leading-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      {currentUser.email.split('@')[0]}
                    </div>
                    <div className="text-xs font-bold text-stone-800 dark:text-stone-200 leading-tight truncate max-w-[110px]">
                      {activeMember ? activeMember.name.split(' ')[0] : currentUser.name}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200 transition-transform" />
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfileDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl shadow-stone-900/10 dark:shadow-black/40 z-50 py-2 divide-y divide-stone-100 dark:divide-stone-700/50 animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* Current Authenticated User Info */}
                      <div className="px-3.5 py-2.5 bg-stone-50 dark:bg-stone-850/60 rounded-t-xl">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{currentUser.avatar}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                              {currentUser.name}
                            </p>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono truncate flex items-center gap-1">
                              <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                              {currentUser.email}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveTab('familia');
                            setProfileDropdownOpen(false);
                          }}
                          className="mt-2 w-full py-1.5 px-2 bg-white dark:bg-stone-750 hover:bg-stone-100 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar Mi Perfil & Salud</span>
                        </button>
                      </div>

                      {/* Switch Active Member View */}
                      <div className="py-1">
                        <div className="px-3 py-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Navegar como:
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setActiveMemberId('all');
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2 text-xs text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors ${
                            activeMemberId === 'all' ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-bold text-indigo-600 dark:text-indigo-400' : 'text-stone-700 dark:text-stone-200'
                          }`}
                        >
                          <span className="text-base">🏡</span>
                          <div className="flex-1">
                            <p className="text-xs">Toda la Familia</p>
                          </div>
                          {activeMemberId === 'all' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </button>

                        {members.map(member => (
                          <button
                            key={member.id}
                            onClick={() => {
                              setActiveMemberId(member.id);
                              setProfileDropdownOpen(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2 text-xs text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors ${
                              activeMemberId === member.id ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-bold text-indigo-600 dark:text-indigo-400' : 'text-stone-700 dark:text-stone-200'
                            }`}
                          >
                            <span className="text-base">{member.avatar}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs truncate">{member.name}</p>
                              <p className="text-[10px] text-stone-400 truncate">{member.role}</p>
                            </div>
                            {activeMemberId === member.id && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                          </button>
                        ))}
                      </div>

                      {/* Switch Account or Logout */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            openAuthModal('login');
                          }}
                          className="w-full flex items-center space-x-2 px-3.5 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/50"
                        >
                          <UserCheck className="w-4 h-4 text-indigo-500" />
                          <span>Cambiar de cuenta</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center space-x-2 px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Cerrar sesión</span>
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar con Correo</span>
              </button>
            )}

            {/* Quick alert indicator */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 sm:p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                title="Notificaciones y avisos"
                aria-label="Ver avisos de la familia"
              >
                <Bell className="w-5 h-5" />
                {totalAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {totalAlerts}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xl z-50 p-4 sm:p-5 animate-in fade-in zoom-in-95 duration-150">
                    
                    {/* Header with Tabs */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-700">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setNotifTab('avisos')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            notifTab === 'avisos'
                              ? 'bg-indigo-600 text-white'
                              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                          }`}
                        >
                          Alertas & Recordatorios
                        </button>
                        <button
                          onClick={() => setNotifTab('historial')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            notifTab === 'historial'
                              ? 'bg-indigo-600 text-white'
                              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                          }`}
                        >
                          Correos ({sentEmails.length})
                        </button>
                      </div>

                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs p-1"
                      >
                        ✕
                      </button>
                    </div>

                    {notifTab === 'avisos' ? (
                      <div className="mt-3 space-y-2.5 text-xs">
                        
                        {/* Browser Push Permission card */}
                        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                              <Bell className="w-4 h-4 text-indigo-600" />
                              Notificaciones Push
                            </span>
                            {browserNotificationsEnabled ? (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                                Activas ✓
                              </span>
                            ) : (
                              <button
                                onClick={requestBrowserNotifications}
                                className="text-[10px] font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-lg hover:bg-indigo-700"
                              >
                                Activar en Navegador
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Summary of pending items */}
                        {pendingMedsCount > 0 ? (
                          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200">
                            💊 {pendingMedsCount} medicamentos pendientes por tomar hoy
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                            ✓ Medicinas del día al corriente
                          </div>
                        )}
                        
                        {pendingChoresCount > 0 && (
                          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200">
                            🧹 {pendingChoresCount} turnos de tareas asignados hoy
                          </div>
                        )}

                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-700/40 text-stone-600 dark:text-stone-300">
                          📋 {pendingTasksCount} tareas pendientes en lista compartida
                        </div>

                        {/* Upcoming Events */}
                        {events.length > 0 && (
                          <div className="pt-2 border-t border-stone-100 dark:border-stone-700">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                              Próximos eventos en calendario:
                            </span>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                              {events.slice(0, 3).map(ev => (
                                <div 
                                  key={ev.id} 
                                  onClick={() => { setActiveTab('calendario'); setShowNotifications(false); }}
                                  className="p-2 rounded-xl bg-stone-50 dark:bg-stone-850 hover:bg-indigo-50/50 cursor-pointer flex items-center justify-between transition-colors"
                                >
                                  <div>
                                    <p className="font-bold text-stone-900 dark:text-white truncate max-w-[170px]">{ev.title}</p>
                                    <p className="text-[10px] text-stone-400">{ev.date} {ev.time && `• ${ev.time}`}</p>
                                  </div>
                                  <span className="text-[10px] text-indigo-600 font-semibold">{ev.reminderMinutes}m</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CTA Send Daily Digest to Email */}
                        <button
                          onClick={handleSendDailyDigest}
                          className="w-full mt-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar Resumen de Hoy a mi Correo</span>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2 text-xs">
                        {sentEmails.length === 0 ? (
                          <div className="text-center py-8 text-stone-400">
                            <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p>No hay correos enviados todavía.</p>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between pb-1">
                              <span className="text-[10px] font-bold uppercase text-stone-400">
                                Registro de Alertas Enviadas
                              </span>
                              <button
                                onClick={clearSentEmails}
                                className="text-[10px] text-rose-500 hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Vaciar</span>
                              </button>
                            </div>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                              {sentEmails.map(mail => (
                                <div
                                  key={mail.id}
                                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-700/60 space-y-1"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-stone-900 dark:text-white truncate max-w-[180px]">
                                      {mail.subject}
                                    </span>
                                    <span className="text-[10px] text-stone-400 shrink-0">{mail.date}</span>
                                  </div>
                                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                                    Para: <span className="font-mono text-indigo-600 dark:text-indigo-400">{mail.to}</span>
                                  </p>
                                  <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2">
                                    {mail.body}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                  </div>
                </>
              )}
            </div>

            {/* Invite button */}
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              title="Invitar miembro de la familia"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Invitar</span>
            </button>

            {/* Dark mode switch */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 sm:p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Alternar modo oscuro"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">Invitar al Hogar</h3>
                  <p className="text-xs text-stone-500">{familyName}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                Comparte este enlace o código con tu pareja, hijos o familiares para sincronizar tareas, gastos y calendarios en tiempo real.
              </p>

              <div className="bg-stone-50 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Código de la Familia
                </div>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-widest font-mono">
                  {inviteCode}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5 block">
                  Enlace directo de invitación
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-mono text-stone-700 dark:text-stone-300 outline-none select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 gap-3">
                <QrCode className="w-8 h-8 text-stone-500" />
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  Cualquier miembro con este enlace podrá unirse de inmediato ingresando con su correo.
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-100 font-bold text-sm rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
