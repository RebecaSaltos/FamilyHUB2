import React from 'react';
import { 
  CheckSquare, 
  Wallet, 
  Calendar, 
  FileText, 
  Clock, 
  Utensils, 
  Image, 
  Activity, 
  Users, 
  LayoutDashboard
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { TabType } from '../../types';

interface NavItem {
  id: TabType;
  label: string;
  subLabel: string;
  icon: React.ReactNode;
  badge?: number | string;
  badgeColor?: string;
}

export const Navigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    tasks, 
    shoppingItems, 
    medications, 
    chores, 
    events 
  } = useFamily();

  // Dynamic badge counts
  const pendingTasksTotal = tasks.filter(t => !t.completed).length + shoppingItems.filter(s => !s.completed).length;
  const pendingChores = chores.filter(c => !c.completedToday).length;
  const pendingMeds = medications.filter(m => !m.takenToday).length;

  const navItems: NavItem[] = [
    {
      id: 'resumen',
      label: 'Resumen',
      subLabel: 'Panel Principal',
      icon: <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'listas',
      label: 'Listas',
      subLabel: 'Tareas & Compras',
      icon: <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: pendingTasksTotal > 0 ? pendingTasksTotal : undefined,
      badgeColor: 'bg-indigo-600',
    },
    {
      id: 'presupuesto',
      label: 'Presupuesto',
      subLabel: 'Gastos & Ahorro',
      icon: <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'calendario',
      label: 'Calendario',
      subLabel: 'Eventos & Citas',
      icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: events.length > 0 ? events.length : undefined,
      badgeColor: 'bg-blue-600',
    },
    {
      id: 'documentos',
      label: 'Documentos',
      subLabel: 'Recibos & Garantías',
      icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'horarios',
      label: 'Horarios',
      subLabel: 'Turnos del Hogar',
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: pendingChores > 0 ? pendingChores : undefined,
      badgeColor: 'bg-amber-600',
    },
    {
      id: 'comidas',
      label: 'Comidas',
      subLabel: 'Menú Semanal',
      icon: <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'galeria',
      label: 'Galería',
      subLabel: 'Fotos & Álbumes',
      icon: <Image className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'salud',
      label: 'Salud',
      subLabel: 'Médicos & Medicinas',
      icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: pendingMeds > 0 ? pendingMeds : undefined,
      badgeColor: 'bg-rose-600',
    },
    {
      id: 'familia',
      label: 'Familia',
      subLabel: 'Miembros & Perfiles',
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
  ];

  return (
    <div className="bg-white dark:bg-stone-900 border-b border-stone-200/80 dark:border-stone-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Large Touch Tab Carousel */}
        <div className="flex items-center space-x-2 py-3 overflow-x-auto scrollbar-none no-scrollbar snap-x touch-pan-x">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 relative group flex items-center space-x-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl transition-all duration-200 snap-start text-left focus:outline-none select-none cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02] ring-2 ring-indigo-500/20'
                    : 'bg-stone-50 dark:bg-stone-800/70 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-950 dark:hover:text-white border border-stone-200/70 dark:border-stone-700/60'
                }`}
                style={{ minWidth: '135px' }}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon box */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 shadow-xs group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  }`}
                >
                  {item.icon}
                </div>

                {/* Text labels */}
                <div className="flex flex-col min-w-0 pr-1">
                  <span className={`text-sm sm:text-base font-bold tracking-tight leading-tight whitespace-nowrap ${isActive ? 'text-white' : 'text-stone-900 dark:text-white'}`}>
                    {item.label}
                  </span>
                  <span className={`text-[11px] font-medium leading-tight truncate whitespace-nowrap ${isActive ? 'text-indigo-100' : 'text-stone-400 dark:text-stone-400'}`}>
                    {item.subLabel}
                  </span>
                </div>

                {/* Badge if present */}
                {item.badge !== undefined && (
                  <span
                    className={`ml-auto shrink-0 px-2 py-0.5 text-xs font-black rounded-full shadow-xs ${
                      isActive
                        ? 'bg-white text-indigo-700'
                        : `${item.badgeColor || 'bg-indigo-600'} text-white`
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
