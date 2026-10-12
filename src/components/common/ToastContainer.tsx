import React from 'react';
import { useFamily } from '../../context/FamilyContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useFamily();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => {
        let icon = <Info className="w-5 h-5 text-indigo-500 shrink-0" />;
        let borderClass = 'border-stone-200 dark:border-stone-700';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          borderClass = 'border-emerald-300 dark:border-emerald-800';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          borderClass = 'border-amber-300 dark:border-amber-800';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center space-x-3 p-4 rounded-2xl bg-white/95 dark:bg-stone-850/95 backdrop-blur-md shadow-xl text-stone-900 dark:text-white border ${borderClass} animate-in fade-in slide-in-from-bottom-3 duration-200`}
          >
            {icon}
            <p className="text-xs sm:text-sm font-bold flex-1 leading-snug">
              {toast.message}
            </p>
          </div>
        );
      })}
    </div>
  );
};
