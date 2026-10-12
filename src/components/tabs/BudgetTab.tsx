import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  TrendingUp, 
  PiggyBank, 
  Receipt, 
  User, 
  Trash2, 
  PieChart, 
  Tag, 
  Calendar, 
  ArrowUpRight,
  ShieldCheck,
  Edit2
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { ExpenseItem } from '../../types';

export const BudgetTab: React.FC = () => {
  const { 
    expenses, 
    addExpense, 
    updateExpense,
    deleteExpense, 
    members, 
    monthlyIncome, 
    savingsGoal, 
    setMonthlyIncome, 
    setSavingsGoal,
    activeMemberId
  } = useFamily();

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMember, setFilterMember] = useState<string>('all');

  // New Expense form state
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('Alimentación');
  const [paidBy, setPaidBy] = useState<string>(members[0]?.id || 'm-1');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Edit Goal form
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString());
  const [tempGoal, setTempGoal] = useState(savingsGoal.toString());

  // Metrics
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const actualSavings = monthlyIncome - totalExpenses;
  const savingsProgressPct = Math.min(100, Math.max(0, (actualSavings / (savingsGoal || 1)) * 100));

  // Category totals
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const categoriesList = [
    { name: 'Alimentación', color: '#f97316', icon: '🛒' },
    { name: 'Vivienda', color: '#6366f1', icon: '🏠' },
    { name: 'Servicios', color: '#06b6d4', icon: '⚡' },
    { name: 'Salud', color: '#ec4899', icon: '💊' },
    { name: 'Educación', color: '#8b5cf6', icon: '📚' },
    { name: 'Transporte', color: '#3b82f6', icon: '🚗' },
    { name: 'Ocio', color: '#eab308', icon: '🎉' },
    { name: 'Otros', color: '#64748b', icon: '📦' },
  ];

  // User breakdown: who spent how much
  const memberExpenses: Record<string, number> = {};
  expenses.forEach(e => {
    memberExpenses[e.paidBy] = (memberExpenses[e.paidBy] || 0) + e.amount;
  });

  const filteredExpenses = expenses.filter(e => {
    const matchCategory = filterCategory === 'all' || e.category === filterCategory;
    const matchMember = filterMember === 'all' || e.paidBy === filterMember;
    return matchCategory && matchMember;
  });

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() || !amount) return;

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        concept: concept.trim(),
        amount: parseFloat(amount),
        date: date || new Date().toISOString().split('T')[0],
        category,
        paidBy,
      });
      setEditingExpense(null);
    } else {
      addExpense({
        concept: concept.trim(),
        amount: parseFloat(amount),
        date: date || new Date().toISOString().split('T')[0],
        category,
        paidBy,
        splitBetween: ['all'],
      });
      setShowAddExpense(false);
    }

    setConcept('');
    setAmount('');
  };

  const openEditExpense = (expense: ExpenseItem) => {
    setEditingExpense(expense);
    setConcept(expense.concept);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setPaidBy(expense.paidBy);
    setDate(expense.date);
  };

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempIncome) setMonthlyIncome(parseFloat(tempIncome));
    if (tempGoal) setSavingsGoal(parseFloat(tempGoal));
    setShowGoalModal(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Presupuesto & Finanzas
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Control de gastos compartidos del hogar, aportes por miembro y gráfico mensual de ahorro.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editar Metas</span>
          </button>

          <button
            onClick={() => setShowAddExpense(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Gasto</span>
          </button>
        </div>
      </div>

      {/* Main Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Income Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Ingresos Estimados</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-3 tracking-tight">
            €{monthlyIncome.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-stone-400 mt-1">Ingreso familiar mensual</p>
        </div>

        {/* Expenses Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Gastos Registrados</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-3 tracking-tight">
            €{totalExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-stone-400 mt-1">{expenses.length} transacciones registradas</p>
        </div>

        {/* Savings Goal & Balance Card */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Ahorro Mensual</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-3 tracking-tight">
            €{actualSavings.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-indigo-200">
            <span>Meta: €{savingsGoal.toFixed(0)}</span>
            <span className="font-bold text-white">{savingsProgressPct.toFixed(0)}% conseguido</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-white/20 h-2 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${savingsProgressPct}%` }}
            />
          </div>
        </div>

      </div>

      {/* Visual Chart & Breakdown Section (Visualizar un gráfico mensual de ahorros) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Monthly Savings & Expense Visual Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Gráfico Mensual de Ahorro y Gastos
                </h3>
                <p className="text-xs text-stone-500">Distribución de presupuesto y balance acumulado</p>
              </div>
              <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-bold text-stone-600 dark:text-stone-300">
                Octubre 2026
              </span>
            </div>

            {/* SVG Visual Representation of Budget Split */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/80 dark:border-stone-800/80 my-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-400 mb-2">
                <span>Ingreso Total: €{monthlyIncome.toFixed(0)}</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {actualSavings > 0 ? `+€${actualSavings.toFixed(0)} de Ahorro Disponible` : 'Presupuesto Excedido'}
                </span>
              </div>

              {/* Stacked Proportional Bar */}
              <div className="w-full h-8 rounded-xl overflow-hidden flex shadow-inner bg-stone-200 dark:bg-stone-800">
                {categoriesList.map(cat => {
                  const catAmt = categoryTotals[cat.name] || 0;
                  if (catAmt === 0) return null;
                  const pct = (catAmt / monthlyIncome) * 100;
                  return (
                    <div
                      key={cat.name}
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      className="h-full relative group transition-all hover:opacity-90 cursor-pointer"
                      title={`${cat.name}: €${catAmt.toFixed(2)} (${pct.toFixed(1)}%)`}
                    />
                  );
                })}
                {actualSavings > 0 && (
                  <div
                    style={{ width: `${(actualSavings / monthlyIncome) * 100}%` }}
                    className="h-full bg-emerald-500 relative group transition-all hover:opacity-90 cursor-pointer"
                    title={`Ahorro Restante: €${actualSavings.toFixed(2)}`}
                  />
                )}
              </div>

              {/* Legend row */}
              <div className="flex flex-wrap gap-3 mt-3 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-500 shrink-0" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">Ahorro (€{actualSavings.toFixed(0)})</span>
                </div>
                {categoriesList.map(cat => {
                  const amt = categoryTotals[cat.name];
                  if (!amt) return null;
                  return (
                    <div key={cat.name} className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-stone-600 dark:text-stone-300">
                        {cat.name} (€{amt.toFixed(0)})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Savings Health Insight */}
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 dark:text-indigo-200">
              <span className="font-bold">Salud financiera familiar: </span>
              {actualSavings >= savingsGoal ? (
                <span>¡Excelente ritmo! La familia ya ha cubierto su meta de ahorro mensual de €{savingsGoal.toFixed(0)}.</span>
              ) : (
                <span>Faltan €{(savingsGoal - actualSavings).toFixed(0)} para alcanzar el objetivo mensual fijado por el hogar.</span>
              )}
            </div>
          </div>
        </div>

        {/* Expenses by Member (Categorizar por usuario) */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <h3 className="text-base font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Aportes por Miembro
          </h3>
          <p className="text-xs text-stone-500 mb-4">Gasto desembolsado por cada persona este mes</p>

          <div className="space-y-3">
            {members.map(member => {
              const spent = memberExpenses[member.id] || 0;
              const pctOfExpenses = totalExpenses > 0 ? (spent / totalExpenses) * 100 : 0;

              return (
                <div key={member.id} className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{member.avatar}</span>
                      <div>
                        <p className="text-xs font-bold text-stone-800 dark:text-stone-200 leading-tight">
                          {member.name}
                        </p>
                        <p className="text-[10px] text-stone-400">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-stone-900 dark:text-white">
                        €{spent.toFixed(2)}
                      </span>
                      <p className="text-[10px] text-stone-400">{pctOfExpenses.toFixed(0)}% del total</p>
                    </div>
                  </div>

                  <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${pctOfExpenses}%`, backgroundColor: member.color || '#6366f1' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Filter and Expense Transactions List */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-stone-900 dark:text-white tracking-tight">
              Historial de Gastos
            </h3>
            <p className="text-xs text-stone-500">Transacciones y recibos compartidos</p>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {/* Filter by Category */}
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 outline-none"
            >
              <option value="all">Todas las categorías</option>
              {categoriesList.map(c => (
                <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>

            {/* Filter by Member */}
            <select
              value={filterMember}
              onChange={e => setFilterMember(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 outline-none"
            >
              <option value="all">Todos los miembros</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Expenses List */}
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {filteredExpenses.length === 0 ? (
            <p className="text-center py-8 text-xs text-stone-400 italic">No hay gastos que coincidan con los filtros seleccionados.</p>
          ) : (
            filteredExpenses.map(expense => {
              const payer = members.find(m => m.id === expense.paidBy);
              const catObj = categoriesList.find(c => c.name === expense.category);

              return (
                <div key={expense.id} className="py-3.5 flex items-center justify-between gap-3 group">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: `${catObj?.color || '#6366f1'}20` }}
                    >
                      {catObj?.icon || '💶'}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-stone-900 dark:text-white truncate">
                        {expense.concept}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        <span className="font-semibold text-stone-700 dark:text-stone-300">
                          {payer?.avatar} {payer ? payer.name.split(' ')[0] : 'Desconocido'}
                        </span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px]">
                          {expense.category}
                        </span>
                        <span>•</span>
                        <span>{expense.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-base font-black text-stone-900 dark:text-white">
                      -€{expense.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => openEditExpense(expense)}
                      className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Editar este gasto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-stone-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Modal: New or Edit Expense */}
      {(showAddExpense || editingExpense) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                {editingExpense ? 'Editar Gasto Familiar' : 'Registrar Gasto Familiar'}
              </h3>
              <button 
                onClick={() => { setShowAddExpense(false); setEditingExpense(null); }} 
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Concepto o descripción *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Compra semanal, Gasolina, Farmacia, Recibo luz..."
                  value={concept}
                  onChange={e => setConcept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Monto (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    {categoriesList.map(c => (
                      <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Pagado por</label>
                  <select
                    value={paidBy}
                    onChange={e => setPaidBy(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Budget Goals */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-700">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Configurar Metas Financieras</h3>
            
            <form onSubmit={handleSaveGoals} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Ingreso familiar mensual (€)</label>
                <input
                  type="number"
                  value={tempIncome}
                  onChange={e => setTempIncome(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Meta mensual de ahorro deseada (€)</label>
                <input
                  type="number"
                  value={tempGoal}
                  onChange={e => setTempGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none font-bold"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Actualizar Metas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
