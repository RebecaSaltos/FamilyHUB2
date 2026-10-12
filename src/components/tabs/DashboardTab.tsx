import React from 'react';
import { 
  CheckSquare, 
  Wallet, 
  Calendar as CalendarIcon, 
  FileText, 
  Clock, 
  Utensils, 
  Image, 
  Activity, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { TabType } from '../../types';

export const DashboardTab: React.FC = () => {
  const { 
    familyName, 
    activeMember, 
    activeMemberId, 
    setActiveTab, 
    tasks, 
    shoppingItems, 
    expenses, 
    monthlyIncome, 
    savingsGoal, 
    events, 
    chores, 
    meals, 
    medications, 
    members,
    toggleChoreCompleted,
    toggleMedicationTaken,
    triggerConfetti
  } = useFamily();

  // Filter tasks based on active member
  const filteredTasks = tasks.filter(t => 
    !t.completed && (activeMemberId === 'all' || t.assignedTo === 'all' || t.assignedTo === activeMemberId)
  );

  const pendingShopping = shoppingItems.filter(s => !s.completed);
  
  // Total expenses this month
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingSavings = monthlyIncome - totalExpenses;

  // Today's chores
  const todayChores = chores.map(chore => {
    const assignedMemberId = chore.membersOrder[chore.currentMemberIndex];
    const assignedMember = members.find(m => m.id === assignedMemberId);
    return {
      ...chore,
      assignedMember,
      isForActiveUser: activeMemberId === 'all' || assignedMemberId === activeMemberId
    };
  });

  // Today's meal (simulate day of week)
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const todayDayName = daysOfWeek[new Date().getDay()] as any;
  const todayMeal = meals.find(m => m.dayName === todayDayName) || meals[0];

  // Today's medications
  const todayMeds = medications.filter(m => 
    activeMemberId === 'all' || m.memberId === activeMemberId
  );

  // Upcoming 3 events
  const upcomingEvents = [...events].slice(0, 3);

  const quickCards: Array<{
    tab: TabType;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    bgHover: string;
    badge?: string;
  }> = [
    {
      tab: 'listas',
      title: 'Listas de Hogar',
      subtitle: `${filteredTasks.length} tareas pendientes • ${pendingShopping.length} compras`,
      icon: <CheckSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      color: 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20',
      bgHover: 'hover:border-indigo-400 dark:hover:border-indigo-700',
      badge: `${filteredTasks.length + pendingShopping.length}`,
    },
    {
      tab: 'presupuesto',
      title: 'Presupuesto Familiar',
      subtitle: `Gastado: €${totalExpenses.toFixed(0)} • Ahorro: €${remainingSavings.toFixed(0)}`,
      icon: <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      color: 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20',
      bgHover: 'hover:border-emerald-400 dark:hover:border-emerald-700',
      badge: `€${remainingSavings.toFixed(0)}`,
    },
    {
      tab: 'horarios',
      title: 'Turnos y Horarios',
      subtitle: `${chores.filter(c => !c.completedToday).length} turnos por cumplir hoy`,
      icon: <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      color: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20',
      bgHover: 'hover:border-amber-400 dark:hover:border-amber-700',
    },
    {
      tab: 'calendario',
      title: 'Calendario y Citas',
      subtitle: `${events.length} eventos programados este mes`,
      icon: <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      color: 'border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20',
      bgHover: 'hover:border-blue-400 dark:hover:border-blue-700',
    },
    {
      tab: 'comidas',
      title: 'Menú Semanal',
      subtitle: `Hoy: ${todayMeal?.lunch.split(' ')[0]}... y ${todayMeal?.dinner.split(' ')[0]}...`,
      icon: <Utensils className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
      color: 'border-orange-200 dark:border-orange-900/60 bg-orange-50/40 dark:bg-orange-950/20',
      bgHover: 'hover:border-orange-400 dark:hover:border-orange-700',
    },
    {
      tab: 'salud',
      title: 'Salud y Medicinas',
      subtitle: `${medications.filter(m => !m.takenToday).length} dosis pendientes por tomar`,
      icon: <Activity className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      color: 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20',
      bgHover: 'hover:border-rose-400 dark:hover:border-rose-700',
      badge: medications.filter(m => !m.takenToday).length > 0 ? '¡Tomar!' : undefined,
    },
    {
      tab: 'documentos',
      title: 'Documentos',
      subtitle: 'Garantías, contratos, identificaciones y recibos',
      icon: <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      color: 'border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20',
      bgHover: 'hover:border-purple-400 dark:hover:border-purple-700',
    },
    {
      tab: 'galeria',
      title: 'Galería de Fotos',
      subtitle: 'Álbumes familiares, recuerdos y momentos',
      icon: <Image className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
      color: 'border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/40 dark:bg-cyan-950/20',
      bgHover: 'hover:border-cyan-400 dark:hover:border-cyan-700',
    },
    {
      tab: 'familia',
      title: 'Miembros y Perfiles',
      subtitle: `${members.length} integrantes vinculados en el hogar`,
      icon: <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      color: 'border-teal-200 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20',
      bgHover: 'hover:border-teal-400 dark:hover:border-teal-700',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 sm:p-8 shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Bienvenido a {familyName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              ¡Hola, {activeMember ? activeMember.name : 'Familia'}! 👋
            </h1>
            <p className="text-sm sm:text-base text-indigo-100 max-w-xl">
              Aquí tienes el estado general de tu hogar. Navega cómodamente tocando cualquiera de las pestañas superiores o tarjetas de abajo.
            </p>
          </div>

          {/* Quick Active User Card */}
          <div 
            onClick={() => setActiveTab('familia')}
            className="flex items-center space-x-3 bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 self-start sm:self-auto shrink-0 cursor-pointer transition-colors group"
            title="Toca para editar tu perfil o cambiar datos"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">{activeMember ? activeMember.avatar : '🏡'}</span>
            <div>
              <p className="text-xs text-indigo-200 font-medium">Perfil en uso</p>
              <p className="text-sm sm:text-base font-bold">{activeMember ? activeMember.name : 'Todos los miembros'}</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-xs text-indigo-100/80">{activeMember ? activeMember.role : 'Vista general'}</span>
                {activeMember?.bloodType && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-white/20 rounded-md">
                    🩸 {activeMember.bloodType}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background blur circles */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Action Row: Today's Priorities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Today's Chores Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-base">Turnos de Hoy</h3>
                  <p className="text-xs text-stone-500">Responsabilidades del hogar</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('horarios')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
              >
                Ver todos <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="space-y-2.5">
              {todayChores.slice(0, 3).map(chore => (
                <div 
                  key={chore.id} 
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    chore.completedToday 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-stone-500'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200/70 dark:border-stone-700/60 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-xl shrink-0">{chore.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-bold truncate ${chore.completedToday ? 'line-through opacity-70' : ''}`}>
                        {chore.name}
                      </p>
                      <div className="flex items-center space-x-1.5 text-xs text-stone-500 dark:text-stone-400">
                        <span>{chore.assignedMember?.avatar}</span>
                        <span className="font-semibold text-stone-700 dark:text-stone-300">
                          {chore.assignedMember?.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleChoreCompleted(chore.id)}
                    className={`p-2 rounded-xl transition-colors shrink-0 ${
                      chore.completedToday
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-emerald-100 hover:text-emerald-700'
                    }`}
                    title={chore.completedToday ? 'Marcar como pendiente' : 'Marcar como completado'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Medications & Health */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-base">Medicamentos de Hoy</h3>
                  <p className="text-xs text-stone-500">Seguimiento de tomas</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('salud')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
              >
                Ver salud <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="space-y-2.5">
              {todayMeds.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-4 text-center">No hay medicamentos programados</p>
              ) : (
                todayMeds.map(med => {
                  const member = members.find(m => m.id === med.memberId);
                  return (
                    <div 
                      key={med.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        med.takenToday 
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-stone-500'
                          : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/40 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="text-xl">💊</span>
                        <div className="min-w-0">
                          <p className={`text-xs sm:text-sm font-bold truncate ${med.takenToday ? 'line-through opacity-70' : ''}`}>
                            {med.medicationName}
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            {member?.name.split(' ')[0]} • {med.dosage}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleMedicationTaken(med.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shrink-0 ${
                          med.takenToday
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                        }`}
                      >
                        {med.takenToday ? 'Tomado ✓' : 'Tomar'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Today's Meals & Upcoming Event */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-base">Comida de Hoy</h3>
                  <p className="text-xs text-stone-500">{todayMeal?.dayName}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('comidas')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
              >
                Menú <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60">
                <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] block">Almuerzo</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200 text-xs sm:text-sm mt-0.5 line-clamp-2">
                  {todayMeal?.lunch}
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60">
                <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] block">Cena</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200 text-xs sm:text-sm mt-0.5 line-clamp-2">
                  {todayMeal?.dinner}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Big Touch Navigation Grid (Que cada pestaña sea grande para facilitar la navegación táctil) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
              Módulos del Hogar
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Acceso táctil rápido y directo a todas las áreas de la casa
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {quickCards.map((card) => (
            <button
              key={card.tab}
              onClick={() => setActiveTab(card.tab)}
              className={`p-5 sm:p-6 rounded-3xl border text-left transition-all duration-200 group active:scale-[0.98] cursor-pointer shadow-xs ${card.color} ${card.bgHover} hover:shadow-md hover:bg-white dark:hover:bg-stone-850 flex flex-col justify-between min-h-[140px]`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-stone-800 shadow-sm flex items-center justify-center shrink-0 border border-stone-200/60 dark:border-stone-700/60 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                {card.badge && (
                  <span className="px-2.5 py-1 text-xs font-black rounded-full bg-indigo-600 text-white shadow-xs">
                    {card.badge}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-1">
                  {card.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
