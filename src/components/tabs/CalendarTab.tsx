import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  Bell, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  ListFilter,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Edit3,
  Mail
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { CalendarEvent } from '../../types';

export const CalendarTab: React.FC = () => {
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    members, 
    activeMemberId,
    currentUser,
    sendEmailReminder,
    browserNotificationsEnabled,
    requestBrowserNotifications,
    showToast 
  } = useFamily();

  // Current view date
  const [currentDate, setCurrentDate] = useState(new Date('2026-10-11'));
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-10-14');
  const [viewMode, setViewMode] = useState<'mes' | 'agenda'>('mes');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterMember, setFilterMember] = useState<string>(activeMemberId);

  // Push notifications state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-10-15');
  const [newTime, setNewTime] = useState('10:00');
  const [newType, setNewType] = useState<CalendarEvent['type']>('familiar');
  const [newAssignee, setNewAssignee] = useState('all');
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newReminder, setNewReminder] = useState('60'); // 60 mins
  const [newNotifyEmail, setNewNotifyEmail] = useState(true);
  const [newTargetEmail, setNewTargetEmail] = useState(currentUser?.email || 'lachicadelaesquinita@gmail.com');

  const handleSendEventEmailNow = (event: CalendarEvent) => {
    const recipient = event.targetEmail || (event.assignedTo !== 'all' ? members.find(m => m.id === event.assignedTo)?.email : null) || currentUser?.email || 'lachicadelaesquinita@gmail.com';
    sendEmailReminder({
      to: recipient,
      subject: `Recordatorio FamiliApp: ${event.title}`,
      body: `Evento programado para el día ${event.date}${event.time ? ` a las ${event.time}` : ''}.${event.location ? ` Ubicación: ${event.location}.` : ''}${event.notes ? ` Notas: "${event.notes}".` : ''}`,
      sourceType: 'calendario'
    });
  };

  const requestPushPermission = () => {
    requestBrowserNotifications();
    setNotificationsEnabled(true);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const emailToSend = newTargetEmail.trim() || currentUser?.email || 'lachicadelaesquinita@gmail.com';

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title: newTitle.trim(),
        date: newDate,
        time: newTime || undefined,
        type: newType,
        assignedTo: newAssignee,
        location: newLocation.trim() || undefined,
        notes: newNotes.trim() || undefined,
        reminderMinutes: parseInt(newReminder, 10),
        notifyEmail: newNotifyEmail,
        targetEmail: emailToSend,
      });

      if (newNotifyEmail) {
        sendEmailReminder({
          to: emailToSend,
          subject: `Actualización de Calendario: ${newTitle.trim()}`,
          body: `El evento ha sido actualizado para el ${newDate}${newTime ? ` a las ${newTime}` : ''}.${newLocation ? ` Lugar: ${newLocation}.` : ''}`,
          sourceType: 'calendario'
        });
      }

      setEditingEvent(null);
    } else {
      addEvent({
        title: newTitle.trim(),
        date: newDate,
        time: newTime || undefined,
        type: newType,
        assignedTo: newAssignee,
        location: newLocation.trim() || undefined,
        notes: newNotes.trim() || undefined,
        reminderMinutes: parseInt(newReminder, 10),
        notifyEmail: newNotifyEmail,
        targetEmail: emailToSend,
      });

      if (newNotifyEmail) {
        sendEmailReminder({
          to: emailToSend,
          subject: `Nuevo Evento Programado: ${newTitle.trim()}`,
          body: `Se ha agendado para el ${newDate}${newTime ? ` a las ${newTime}` : ''}.${newLocation ? ` Lugar: ${newLocation}.` : ''} Se enviará un recordatorio ${newReminder} minutos antes.`,
          sourceType: 'calendario'
        });
      }

      setShowAddEventModal(false);
    }

    setNewTitle('');
    setNewLocation('');
    setNewNotes('');
  };

  const openEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setNewTitle(event.title);
    setNewDate(event.date);
    setNewTime(event.time || '10:00');
    setNewType(event.type);
    setNewAssignee(event.assignedTo);
    setNewLocation(event.location || '');
    setNewNotes(event.notes || '');
    setNewReminder(event.reminderMinutes.toString());
    setNewNotifyEmail(event.notifyEmail ?? true);
    setNewTargetEmail(event.targetEmail || currentUser?.email || 'lachicadelaesquinita@gmail.com');
  };

  // Month generation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Convert to Monday = 0
  const startDayOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Filter events
  const filteredEvents = events.filter(e => {
    const matchType = filterType === 'all' || e.type === filterType;
    const matchMember = filterMember === 'all' || e.assignedTo === filterMember || e.assignedTo === 'all';
    return matchType && matchMember;
  });

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'medica': return 'bg-rose-500 text-white border-rose-600';
      case 'colegio': return 'bg-amber-500 text-white border-amber-600';
      case 'cumpleanos': return 'bg-purple-500 text-white border-purple-600';
      case 'hogar': return 'bg-emerald-500 text-white border-emerald-600';
      default: return 'bg-indigo-500 text-white border-indigo-600';
    }
  };

  const getEventTypeBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'medica': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">Cita Médica</span>;
      case 'colegio': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">Colegio / Trabajo</span>;
      case 'cumpleanos': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">Cumpleaños 🎂</span>;
      case 'hogar': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Hogar</span>;
      default: return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">Familiar</span>;
    }
  };

  const selectedDateEvents = filteredEvents.filter(e => e.date === selectedDateStr);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Calendario Familiar Sincronizado
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Citas médicas, actividades escolares, eventos compartidos y recordatorios con alerta.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Push notification toggle button */}
          <button
            onClick={requestPushPermission}
            className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              notificationsEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>{notificationsEnabled ? 'Alertas Activas ✓' : 'Activar Recordatorios'}</span>
          </button>

          <button
            onClick={() => setShowAddEventModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Evento</span>
          </button>
        </div>
      </div>

      {/* Filter and View Toggle */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* View Switcher */}
        <div className="flex p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('mes')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'mes'
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Vista Mensual
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'agenda'
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Lista de Agenda
          </button>
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 outline-none flex-1 sm:flex-none"
          >
            <option value="all">Todos los tipos</option>
            <option value="familiar">Familiar</option>
            <option value="medica">Cita Médica</option>
            <option value="colegio">Colegio / Trabajo</option>
            <option value="cumpleanos">Cumpleaños</option>
            <option value="hogar">Hogar</option>
          </select>

          <select
            value={filterMember}
            onChange={e => setFilterMember(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 outline-none flex-1 sm:flex-none"
          >
            <option value="all">Todos los miembros</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {viewMode === 'mes' ? (
        /* Month Grid View with selected day details */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            
            {/* Month Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-stone-900 dark:text-white capitalize">
                {monthNames[month]} {year}
              </h2>
              <div className="flex items-center space-x-1">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="text-xs font-black text-stone-400 py-1 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Empty placeholder offset days */}
              {Array.from({ length: startDayOffset }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-2xl bg-transparent" />
              ))}

              {/* Days in Month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isSelected = selectedDateStr === dateStr;
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                const dayEvents = filteredEvents.filter(e => e.date === dateStr);

                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-2xl border flex flex-col justify-between text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : isToday
                        ? 'border-indigo-300 dark:border-indigo-800 bg-stone-50/50 dark:bg-stone-850'
                        : 'border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isToday ? 'w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black' : 'text-stone-700 dark:text-stone-300'
                      }`}>
                        {dayNum}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </div>

                    <div className="space-y-0.5 overflow-hidden w-full">
                      {dayEvents.slice(0, 2).map(ev => (
                        <div 
                          key={ev.id}
                          className={`text-[9px] sm:text-[10px] font-bold px-1 rounded truncate leading-tight ${getEventTypeColor(ev.type)}`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[8px] text-stone-400 font-bold block">
                          +{dayEvents.length - 2} más
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details Panel */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-4">
                <div>
                  <h3 className="font-black text-stone-900 dark:text-white text-base">
                    Eventos del Día
                  </h3>
                  <p className="text-xs text-stone-400 font-semibold">{selectedDateStr}</p>
                </div>
                <button
                  onClick={() => {
                    setNewDate(selectedDateStr);
                    setShowAddEventModal(true);
                  }}
                  className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-10">
                    <CalendarDays className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
                    <p className="text-xs text-stone-400">No hay eventos para esta fecha.</p>
                  </div>
                ) : (
                  selectedDateEvents.map(event => {
                    const assigned = members.find(m => m.id === event.assignedTo);
                    return (
                      <div 
                        key={event.id}
                        className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-700/80 space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                            {event.title}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleSendEventEmailNow(event)}
                              className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1"
                              title="Enviar recordatorio a mi correo electrónico"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditEvent(event)}
                              className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1"
                              title="Editar evento"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="text-stone-400 hover:text-rose-500 p-1 transition-opacity"
                              title="Eliminar evento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                          {getEventTypeBadge(event.type)}
                          {event.time && (
                            <span className="flex items-center text-stone-500 dark:text-stone-400 font-semibold">
                              <Clock className="w-3 h-3 mr-1" /> {event.time}
                            </span>
                          )}
                        </div>

                        {event.location && (
                          <div className="flex items-center text-xs text-stone-500 dark:text-stone-400">
                            <MapPin className="w-3 h-3 mr-1 shrink-0 text-stone-400" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}

                        {event.notes && (
                          <p className="text-xs text-stone-600 dark:text-stone-300 italic bg-white dark:bg-stone-900 p-2 rounded-xl">
                            "{event.notes}"
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/50 dark:border-stone-700/50 text-stone-400">
                          <span className="flex items-center space-x-1 font-semibold text-stone-600 dark:text-stone-300">
                            <span>{assigned ? assigned.avatar : '🏡'}</span>
                            <span>{assigned ? assigned.name : 'Toda la familia'}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-medium">
                            <Bell className="w-3 h-3" />
                            <span>{event.reminderMinutes} min antes</span>
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 text-xs flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Los eventos sincronizados se alertan a los miembros correspondientes.</span>
            </div>
          </div>

        </div>
      ) : (
        /* Agenda / Timeline View */
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <h3 className="text-lg font-black text-stone-900 dark:text-white tracking-tight">
            Próximos Eventos y Citas
          </h3>

          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredEvents.map(event => {
              const assigned = members.find(m => m.id === event.assignedTo);
              return (
                <div key={event.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center shrink-0 font-bold">
                      <span className="text-xs uppercase">{new Date(event.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                      <span className="text-base font-black leading-none">{new Date(event.date).getDate()}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
                          {event.title}
                        </h4>
                        {getEventTypeBadge(event.type)}
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-stone-500 dark:text-stone-400 mt-1 flex-wrap gap-y-1">
                        {event.time && (
                          <span className="flex items-center font-semibold text-stone-700 dark:text-stone-300">
                            <Clock className="w-3.5 h-3.5 mr-1" /> {event.time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400" /> {event.location}
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <span>{assigned ? assigned.avatar : '🏡'}</span>
                          <span>{assigned ? assigned.name : 'Toda la familia'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg flex items-center space-x-1">
                      <Bell className="w-3 h-3" />
                      <span>{event.reminderMinutes}m</span>
                    </span>
                    <button
                      onClick={() => handleSendEventEmailNow(event)}
                      className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1 text-xs"
                      title="Enviar recordatorio a mi correo"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditEvent(event)}
                      className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Editar evento"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-stone-400 hover:text-rose-500 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Eliminar evento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: New or Edit Event */}
      {(showAddEventModal || editingEvent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                {editingEvent ? 'Editar Evento del Calendario' : 'Añadir al Calendario Familiar'}
              </h3>
              <button 
                onClick={() => { setShowAddEventModal(false); setEditingEvent(null); }} 
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Título del evento o cita *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cita con el pediatra, Actuación escolar, Cumpleaños..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Hora</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Tipo de Evento</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    <option value="familiar">Familiar</option>
                    <option value="medica">Cita Médica</option>
                    <option value="colegio">Colegio / Trabajo</option>
                    <option value="cumpleanos">Cumpleaños</option>
                    <option value="hogar">Hogar</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Para quién</label>
                  <select
                    value={newAssignee}
                    onChange={e => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    <option value="all">🏡 Toda la Familia</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Lugar o dirección</label>
                <input
                  type="text"
                  placeholder="Ej. Hospital La Paz, Colegio Los Olivos, etc."
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Recordatorio con anticipación (Notificación Push)</label>
                <select
                  value={newReminder}
                  onChange={e => setNewReminder(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                >
                  <option value="15">15 minutos antes</option>
                  <option value="30">30 minutos antes</option>
                  <option value="60">1 hora antes</option>
                  <option value="120">2 horas antes</option>
                  <option value="1440">1 día antes (24 horas)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newNotifyEmail}
                      onChange={e => setNewNotifyEmail(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>Enviar notificación por correo electrónico</span>
                  </label>
                  <span className="text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400">Recomendado</span>
                </div>

                {newNotifyEmail && (
                  <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                        Correo de destino para la alerta:
                      </label>
                      <input
                        type="email"
                        required={newNotifyEmail}
                        placeholder="tu-correo@ejemplo.com"
                        value={newTargetEmail}
                        onChange={e => setNewTargetEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const target = newTargetEmail.trim() || currentUser?.email || 'lachicadelaesquinita@gmail.com';
                        sendEmailReminder({
                          to: target,
                          subject: `Prueba de Alerta: ${newTitle || 'Evento de Calendario'}`,
                          body: `Confirmación de recordatorio de FamiliApp para la fecha ${newDate} a las ${newTime || '10:00'}.`,
                          sourceType: 'calendario'
                        });
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-white dark:bg-stone-800 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Enviar correo de prueba a esta dirección ahora</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Notas adicionales</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Llevar informes médicos previos o llevar la merienda..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                {editingEvent ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Seguro que deseas eliminar el evento "${editingEvent.title}"?`)) {
                        deleteEvent(editingEvent.id);
                        setEditingEvent(null);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar Evento</span>
                  </button>
                ) : <div />}

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => { setShowAddEventModal(false); setEditingEvent(null); }}
                    className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                  >
                    {editingEvent ? 'Guardar Cambios' : 'Guardar en Calendario'}
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
