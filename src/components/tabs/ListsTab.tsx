import React, { useState } from 'react';
import { 
  CheckSquare, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Check, 
  User, 
  Search, 
  Calendar, 
  DollarSign,
  Tag,
  Sparkles,
  Edit3,
  Mail
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { TaskItem, ShoppingItem } from '../../types';

export const ListsTab: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    updateTask,
    toggleTask, 
    deleteTask, 
    shoppingItems, 
    addShoppingItem, 
    updateShoppingItem,
    toggleShoppingItem, 
    deleteShoppingItem, 
    members,
    activeMemberId,
    currentUser,
    sendEmailReminder,
  } = useFamily();

  // Tab mode: 'tareas' vs 'compras'
  const [listType, setListType] = useState<'tareas' | 'compras'>('tareas');
  
  // Member filter inside tab
  const [memberFilter, setMemberFilter] = useState<string>(activeMemberId);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  // New & Edit Task state
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('all');
  const [newTaskPriority, setNewTaskPriority] = useState<'baja' | 'media' | 'alta'>('media');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskNotifyEmail, setNewTaskNotifyEmail] = useState(false);
  const [newTaskTargetEmail, setNewTaskTargetEmail] = useState(currentUser?.email || 'lachicadelaesquinita@gmail.com');

  const handleSendTaskEmailNow = (task: TaskItem) => {
    const recipient = task.targetEmail || (task.assignedTo !== 'all' ? members.find(m => m.id === task.assignedTo)?.email : null) || currentUser?.email || 'lachicadelaesquinita@gmail.com';
    sendEmailReminder({
      to: recipient,
      subject: `Aviso de Tarea Familiar: ${task.title}`,
      body: `Tarea asignada: "${task.title}". Prioridad: ${task.priority.toUpperCase()}.${task.dueDate ? ` Fecha límite: ${task.dueDate}.` : ''}${task.description ? ` Detalles: ${task.description}.` : ''}`,
      sourceType: 'tarea'
    });
  };

  // New & Edit Shopping state
  const [showNewShoppingModal, setShowNewShoppingModal] = useState(false);
  const [editingShopping, setEditingShopping] = useState<ShoppingItem | null>(null);
  const [newShoppingTitle, setNewShoppingTitle] = useState('');
  const [newShoppingCategory, setNewShoppingCategory] = useState<ShoppingItem['category']>('Supermercado');
  const [newShoppingQuantity, setNewShoppingQuantity] = useState('1');
  const [newShoppingAssignee, setNewShoppingAssignee] = useState('all');
  const [newShoppingPrice, setNewShoppingPrice] = useState('');

  // Filtering tasks
  const filteredTasks = tasks.filter(t => {
    const matchesFilter = memberFilter === 'all' || t.assignedTo === memberFilter || t.assignedTo === 'all';
    const matchesStatus = showCompleted ? true : !t.completed;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesStatus && matchesSearch;
  });

  // Filtering shopping
  const filteredShopping = shoppingItems.filter(s => {
    const matchesFilter = memberFilter === 'all' || s.assignedTo === memberFilter || s.assignedTo === 'all';
    const matchesStatus = showCompleted ? true : !s.completed;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesStatus && matchesSearch;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const targetEmail = newTaskTargetEmail.trim() || currentUser?.email || 'lachicadelaesquinita@gmail.com';
    addTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || undefined,
      type: 'tarea',
      assignedTo: newTaskAssignee,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined,
      notifyEmail: newTaskNotifyEmail,
      targetEmail,
    });

    if (newTaskNotifyEmail) {
      sendEmailReminder({
        to: targetEmail,
        subject: `Nueva Tarea Asignada: ${newTaskTitle.trim()}`,
        body: `Se ha creado una tarea con prioridad ${newTaskPriority.toUpperCase()}.${newTaskDueDate ? ` Fecha límite: ${newTaskDueDate}.` : ''}`,
        sourceType: 'tarea'
      });
    }

    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskDueDate('');
    setShowNewTaskModal(false);
  };

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;
    updateTask(editingTask.id, {
      title: editingTask.title.trim(),
      description: editingTask.description,
      assignedTo: editingTask.assignedTo,
      priority: editingTask.priority,
      dueDate: editingTask.dueDate,
      notifyEmail: editingTask.notifyEmail,
      targetEmail: editingTask.targetEmail,
    });
    setEditingTask(null);
  };

  const handleCreateShopping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShoppingTitle.trim()) return;
    addShoppingItem({
      title: newShoppingTitle.trim(),
      type: 'compra',
      category: newShoppingCategory,
      quantity: newShoppingQuantity.trim() || '1 ud.',
      assignedTo: newShoppingAssignee,
      estimatedPrice: newShoppingPrice ? parseFloat(newShoppingPrice) : undefined,
    });
    setNewShoppingTitle('');
    setNewShoppingQuantity('1');
    setNewShoppingPrice('');
    setShowNewShoppingModal(false);
  };

  const handleUpdateShopping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShopping || !editingShopping.title.trim()) return;
    updateShoppingItem(editingShopping.id, {
      title: editingShopping.title.trim(),
      category: editingShopping.category,
      quantity: editingShopping.quantity,
      assignedTo: editingShopping.assignedTo,
      estimatedPrice: editingShopping.estimatedPrice,
    });
    setEditingShopping(null);
  };

  const getPriorityBadge = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'alta':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">Alta</span>;
      case 'media':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">Media</span>;
      case 'baja':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Baja</span>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            Listas del Hogar
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Gestiona responsabilidades individuales y de compras. Todos los elementos son editables con el botón ✏️.
          </p>
        </div>

        {/* Big Dual Tab Switcher */}
        <div className="flex p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60 self-start sm:self-auto">
          <button
            onClick={() => setListType('tareas')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              listType === 'tareas'
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tareas ({tasks.filter(t => !t.completed).length})</span>
          </button>
          
          <button
            onClick={() => setListType('compras')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              listType === 'compras'
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Compras ({shoppingItems.filter(s => !s.completed).length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Member Selector Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        
        {/* Member Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> Asignado a:
          </span>

          <button
            onClick={() => setMemberFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              memberFilter === 'all'
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
            }`}
          >
            🏡 Todos / Compartidas
          </button>

          {members.map(member => (
            <button
              key={member.id}
              onClick={() => setMemberFilter(member.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                memberFilter === member.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>{member.avatar}</span>
              <span>{member.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder={listType === 'tareas' ? 'Buscar tarea...' : 'Buscar producto...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-900 dark:text-stone-100 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                showCompleted 
                  ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-white' 
                  : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              {showCompleted ? 'Ocultar completados' : 'Mostrar completados'}
            </button>

            {listType === 'tareas' ? (
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Tarea</span>
              </button>
            ) : (
              <button
                onClick={() => setShowNewShoppingModal(true)}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Producto</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      {listType === 'tareas' ? (
        /* Tasks List */
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
              <CheckSquare className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">No hay tareas pendientes</h3>
              <p className="text-xs text-stone-400 mt-1">¡Todo al día en el hogar o cambia los filtros de búsqueda!</p>
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100"
              >
                <Plus className="w-4 h-4" />
                <span>Crear primera tarea</span>
              </button>
            </div>
          ) : (
            filteredTasks.map(task => {
              const assigned = members.find(m => m.id === task.assignedTo);
              return (
                <div
                  key={task.id}
                  className={`group p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                    task.completed
                      ? 'bg-stone-50 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800/40 opacity-75'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                    {/* Big Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                        task.completed
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'border-2 border-stone-300 dark:border-stone-600 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                      }`}
                      title={task.completed ? 'Marcar pendiente' : 'Completar tarea'}
                    >
                      {task.completed && <Check className="w-4 h-4" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h3 className={`text-sm sm:text-base font-bold text-stone-900 dark:text-white ${task.completed ? 'line-through text-stone-400 dark:text-stone-500' : ''}`}>
                          {task.title}
                        </h3>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {task.description && (
                        <p className={`text-xs sm:text-sm mt-1 text-stone-600 dark:text-stone-400 ${task.completed ? 'line-through opacity-70' : ''}`}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-3 mt-2 text-xs text-stone-400 flex-wrap gap-y-1">
                        <div className="flex items-center space-x-1 font-medium">
                          <span>{assigned ? assigned.avatar : '🏡'}</span>
                          <span className="text-stone-600 dark:text-stone-300 font-semibold">
                            {assigned ? assigned.name : 'Toda la Familia'}
                          </span>
                        </div>

                        {task.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Vence: {task.dueDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Email, Edit and Delete */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleSendTaskEmailNow(task)}
                      className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                      title="Enviar recordatorio de esta tarea a mi correo"
                    >
                      <Mail className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                      title="Editar esta tarea"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Editar</span>
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-stone-400 hover:text-rose-500 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Eliminar tarea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Shopping List */
        <div className="space-y-3">
          {filteredShopping.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
              <ShoppingCart className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">Lista de compras vacía</h3>
              <p className="text-xs text-stone-400 mt-1">Añade productos o genera la lista automática desde el menú semanal.</p>
              <button
                onClick={() => setShowNewShoppingModal(true)}
                className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir primer producto</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {filteredShopping.map(item => {
                const assigned = members.find(m => m.id === item.assignedTo);
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      item.completed
                        ? 'bg-stone-50 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800/40 opacity-70'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-indigo-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <button
                        onClick={() => toggleShoppingItem(item.id)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          item.completed
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-stone-300 dark:border-stone-600 hover:border-indigo-600'
                        }`}
                        title={item.completed ? 'Marcar pendiente' : 'Comprado'}
                      >
                        {item.completed && <Check className="w-4 h-4" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-bold text-stone-900 dark:text-white truncate ${item.completed ? 'line-through text-stone-400 dark:text-stone-500' : ''}`}>
                          {item.title}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {item.quantity}
                          </span>
                          <span>•</span>
                          <span className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-[11px]">
                            {item.category}
                          </span>
                          {item.estimatedPrice && (
                            <>
                              <span>•</span>
                              <span>~€{item.estimatedPrice.toFixed(2)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => setEditingShopping(item)}
                        className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="Editar producto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteShoppingItem(item.id)}
                        className="text-stone-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="Eliminar de lista"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: New or Edit Task */}
      {(showNewTaskModal || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                {editingTask ? 'Editar Tarea del Hogar' : 'Nueva Tarea del Hogar'}
              </h3>
              <button 
                onClick={() => { setShowNewTaskModal(false); setEditingTask(null); }} 
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Título de la tarea *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Revisar deberes, Comprar bombilla, etc."
                  value={editingTask ? editingTask.title : newTaskTitle}
                  onChange={e => editingTask 
                    ? setEditingTask({ ...editingTask, title: e.target.value })
                    : setNewTaskTitle(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Descripción o detalles</label>
                <textarea
                  rows={2}
                  placeholder="Notas adicionales o pasos a seguir..."
                  value={editingTask ? (editingTask.description || '') : newTaskDesc}
                  onChange={e => editingTask
                    ? setEditingTask({ ...editingTask, description: e.target.value })
                    : setNewTaskDesc(e.target.value)
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Responsable</label>
                  <select
                    value={editingTask ? editingTask.assignedTo : newTaskAssignee}
                    onChange={e => editingTask
                      ? setEditingTask({ ...editingTask, assignedTo: e.target.value })
                      : setNewTaskAssignee(e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    <option value="all">🏡 Toda la Familia / Ambos</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.avatar} {m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Prioridad</label>
                  <select
                    value={editingTask ? editingTask.priority : newTaskPriority}
                    onChange={e => editingTask
                      ? setEditingTask({ ...editingTask, priority: e.target.value as any })
                      : setNewTaskPriority(e.target.value as any)
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Fecha límite (Opcional)</label>
                <input
                  type="date"
                  value={editingTask ? (editingTask.dueDate || '') : newTaskDueDate}
                  onChange={e => editingTask
                    ? setEditingTask({ ...editingTask, dueDate: e.target.value })
                    : setNewTaskDueDate(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              {/* Email Notification Option for Tasks */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2.5">
                <label className="flex items-center space-x-2 text-xs font-bold text-indigo-900 dark:text-indigo-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTask ? (editingTask.notifyEmail ?? false) : newTaskNotifyEmail}
                    onChange={e => editingTask
                      ? setEditingTask({ ...editingTask, notifyEmail: e.target.checked })
                      : setNewTaskNotifyEmail(e.target.checked)
                    }
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>Enviar aviso / recordatorio a mi correo</span>
                </label>

                {((editingTask ? editingTask.notifyEmail : newTaskNotifyEmail)) && (
                  <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={editingTask ? (editingTask.targetEmail || currentUser?.email || '') : newTaskTargetEmail}
                      onChange={e => editingTask
                        ? setEditingTask({ ...editingTask, targetEmail: e.target.value })
                        : setNewTaskTargetEmail(e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const target = (editingTask ? editingTask.targetEmail : newTaskTargetEmail) || currentUser?.email || 'lachicadelaesquinita@gmail.com';
                        sendEmailReminder({
                          to: target,
                          subject: `Aviso de Tarea: ${(editingTask ? editingTask.title : newTaskTitle) || 'Tarea del Hogar'}`,
                          body: `Recordatorio de tarea programada con prioridad ${(editingTask ? editingTask.priority : newTaskPriority).toUpperCase()}.`,
                          sourceType: 'tarea'
                        });
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-white dark:bg-stone-800 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Enviar prueba de correo ahora</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Seguro que deseas eliminar la tarea "${editingTask.title}"?`)) {
                        deleteTask(editingTask.id);
                        setEditingTask(null);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar Tarea</span>
                  </button>
                ) : <div />}

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => { setShowNewTaskModal(false); setEditingTask(null); }}
                    className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                  >
                    {editingTask ? 'Actualizar Tarea' : 'Guardar Tarea'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New or Edit Shopping Item */}
      {(showNewShoppingModal || editingShopping) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
                {editingShopping ? 'Editar Producto de Compra' : 'Añadir a la Lista de Compras'}
              </h3>
              <button 
                onClick={() => { setShowNewShoppingModal(false); setEditingShopping(null); }} 
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingShopping ? handleUpdateShopping : handleCreateShopping} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Producto o Alimento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Leche desnatada, Manzanas, Detergente..."
                  value={editingShopping ? editingShopping.title : newShoppingTitle}
                  onChange={e => editingShopping
                    ? setEditingShopping({ ...editingShopping, title: e.target.value })
                    : setNewShoppingTitle(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Categoría</label>
                  <select
                    value={editingShopping ? editingShopping.category : newShoppingCategory}
                    onChange={e => editingShopping
                      ? setEditingShopping({ ...editingShopping, category: e.target.value as any })
                      : setNewShoppingCategory(e.target.value as any)
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    <option value="Supermercado">Supermercado</option>
                    <option value="Frutería">Frutería</option>
                    <option value="Farmacia">Farmacia</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Mascotas">Mascotas</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Cantidad</label>
                  <input
                    type="text"
                    value={editingShopping ? editingShopping.quantity : newShoppingQuantity}
                    onChange={e => editingShopping
                      ? setEditingShopping({ ...editingShopping, quantity: e.target.value })
                      : setNewShoppingQuantity(e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Asignado a</label>
                  <select
                    value={editingShopping ? editingShopping.assignedTo : newShoppingAssignee}
                    onChange={e => editingShopping
                      ? setEditingShopping({ ...editingShopping, assignedTo: e.target.value })
                      : setNewShoppingAssignee(e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    <option value="all">🏡 Quien vaya al súper</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Precio estimado (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingShopping ? (editingShopping.estimatedPrice || '') : newShoppingPrice}
                    onChange={e => editingShopping
                      ? setEditingShopping({ ...editingShopping, estimatedPrice: parseFloat(e.target.value) })
                      : setNewShoppingPrice(e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3">
                {editingShopping ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Eliminar "${editingShopping.title}" de la lista de compras?`)) {
                        deleteShoppingItem(editingShopping.id);
                        setEditingShopping(null);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar Producto</span>
                  </button>
                ) : <div />}

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => { setShowNewShoppingModal(false); setEditingShopping(null); }}
                    className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                  >
                    {editingShopping ? 'Actualizar Producto' : 'Añadir Producto'}
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
