import React from 'react';
import { FamilyProvider, useFamily } from './context/FamilyContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';

// Tabs
import { DashboardTab } from './components/tabs/DashboardTab';
import { ListsTab } from './components/tabs/ListsTab';
import { BudgetTab } from './components/tabs/BudgetTab';
import { CalendarTab } from './components/tabs/CalendarTab';
import { DocumentsTab } from './components/tabs/DocumentsTab';
import { SchedulesTab } from './components/tabs/SchedulesTab';
import { MealsTab } from './components/tabs/MealsTab';
import { GalleryTab } from './components/tabs/GalleryTab';
import { HealthTab } from './components/tabs/HealthTab';
import { FamilyTab } from './components/tabs/FamilyTab';

// Icons for quick mobile bottom bar
import { 
  LayoutDashboard, 
  CheckSquare, 
  Wallet, 
  Calendar as CalendarIcon, 
  Clock, 
  Utensils, 
  MoreHorizontal 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, familyName } = useFamily();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'resumen':
        return <DashboardTab />;
      case 'listas':
        return <ListsTab />;
      case 'presupuesto':
        return <BudgetTab />;
      case 'calendario':
        return <CalendarTab />;
      case 'documentos':
        return <DocumentsTab />;
      case 'horarios':
        return <SchedulesTab />;
      case 'comidas':
        return <MealsTab />;
      case 'galeria':
        return <GalleryTab />;
      case 'salud':
        return <HealthTab />;
      case 'familia':
        return <FamilyTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-150 pb-20 sm:pb-12">
      {/* Top Header */}
      <Header />

      {/* Primary Large Touch Navigation Tabs */}
      <Navigation />

      {/* Main Tab Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderActiveTab()}
      </main>

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-stone-900 py-6 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">
            FamiliApp • Espacio Privado & Seguro de {familyName}
          </p>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Datos guardados localmente</span>
            <span>•</span>
            <button
              onClick={() => {
                if (window.confirm('¿Deseas reiniciar los datos de demostración a los valores iniciales?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Reiniciar demo
            </button>
          </div>
        </div>
      </footer>

      {/* Toast notifications */}
      <ToastContainer />

      {/* Email Authentication & Register Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <FamilyProvider>
      <MainContent />
    </FamilyProvider>
  );
}
