import React, { useState } from 'react';
import { 
  Utensils, 
  ShoppingCart, 
  Plus, 
  Edit3, 
  Sparkles, 
  Check, 
  Coffee, 
  Sun, 
  Moon, 
  Cookie, 
  ChevronRight,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { MealPlanDay } from '../../types';

export const MealsTab: React.FC = () => {
  const { 
    meals, 
    updateMealDay, 
    clearMealDay,
    exportMealPlanToShoppingList, 
    setActiveTab,
    showToast 
  } = useFamily();

  const [selectedDayName, setSelectedDayName] = useState<string>(meals[0]?.dayName || 'Lunes');
  const selectedDay = meals.find(m => m.dayName === selectedDayName) || meals[0];
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form state
  const [editBreakfast, setEditBreakfast] = useState('');
  const [editLunch, setEditLunch] = useState('');
  const [editSnack, setEditSnack] = useState('');
  const [editDinner, setEditDinner] = useState('');
  const [editIngredientsStr, setEditIngredientsStr] = useState('');

  const openEditModal = (day: MealPlanDay) => {
    setSelectedDayName(day.dayName);
    setEditBreakfast(day.breakfast || '');
    setEditLunch(day.lunch || '');
    setEditSnack(day.snack || '');
    setEditDinner(day.dinner || '');
    setEditIngredientsStr(day.ingredients?.join(', ') || '');
    setShowEditModal(true);
  };

  const handleSaveMealPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;

    const parsedIngredients = editIngredientsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    updateMealDay(selectedDay.dayName, {
      breakfast: editBreakfast.trim(),
      lunch: editLunch.trim(),
      snack: editSnack.trim(),
      dinner: editDinner.trim(),
      ingredients: parsedIngredients,
    });

    setShowEditModal(false);
  };

  const handleClearCurrentDay = () => {
    if (window.confirm(`¿Seguro que deseas vaciar y eliminar todos los platos planificados para el ${selectedDay.dayName}?`)) {
      clearMealDay(selectedDay.dayName);
      setEditBreakfast('');
      setEditLunch('');
      setEditSnack('');
      setEditDinner('');
      setEditIngredientsStr('');
      setShowEditModal(false);
    }
  };

  const totalIngredientsCount = meals.reduce((acc, m) => acc + m.ingredients.length, 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header with Automatic Shopping List Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Planificador de Menús Semanal
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Organiza desayunos, almuerzos y cenas de lunes a domingo con generación automática a la lista de compras.
          </p>
        </div>

        {/* Big Touch CTA Button for Automatic Shopping Sync */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={() => {
              const addedCount = exportMealPlanToShoppingList();
              if (addedCount > 0) {
                // optionally navigate or prompt
              }
            }}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Generar Lista de Compras Automática</span>
          </button>
        </div>
      </div>

      {/* Hero Banner explaining the auto-list feature */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-indigo-500/10 border border-orange-200 dark:border-orange-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
              Sincronización Total con el Supermercado
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Cada ingrediente planificado en los menús de la semana se transfiere con un solo toque a la pestaña de Listas.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('listas')}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center self-start sm:self-auto"
        >
          Ver Lista de Compras actual <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>

      {/* Week Days Selector Tabs (Big Touch) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {meals.map(day => {
          const isSelected = selectedDayName === day.dayName;
          return (
            <button
              key={day.dayName}
              onClick={() => setSelectedDayName(day.dayName)}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.02]'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <span className="block">{day.dayName}</span>
              <span className={`text-[10px] font-normal ${isSelected ? 'text-indigo-100' : 'text-stone-400'}`}>
                {day.ingredients.length} ingredientes
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Day Menu Board */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 flex-wrap gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 text-xs font-bold mb-1">
              <span>Menú del Día</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              {selectedDay.dayName}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => openEditModal(selectedDay)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Menú</span>
            </button>
            <button
              onClick={handleClearCurrentDay}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors"
              title="Vaciar y eliminar menú de este día"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vaciar Menú</span>
            </button>
          </div>
        </div>

        {/* 4 Meal Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Breakfast */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-700/70 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Coffee className="w-4 h-4" />
              <span className="uppercase tracking-wider">Desayuno</span>
            </div>
            <p className={`text-sm sm:text-base font-bold ${selectedDay.breakfast ? 'text-stone-900 dark:text-white' : 'text-stone-400 italic font-normal'}`}>
              {selectedDay.breakfast || 'Sin plato asignado'}
            </p>
          </div>

          {/* Lunch */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-700/70 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-orange-600 dark:text-orange-400">
              <Sun className="w-4 h-4" />
              <span className="uppercase tracking-wider">Almuerzo / Comida</span>
            </div>
            <p className={`text-sm sm:text-base font-bold ${selectedDay.lunch ? 'text-stone-900 dark:text-white' : 'text-stone-400 italic font-normal'}`}>
              {selectedDay.lunch || 'Sin plato asignado'}
            </p>
          </div>

          {/* Snack */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-700/70 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-pink-600 dark:text-pink-400">
              <Cookie className="w-4 h-4" />
              <span className="uppercase tracking-wider">Merienda / Snack</span>
            </div>
            <p className={`text-sm sm:text-base font-bold ${selectedDay.snack ? 'text-stone-900 dark:text-white' : 'text-stone-400 italic font-normal'}`}>
              {selectedDay.snack || 'Sin plato asignado'}
            </p>
          </div>

          {/* Dinner */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-700/70 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Moon className="w-4 h-4" />
              <span className="uppercase tracking-wider">Cena</span>
            </div>
            <p className={`text-sm sm:text-base font-bold ${selectedDay.dinner ? 'text-stone-900 dark:text-white' : 'text-stone-400 italic font-normal'}`}>
              {selectedDay.dinner || 'Sin plato asignado'}
            </p>
          </div>

        </div>

        {/* Ingredients for this day */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Ingredientes necesarios para {selectedDay.dayName}:
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedDay.ingredients.map((ing, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200"
              >
                🌿 {ing}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Week Overview Mini Grid */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <h3 className="text-base font-black text-stone-900 dark:text-white mb-4">
          Vista Rápida de la Semana Completa
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {meals.map(day => (
            <div
              key={day.dayName}
              onClick={() => setSelectedDayName(day.dayName)}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                selectedDay.dayName === day.dayName
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20'
                  : 'border-stone-200 dark:border-stone-800 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-stone-900 dark:text-white">{day.dayName}</span>
                <span className="text-[10px] text-stone-400">{day.ingredients.length} ing.</span>
              </div>
              <p className="text-xs font-medium text-stone-600 dark:text-stone-400 truncate">
                🍲 {day.lunch}
              </p>
              <p className="text-xs font-medium text-stone-600 dark:text-stone-400 truncate mt-0.5">
                🌙 {day.dinner}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-indigo-600" />
                Editar Menú de {selectedDay.dayName}
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-stone-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleSaveMealPlan} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Desayuno</label>
                <input
                  type="text"
                  value={editBreakfast}
                  onChange={e => setEditBreakfast(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Almuerzo / Comida</label>
                <input
                  type="text"
                  value={editLunch}
                  onChange={e => setEditLunch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Merienda / Snack</label>
                <input
                  type="text"
                  value={editSnack}
                  onChange={e => setEditSnack(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Cena</label>
                <input
                  type="text"
                  value={editDinner}
                  onChange={e => setEditDinner(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Ingredientes (separados por coma para la lista de compras)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Pollo, Patatas, Pimientos, Aceite de oliva..."
                  value={editIngredientsStr}
                  onChange={e => setEditIngredientsStr(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={handleClearCurrentDay}
                  className="px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Vaciar Menú del Día</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                  >
                    Guardar Cambios
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
