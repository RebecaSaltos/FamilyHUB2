import { supabase } from '../supabaseClient';
import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  TabType,
  AuthUser,
  FamilyMember, 
  TaskItem, 
  ShoppingItem, 
  ExpenseItem, 
  CalendarEvent, 
  DocumentItem, 
  ChoreRotation, 
  MealPlanDay, 
  GalleryPhoto, 
  GalleryAlbum, 
  MedicationReminder, 
  MedicalRecord,
  EmailNotificationLog 
} from '../types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_TASKS, 
  INITIAL_SHOPPING, 
  INITIAL_EXPENSES, 
  INITIAL_EVENTS, 
  INITIAL_DOCUMENTS, 
  INITIAL_CHORES, 
  INITIAL_MEALS, 
  INITIAL_ALBUMS, 
  INITIAL_PHOTOS, 
  INITIAL_MEDICATIONS, 
  INITIAL_MEDICAL_RECORDS,
  INITIAL_ACCOUNTS 
} from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface FamilyContextType {
  // Authentication
  currentUser: AuthUser | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  register: (data: {
    name: string;
    email: string;
    password?: string;
    role: FamilyMember['role'];
    avatar?: string;
    color?: string;
    bloodType?: string;
    allergies?: string[];
    phone?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;

  // Navigation & Preferences
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeMemberId: string;
  setActiveMemberId: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  familyName: string;
  setFamilyName: (name: string) => void;
  inviteCode: string;
  activeMember: FamilyMember | undefined;

  // Members & Profile Editing
  members: FamilyMember[];
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
  updateMemberHealthProfile: (id: string, health: {
    bloodType?: string;
    allergies?: string[];
    emergencyContact?: string;
    medicalNotes?: string;
  }) => void;
  deleteMember: (id: string) => void;

  // Tasks & Shopping
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'createdAt' | 'completed'>) => void;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  shoppingItems: ShoppingItem[];
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'completed'>) => void;
  addMultipleShoppingItems: (items: Array<Omit<ShoppingItem, 'id' | 'createdAt' | 'completed'>>) => void;
  updateShoppingItem: (id: string, updates: Partial<ShoppingItem>) => void;
  toggleShoppingItem: (id: string) => void;
  deleteShoppingItem: (id: string) => void;

  // Budget
  expenses: ExpenseItem[];
  monthlyIncome: number;
  savingsGoal: number;
  setMonthlyIncome: (income: number) => void;
  setSavingsGoal: (goal: number) => void;
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<ExpenseItem>) => void;
  deleteExpense: (id: string) => void;

  // Calendar
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Documents
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;

  // Schedules / Chores
  chores: ChoreRotation[];
  rotateChore: (id: string) => void;
  toggleChoreCompleted: (id: string) => void;
  swapChoreMember: (id: string, targetMemberId: string) => void;
  addChore: (chore: Omit<ChoreRotation, 'id' | 'lastRotatedDate' | 'completedToday' | 'currentMemberIndex'>) => void;
  updateChore: (id: string, updates: Partial<ChoreRotation>) => void;
  deleteChore: (id: string) => void;

  // Meals
  meals: MealPlanDay[];
  updateMealDay: (dayName: string, updates: Partial<MealPlanDay>) => void;
  clearMealDay: (dayName: string) => void;
  exportMealPlanToShoppingList: () => number;

  // Email & Push Notifications
  sentEmails: EmailNotificationLog[];
  sendEmailReminder: (params: { to: string; subject: string; body: string; sourceType: 'calendario' | 'tarea' | 'documento' | 'salud'; title?: string }) => void;
  clearSentEmails: () => void;
  browserNotificationsEnabled: boolean;
  requestBrowserNotifications: () => Promise<boolean>;

  // Gallery
  albums: GalleryAlbum[];
  photos: GalleryPhoto[];
  addPhoto: (photo: Omit<GalleryPhoto, 'id' | 'likes'>) => void;
  deletePhoto: (id: string) => void;
  likePhoto: (id: string) => void;
  addAlbum: (album: Omit<GalleryAlbum, 'id'>) => void;

  // Health
  medications: MedicationReminder[];
  toggleMedicationTaken: (id: string) => void;
  addMedication: (med: Omit<MedicationReminder, 'id' | 'takenToday'>) => void;
  updateMedication: (id: string, updates: Partial<MedicationReminder>) => void;
  deleteMedication: (id: string) => void;
  medicalRecords: MedicalRecord[];
  addMedicalRecord: (rec: Omit<MedicalRecord, 'id'>) => void;
  updateMedicalRecord: (id: string, updates: Partial<MedicalRecord>) => void;
  deleteMedicalRecord: (id: string) => void;

  // UI helpers
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  triggerConfetti: () => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Members & Accounts
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [accounts, setAccounts] = useState<Array<{ email: string; password?: string; memberId: string }>>(INITIAL_ACCOUNTS);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const defaultMember = INITIAL_MEMBERS[0];
    return {
      id: 'usr-1',
      email: defaultMember.email || 'lachicadelaesquinita@gmail.com',
      name: defaultMember.name,
      role: defaultMember.role,
      avatar: defaultMember.avatar,
      memberId: defaultMember.id,
      familyId: 'fam-84920',
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Navigation & Preferences
  const [activeTab, setActiveTabState] = useState<TabType>('resumen');
  const [activeMemberId, setActiveMemberIdState] = useState<string>('all');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [familyName, setFamilyNameState] = useState<string>('Familia Gómez Morales');
  const [inviteCode] = useState<string>('FAM-84920');

  // Entities
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(INITIAL_SHOPPING);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [monthlyIncome, setMonthlyIncomeState] = useState<number>(3200);
  const [savingsGoal, setSavingsGoalState] = useState<number>(650);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [chores, setChores] = useState<ChoreRotation[]>(INITIAL_CHORES);
  const [meals, setMeals] = useState<MealPlanDay[]>(INITIAL_MEALS);
  const [albums, setAlbums] = useState<GalleryAlbum[]>(INITIAL_ALBUMS);
  const [photos, setPhotos] = useState<GalleryPhoto[]>(INITIAL_PHOTOS);
  const [medications, setMedications] = useState<MedicationReminder[]>(INITIAL_MEDICATIONS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);
  const [sentEmails, setSentEmails] = useState<EmailNotificationLog[]>([]);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // 1. CARGAR ESTADO DESDE SUPABASE AL INICIAR
  const cargarEstadoSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('estado_familia')
        .select('datos')
        .eq('id', 'principal')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error obteniendo estado de Supabase:', error);
        return;
      }

      if (data && data.datos) {
        const d = data.datos;
        if (d.members) setMembers(d.members);
        if (d.accounts) setAccounts(d.accounts);
        if (d.tasks) setTasks(d.tasks);
        if (d.shoppingItems) setShoppingItems(d.shoppingItems);
        if (d.expenses) setExpenses(d.expenses);
        if (d.monthlyIncome) setMonthlyIncomeState(d.monthlyIncome);
        if (d.savingsGoal) setSavingsGoalState(d.savingsGoal);
        if (d.events) setEvents(d.events);
        if (d.documents) setDocuments(d.documents);
        if (d.chores) setChores(d.chores);
        if (d.meals) setMeals(d.meals);
        if (d.albums) setAlbums(d.albums);
        if (d.photos) setPhotos(d.photos);
        if (d.medications) setMedications(d.medications);
        if (d.medicalRecords) setMedicalRecords(d.medicalRecords);
        if (d.familyName) setFamilyNameState(d.familyName);
      }
    } catch (e) {
      console.error('Excepción al conectar con Supabase:', e);
    }
  };

  // 2. ESCUCHAR TIEMPO REAL EN LA TABLA "estado_familia"
  useEffect(() => {
    cargarEstadoSupabase();

    const canal = supabase
      .channel('realtime-estado-familia')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'estado_familia' },
        (payload) => {
          console.log('¡Cambio detectado desde otro dispositivo!', payload);
          cargarEstadoSupabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  // 3. GUARDAR ESTADO EN SUPABASE AL HACER UN CAMBIO
  const guardarEnSupabase = async (nuevosDatos: Record<string, any>) => {
    try {
      const estadoCompleto = {
        members: nuevosDatos.members ?? members,
        accounts: nuevosDatos.accounts ?? accounts,
        tasks: nuevosDatos.tasks ?? tasks,
        shoppingItems: nuevosDatos.shoppingItems ?? shoppingItems,
        expenses: nuevosDatos.expenses ?? expenses,
        monthlyIncome: nuevosDatos.monthlyIncome ?? monthlyIncome,
        savingsGoal: nuevosDatos.savingsGoal ?? savingsGoal,
        events: nuevosDatos.events ?? events,
        documents: nuevosDatos.documents ?? documents,
        chores: nuevosDatos.chores ?? chores,
        meals: nuevosDatos.meals ?? meals,
        albums: nuevosDatos.albums ?? albums,
        photos: nuevosDatos.photos ?? photos,
        medications: nuevosDatos.medications ?? medications,
        medicalRecords: nuevosDatos.medicalRecords ?? medicalRecords,
        familyName: nuevosDatos.familyName ?? familyName,
      };

      await supabase
        .from('estado_familia')
        .upsert({ id: 'principal', datos: estadoCompleto, updated_at: new Date() });
    } catch (err) {
      console.error('Error al guardar en Supabase:', err);
    }
  };

  // Sync dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.75 }
      });
    } catch {}
  };

  // Auth Operations
  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedAccount = accounts.find(a => a.email.toLowerCase() === normalizedEmail);
    const matchedMember = members.find(m => m.email?.toLowerCase() === normalizedEmail || m.id === matchedAccount?.memberId);

    if (matchedMember) {
      const user: AuthUser = {
        id: 'usr-' + matchedMember.id,
        email: normalizedEmail,
        name: matchedMember.name,
        role: matchedMember.role,
        avatar: matchedMember.avatar,
        memberId: matchedMember.id,
        familyId: inviteCode,
      };
      setCurrentUser(user);
      setActiveMemberId(matchedMember.id);
      setIsAuthModalOpen(false);
      showToast(`¡Bienvenido de vuelta, ${matchedMember.name}!`, 'success');
      return { success: true, message: 'Autenticación exitosa' };
    }

    return {
      success: false,
      message: 'No encontramos una cuenta con ese correo. Por favor, regístrate para crear tu acceso.'
    };
  };

  const register = async (data: {
    name: string;
    email: string;
    password?: string;
    role: FamilyMember['role'];
    avatar?: string;
    color?: string;
    bloodType?: string;
    allergies?: string[];
    phone?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = members.find(m => m.email?.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, message: 'Ya existe una cuenta con este correo electrónico. Inicia sesión.' };
    }

    const newMemberId = 'm-' + Date.now();
    const newMember: FamilyMember = {
      id: newMemberId,
      name: data.name.trim(),
      role: data.role,
      avatar: data.avatar || '🧑',
      color: data.color || '#6366f1',
      email: normalizedEmail,
      phone: data.phone?.trim() || undefined,
      bloodType: data.bloodType || 'A+',
      allergies: data.allergies || [],
    };

    const nextMembers = [...members, newMember];
    const nextAccounts = [...accounts, { email: normalizedEmail, password: data.password || 'pass', memberId: newMemberId }];

    setMembers(nextMembers);
    setAccounts(nextAccounts);
    guardarEnSupabase({ members: nextMembers, accounts: nextAccounts });

    const user: AuthUser = {
      id: 'usr-' + newMemberId,
      email: normalizedEmail,
      name: newMember.name,
      role: newMember.role,
      avatar: newMember.avatar,
      memberId: newMemberId,
      familyId: inviteCode,
    };
    setCurrentUser(user);
    setActiveMemberId(newMemberId);
    setIsAuthModalOpen(false);
    triggerConfetti();
    showToast(`¡Cuenta creada con éxito! Bienvenido, ${newMember.name}.`, 'success');

    return { success: true, message: 'Cuenta creada' };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveMemberId('all');
    showToast('Sesión cerrada correctamente', 'info');
  };

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveMemberId = (id: string) => setActiveMemberIdState(id);
  const setFamilyName = (name: string) => {
    setFamilyNameState(name);
    guardarEnSupabase({ familyName: name });
    showToast('Nombre de la familia actualizado', 'success');
  };
  const setMonthlyIncome = (income: number) => {
    setMonthlyIncomeState(income);
    guardarEnSupabase({ monthlyIncome: income });
  };
  const setSavingsGoal = (goal: number) => {
    setSavingsGoalState(goal);
    guardarEnSupabase({ savingsGoal: goal });
  };

  const activeMember = members.find(m => m.id === activeMemberId);

  // Members mutations
  const addMember = (m: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = { ...m, id: 'm-' + Date.now() };
    const next = [...members, newMember];
    setMembers(next);
    guardarEnSupabase({ members: next });
    showToast(`¡Se ha añadido a ${m.name} a la familia!`, 'success');
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    const next = members.map(m => m.id === id ? { ...m, ...updates } : m);
    setMembers(next);
    guardarEnSupabase({ members: next });

    if (currentUser && currentUser.memberId === id) {
      setCurrentUser(prev => prev ? {
        ...prev,
        name: updates.name || prev.name,
        role: updates.role || prev.role,
        avatar: updates.avatar || prev.avatar,
        email: updates.email || prev.email,
      } : null);
    }
    showToast('Perfil actualizado correctamente', 'success');
  };

  const updateMemberHealthProfile = (id: string, health: {
    bloodType?: string;
    allergies?: string[];
    emergencyContact?: string;
    medicalNotes?: string;
  }) => {
    const next = members.map(m => m.id === id ? { ...m, ...health } : m);
    setMembers(next);
    guardarEnSupabase({ members: next });
    showToast('Ficha médica y datos de salud guardados', 'success');
  };

  const deleteMember = (id: string) => {
    if (members.length <= 1) {
      showToast('Debe haber al menos un miembro en la familia', 'warning');
      return;
    }
    const next = members.filter(m => m.id !== id);
    setMembers(next);
    guardarEnSupabase({ members: next });
    if (activeMemberId === id) setActiveMemberId('all');
    showToast('Miembro eliminado del hogar', 'info');
  };

  // Tasks mutations
  const addTask = (taskData: Omit<TaskItem, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: 't-' + Date.now(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const next = [newTask, ...tasks];
    setTasks(next);
    guardarEnSupabase({ tasks: next });
    showToast('Nueva tarea añadida', 'success');
  };

  const updateTask = (id: string, updates: Partial<TaskItem>) => {
    const next = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    setTasks(next);
    guardarEnSupabase({ tasks: next });
    showToast('Tarea editada y actualizada', 'success');
  };

  const toggleTask = (id: string) => {
    const next = tasks.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) triggerConfetti();
        return {
          ...t,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    setTasks(next);
    guardarEnSupabase({ tasks: next });
  };

  const deleteTask = (id: string) => {
    const next = tasks.filter(t => t.id !== id);
    setTasks(next);
    guardarEnSupabase({ tasks: next });
    showToast('Tarea eliminada', 'info');
  };

  // Shopping mutations
  const addShoppingItem = (itemData: Omit<ShoppingItem, 'id' | 'createdAt' | 'completed'>) => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: 's-' + Date.now(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const next = [newItem, ...shoppingItems];
    setShoppingItems(next);
    guardarEnSupabase({ shoppingItems: next });
    showToast('Artículo añadido a la lista de compras', 'success');
  };

  const addMultipleShoppingItems = (newItems: Array<Omit<ShoppingItem, 'id' | 'createdAt' | 'completed'>>) => {
    const created: ShoppingItem[] = newItems.map((item, idx) => ({
      ...item,
      id: 's-' + (Date.now() + idx),
      completed: false,
      createdAt: new Date().toISOString(),
    }));
    const next = [...created, ...shoppingItems];
    setShoppingItems(next);
    guardarEnSupabase({ shoppingItems: next });
  };

  const updateShoppingItem = (id: string, updates: Partial<ShoppingItem>) => {
    const next = shoppingItems.map(s => s.id === id ? { ...s, ...updates } : s);
    setShoppingItems(next);
    guardarEnSupabase({ shoppingItems: next });
    showToast('Producto de compra actualizado', 'success');
  };

  const toggleShoppingItem = (id: string) => {
    const next = shoppingItems.map(s => {
      if (s.id === id) {
        const nextState = !s.completed;
        if (nextState) triggerConfetti();
        return {
          ...s,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return s;
    });
    setShoppingItems(next);
    guardarEnSupabase({ shoppingItems: next });
  };

  const deleteShoppingItem = (id: string) => {
    const next = shoppingItems.filter(s => s.id !== id);
    setShoppingItems(next);
    guardarEnSupabase({ shoppingItems: next });
    showToast('Artículo de compra retirado', 'info');
  };

  // Expenses mutations
  const addExpense = (expenseData: Omit<ExpenseItem, 'id'>) => {
    const newExpense: ExpenseItem = {
      ...expenseData,
      id: 'e-' + Date.now(),
    };
    const next = [newExpense, ...expenses];
    setExpenses(next);
    guardarEnSupabase({ expenses: next });
    showToast('Gasto registrado correctamente', 'success');
  };

  const updateExpense = (id: string, updates: Partial<ExpenseItem>) => {
    const next = expenses.map(e => e.id === id ? { ...e, ...updates } : e);
    setExpenses(next);
    guardarEnSupabase({ expenses: next });
    showToast('Gasto modificado', 'success');
  };

  const deleteExpense = (id: string) => {
    const next = expenses.filter(e => e.id !== id);
    setExpenses(next);
    guardarEnSupabase({ expenses: next });
    showToast('Gasto eliminado', 'info');
  };

  // Calendar mutations
  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: 'ev-' + Date.now(),
    };
    const next = [...events, newEvent];
    setEvents(next);
    guardarEnSupabase({ events: next });
    showToast('Evento añadido al calendario', 'success');
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    const next = events.map(e => e.id === id ? { ...e, ...updates } : e);
    setEvents(next);
    guardarEnSupabase({ events: next });
    showToast('Evento actualizado', 'success');
  };

  const deleteEvent = (id: string) => {
    const next = events.filter(e => e.id !== id);
    setEvents(next);
    guardarEnSupabase({ events: next });
    showToast('Evento cancelado', 'info');
  };

  // Documents mutations
  const addDocument = (docData: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: 'd-' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0],
    };
    const next = [newDoc, ...documents];
    setDocuments(next);
    guardarEnSupabase({ documents: next });
    showToast('Documento guardado en la bóveda', 'success');
  };

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    const next = documents.map(d => d.id === id ? { ...d, ...updates } : d);
    setDocuments(next);
    guardarEnSupabase({ documents: next });
    showToast('Documento actualizado', 'success');
  };

  const deleteDocument = (id: string) => {
    const next = documents.filter(d => d.id !== id);
    setDocuments(next);
    guardarEnSupabase({ documents: next });
    showToast('Documento eliminado', 'info');
  };

  // Chores mutations
  const rotateChore = (id: string) => {
    const next = chores.map(c => {
      if (c.id === id) {
        const nextIdx = (c.currentMemberIndex + 1) % c.assignedMemberIds.length;
        return {
          ...c,
          currentMemberIndex: nextIdx,
          lastRotatedDate: new Date().toISOString().split('T')[0],
          completedToday: false,
        };
      }
      return c;
    });
    setChores(next);
    guardarEnSupabase({ chores: next });
    showToast('Turno de tarea rotado', 'success');
  };

  const toggleChoreCompleted = (id: string) => {
    const next = chores.map(c => {
      if (c.id === id) {
        const state = !c.completedToday;
        if (state) triggerConfetti();
        return { ...c, completedToday: state };
      }
      return c;
    });
    setChores(next);
    guardarEnSupabase({ chores: next });
  };

  const swapChoreMember = (id: string, targetMemberId: string) => {
    const next = chores.map(c => {
      if (c.id === id) {
        const idx = c.assignedMemberIds.indexOf(targetMemberId);
        if (idx !== -1) {
          return { ...c, currentMemberIndex: idx };
        }
      }
      return c;
    });
    setChores(next);
    guardarEnSupabase({ chores: next });
    showToast('Responsable de la tarea cambiado', 'success');
  };

  const addChore = (choreData: Omit<ChoreRotation, 'id' | 'lastRotatedDate' | 'completedToday' | 'currentMemberIndex'>) => {
    const newChore: ChoreRotation = {
      ...choreData,
      id: 'c-' + Date.now(),
      currentMemberIndex: 0,
      completedToday: false,
      lastRotatedDate: new Date().toISOString().split('T')[0],
    };
    const next = [...chores, newChore];
    setChores(next);
    guardarEnSupabase({ chores: next });
    showToast('Nueva rutina de hogar creada', 'success');
  };

  const updateChore = (id: string, updates: Partial<ChoreRotation>) => {
    const next = chores.map(c => c.id === id ? { ...c, ...updates } : c);
    setChores(next);
    guardarEnSupabase({ chores: next });
    showToast('Rutina actualizada', 'success');
  };

  const deleteChore = (id: string) => {
    const next = chores.filter(c => c.id !== id);
    setChores(next);
    guardarEnSupabase({ chores: next });
    showToast('Rutina eliminada', 'info');
  };

  // Meals mutations
  const updateMealDay = (dayName: string, updates: Partial<MealPlanDay>) => {
    const next = meals.map(m => m.day === dayName ? { ...m, ...updates } : m);
    setMeals(next);
    guardarEnSupabase({ meals: next });
    showToast('Menú del día actualizado', 'success');
  };

  const clearMealDay = (dayName: string) => {
    const next = meals.map(m => m.day === dayName ? { day: dayName, breakfast: '', lunch: '', dinner: '', snacks: '' } : m);
    setMeals(next);
    guardarEnSupabase({ meals: next });
    showToast('Menú del día limpiado', 'info');
  };

  const exportMealPlanToShoppingList = (): number => {
    let addedCount = 0;
    const newItems: Array<Omit<ShoppingItem, 'id' | 'createdAt' | 'completed'>> = [];

    meals.forEach(m => {
      [m.breakfast, m.lunch, m.dinner, m.snacks].forEach(meal => {
        if (meal && meal.trim()) {
          newItems.push({
            name: meal.trim(),
            category: 'Supermercado',
            quantity: 1,
            unit: 'unidad',
            assignedTo: 'all',
          });
          addedCount++;
        }
      });
    });

    if (newItems.length > 0) {
      addMultipleShoppingItems(newItems);
      showToast(`Se agregaron ${addedCount} ingredientes al menú de compras`, 'success');
    }
    return addedCount;
  };

  // Notifications
  const sendEmailReminder = (params: { to: string; subject: string; body: string; sourceType: 'calendario' | 'tarea' | 'documento' | 'salud'; title?: string }) => {
    const log: EmailNotificationLog = {
      id: 'em-' + Date.now(),
      to: params.to,
      subject: params.subject,
      body: params.body,
      sourceType: params.sourceType,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };
    setSentEmails(prev => [log, ...prev]);
    showToast(`Notificación enviada a ${params.to}`, 'success');
  };

  const clearSentEmails = () => setSentEmails([]);

  const requestBrowserNotifications = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    const perm = await Notification.requestPermission();
    const isGranted = perm === 'granted';
    setBrowserNotificationsEnabled(isGranted);
    return isGranted;
  };

  // Gallery mutations
  const addPhoto = (photoData: Omit<GalleryPhoto, 'id' | 'likes'>) => {
    const newPhoto: GalleryPhoto = {
      ...photoData,
      id: 'p-' + Date.now(),
      likes: 0,
    };
    const next = [newPhoto, ...photos];
    setPhotos(next);
    guardarEnSupabase({ photos: next });
    showToast('Foto subida al álbum familiar', 'success');
  };

  const deletePhoto = (id: string) => {
    const next = photos.filter(p => p.id !== id);
    setPhotos(next);
    guardarEnSupabase({ photos: next });
    showToast('Foto eliminada', 'info');
  };

  const likePhoto = (id: string) => {
    const next = photos.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
    setPhotos(next);
    guardarEnSupabase({ photos: next });
    triggerConfetti();
  };

  const addAlbum = (albumData: Omit<GalleryAlbum, 'id'>) => {
    const newAlbum: GalleryAlbum = {
      ...albumData,
      id: 'alb-' + Date.now(),
    };
    const next = [...albums, newAlbum];
    setAlbums(next);
    guardarEnSupabase({ albums: next });
    showToast('Nuevo álbum creado', 'success');
  };

  // Health mutations
  const toggleMedicationTaken = (id: string) => {
    const next = medications.map(m => {
      if (m.id === id) {
        const state = !m.takenToday;
        if (state) triggerConfetti();
        return { ...m, takenToday: state };
      }
      return m;
    });
    setMedications(next);
    guardarEnSupabase({ medications: next });
  };

  const addMedication = (medData: Omit<MedicationReminder, 'id' | 'takenToday'>) => {
    const newMed: MedicationReminder = {
      ...medData,
      id: 'med-' + Date.now(),
      takenToday: false,
    };
    const next = [...medications, newMed];
    setMedications(next);
    guardarEnSupabase({ medications: next });
    showToast('Recordatorio de medicamento registrado', 'success');
  };

  const updateMedication = (id: string, updates: Partial<MedicationReminder>) => {
    const next = medications.map(m => m.id === id ? { ...m, ...updates } : m);
    setMedications(next);
    guardarEnSupabase({ medications: next });
    showToast('Medicamento actualizado', 'success');
  };

  const deleteMedication = (id: string) => {
    const next = medications.filter(m => m.id !== id);
    setMedications(next);
    guardarEnSupabase({ medications: next });
    showToast('Medicamento eliminado', 'info');
  };

  const addMedicalRecord = (recData: Omit<MedicalRecord, 'id'>) => {
    const newRec: MedicalRecord = {
      ...recData,
      id: 'rec-' + Date.now(),
    };
    const next = [newRec, ...medicalRecords];
    setMedicalRecords(next);
    guardarEnSupabase({ medicalRecords: next });
    showToast('Historial médico guardado', 'success');
  };

  const updateMedicalRecord = (id: string, updates: Partial<MedicalRecord>) => {
    const next = medicalRecords.map(r => r.id === id ? { ...r, ...updates } : r);
    setMedicalRecords(next);
    guardarEnSupabase({ medicalRecords: next });
    showToast('Registro médico actualizado', 'success');
  };

  const deleteMedicalRecord = (id: string) => {
    const next = medicalRecords.filter(r => r.id !== id);
    setMedicalRecords(next);
    guardarEnSupabase({ medicalRecords: next });
    showToast('Registro médico eliminado', 'info');
  };

  return (
    <FamilyContext.Provider value={{
      currentUser, login, register, logout, isAuthModalOpen, authModalMode, openAuthModal, closeAuthModal,
      activeTab, setActiveTab, activeMemberId, setActiveMemberId, darkMode, toggleDarkMode, familyName, setFamilyName, inviteCode, activeMember,
      members, addMember, updateMember, updateMemberHealthProfile, deleteMember,
      tasks, addTask, updateTask, toggleTask, deleteTask,
      shoppingItems, addShoppingItem, addMultipleShoppingItems, updateShoppingItem, toggleShoppingItem, deleteShoppingItem,
      expenses, monthlyIncome, savingsGoal, setMonthlyIncome, setSavingsGoal, addExpense, updateExpense, deleteExpense,
      events, addEvent, updateEvent, deleteEvent,
      documents, addDocument, updateDocument, deleteDocument,
      chores, rotateChore, toggleChoreCompleted, swapChoreMember, addChore, updateChore, deleteChore,
      meals, updateMealDay, clearMealDay, exportMealPlanToShoppingList,
      sentEmails, sendEmailReminder, clearSentEmails, browserNotificationsEnabled, requestBrowserNotifications,
      albums, photos, addPhoto, deletePhoto, likePhoto, addAlbum,
      medications, toggleMedicationTaken, addMedication, updateMedication, deleteMedication,
      medicalRecords, addMedicalRecord, updateMedicalRecord, deleteMedicalRecord,
      toasts, showToast, triggerConfetti
    }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily debe usarse dentro de un FamilyProvider');
  }
  return context;
};
