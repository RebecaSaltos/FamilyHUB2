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
  activeMemberId: string; // memberId or 'all'
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

const STORAGE_PREFIX = 'famili_app_v2_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Members
  const [members, setMembers] = useState<FamilyMember[]>(() => getStored('members', INITIAL_MEMBERS));

  // Registered accounts db
  const [accounts, setAccounts] = useState<Array<{ email: string; password?: string; memberId: string }>>(() => 
    getStored('accounts', INITIAL_ACCOUNTS)
  );

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const stored = getStored<AuthUser | null>('currentUser', null);
    if (stored) return stored;
    // Default logged in as Elena (or user's email) so the app is immediately active, while fully allowing login/register
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
  const [activeTab, setActiveTabState] = useState<TabType>(() => getStored('activeTab', 'resumen'));
  const [activeMemberId, setActiveMemberIdState] = useState<string>(() => {
    const stored = getStored('activeMemberId', 'all');
    return stored;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = getStored<boolean | null>('darkMode', null);
    if (stored !== null) return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [familyName, setFamilyNameState] = useState<string>(() => getStored('familyName', 'Familia Gómez Morales'));
  const [inviteCode] = useState<string>('FAM-84920');

  // Entities
  const [tasks, setTasks] = useState<TaskItem[]>(() => getStored('tasks', INITIAL_TASKS));
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => getStored('shopping', INITIAL_SHOPPING));
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => getStored('expenses', INITIAL_EXPENSES));
  const [monthlyIncome, setMonthlyIncomeState] = useState<number>(() => getStored('monthlyIncome', 3200));
  const [savingsGoal, setSavingsGoalState] = useState<number>(() => getStored('savingsGoal', 650));
  const [events, setEvents] = useState<CalendarEvent[]>(() => getStored('events', INITIAL_EVENTS));
  const [documents, setDocuments] = useState<DocumentItem[]>(() => getStored('documents', INITIAL_DOCUMENTS));
  const [chores, setChores] = useState<ChoreRotation[]>(() => getStored('chores', INITIAL_CHORES));
  const [meals, setMeals] = useState<MealPlanDay[]>(() => getStored('meals', INITIAL_MEALS));
  const [albums, setAlbums] = useState<GalleryAlbum[]>(() => getStored('albums', INITIAL_ALBUMS));
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => getStored('photos', INITIAL_PHOTOS));
  const [medications, setMedications] = useState<MedicationReminder[]>(() => getStored('medications', INITIAL_MEDICATIONS));
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => getStored('medicalRecords', INITIAL_MEDICAL_RECORDS));

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setStored('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Sync to local storage
  useEffect(() => { setStored('currentUser', currentUser); }, [currentUser]);
  useEffect(() => { setStored('accounts', accounts); }, [accounts]);
  useEffect(() => { setStored('activeTab', activeTab); }, [activeTab]);
  useEffect(() => { setStored('activeMemberId', activeMemberId); }, [activeMemberId]);
  useEffect(() => { setStored('familyName', familyName); }, [familyName]);
  useEffect(() => { setStored('members', members); }, [members]);
  useEffect(() => { setStored('tasks', tasks); }, [tasks]);
  useEffect(() => { setStored('shopping', shoppingItems); }, [shoppingItems]);
  useEffect(() => { setStored('expenses', expenses); }, [expenses]);
  useEffect(() => { setStored('monthlyIncome', monthlyIncome); }, [monthlyIncome]);
  useEffect(() => { setStored('savingsGoal', savingsGoal); }, [savingsGoal]);
  useEffect(() => { setStored('events', events); }, [events]);
  useEffect(() => { setStored('documents', documents); }, [documents]);
  useEffect(() => { setStored('chores', chores); }, [chores]);
  useEffect(() => { setStored('meals', meals); }, [meals]);
  useEffect(() => { setStored('albums', albums); }, [albums]);
  useEffect(() => { setStored('photos', photos); }, [photos]);
  useEffect(() => { setStored('medications', medications); }, [medications]);
  useEffect(() => { setStored('medicalRecords', medicalRecords); }, [medicalRecords]);

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
    } catch {
      // ignore
    }
  };

  // Auth Operations
  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Look up in existing accounts or members
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

    // If email is new but user wants to log in, allow immediate creation of account or prompt
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

    // Check if email already registered
    const existing = members.find(m => m.email?.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, message: 'Ya existe una cuenta con este correo electrónico. Inicia sesión.' };
    }

    // Create new Member
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

    setMembers(prev => [...prev, newMember]);

    // Save in accounts
    setAccounts(prev => [...prev, { email: normalizedEmail, password: data.password || 'pass', memberId: newMemberId }]);

    // Create session
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
    showToast('Nombre de la familia actualizado', 'success');
  };
  const setMonthlyIncome = (income: number) => setMonthlyIncomeState(income);
  const setSavingsGoal = (goal: number) => setSavingsGoalState(goal);

  const activeMember = members.find(m => m.id === activeMemberId);

  // Members mutations
  const addMember = (m: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = { ...m, id: 'm-' + Date.now() };
    setMembers(prev => [...prev, newMember]);
    showToast(`¡Se ha añadido a ${m.name} a la familia!`, 'success');
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    // If updating current user's profile, sync user session too
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
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...health } : m));
    showToast('Ficha médica y datos de salud guardados', 'success');
  };

  const deleteMember = (id: string) => {
    if (members.length <= 1) {
      showToast('Debe haber al menos un miembro en la familia', 'warning');
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
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
    setTasks(prev => [newTask, ...prev]);
    showToast('Nueva tarea añadida', 'success');
  };

  const updateTask = (id: string, updates: Partial<TaskItem>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('Tarea editada y actualizada', 'success');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
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
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
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
    setShoppingItems(prev => [newItem, ...prev]);
    showToast('Artículo añadido a la lista de compras', 'success');
  };

  const addMultipleShoppingItems = (newItems: Array<Omit<ShoppingItem, 'id' | 'createdAt' | 'completed'>>) => {
    const created: ShoppingItem[] = newItems.map((item, idx) => ({
      ...item,
      id: 's-' + (Date.now() + idx),
      completed: false,
      createdAt: new Date().toISOString(),
    }));
    setShoppingItems(prev => [...created, ...prev]);
  };

  const updateShoppingItem = (id: string, updates: Partial<ShoppingItem>) => {
    setShoppingItems(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Producto de compra actualizado', 'success');
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.map(s => {
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
    }));
  };

  const deleteShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.filter(s => s.id !== id));
    showToast('Artículo de compra retirado', 'info');
  };

  // Expenses mutations
  const addExpense = (expenseData: Omit<ExpenseItem, 'id'>) => {
    const newExpense: ExpenseItem = {
      ...expenseData,
      id: 'e-' + Date.now(),
    };
    setExpenses(prev => [newExpense, ...prev]);
    showToast(`Gasto de €${expenseData.amount.toFixed(2)} registrado`, 'success');
  };

  const updateExpense = (id: string, updates: Partial<ExpenseItem>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    showToast('Gasto actualizado correctamente', 'success');
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Gasto eliminado', 'info');
  };

  // Events mutations
  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: 'ev-' + Date.now(),
    };
    setEvents(prev => [...prev, newEvent]);
    showToast('Evento añadido al calendario familiar', 'success');
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    showToast('Evento del calendario actualizado', 'success');
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('Evento eliminado', 'info');
  };

  // Documents mutations
  const addDocument = (docData: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: 'doc-' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDocuments(prev => [newDoc, ...prev]);
    showToast('Documento guardado de forma segura', 'success');
  };

  const updateDocument = (id: string, updates: Partial<DocumentItem>) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    showToast('Documento actualizado correctamente', 'success');
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    showToast('Documento eliminado', 'info');
  };

  // Chores / Horarios mutations
  const rotateChore = (id: string) => {
    setChores(prev => prev.map(chore => {
      if (chore.id === id) {
        const nextIndex = (chore.currentMemberIndex + 1) % chore.membersOrder.length;
        const nextMember = members.find(m => m.id === chore.membersOrder[nextIndex]);
        showToast(`Turno rotado. Ahora corresponde a ${nextMember?.name || 'siguiente miembro'}`, 'info');
        return {
          ...chore,
          currentMemberIndex: nextIndex,
          completedToday: false,
          lastRotatedDate: new Date().toISOString().split('T')[0],
        };
      }
      return chore;
    }));
  };

  const toggleChoreCompleted = (id: string) => {
    setChores(prev => prev.map(chore => {
      if (chore.id === id) {
        const next = !chore.completedToday;
        if (next) triggerConfetti();
        return { ...chore, completedToday: next };
      }
      return chore;
    }));
  };

  const swapChoreMember = (id: string, targetMemberId: string) => {
    setChores(prev => prev.map(chore => {
      if (chore.id === id) {
        let index = chore.membersOrder.indexOf(targetMemberId);
        if (index === -1) {
          const newOrder = [...chore.membersOrder, targetMemberId];
          index = newOrder.length - 1;
          return { ...chore, membersOrder: newOrder, currentMemberIndex: index };
        }
        return { ...chore, currentMemberIndex: index };
      }
      return chore;
    }));
    const targetMember = members.find(m => m.id === targetMemberId);
    showToast(`Turno transferido a ${targetMember?.name || 'miembro'}`, 'success');
  };

  const addChore = (choreData: Omit<ChoreRotation, 'id' | 'lastRotatedDate' | 'completedToday' | 'currentMemberIndex'>) => {
    const newChore: ChoreRotation = {
      ...choreData,
      id: 'ch-' + Date.now(),
      currentMemberIndex: 0,
      lastRotatedDate: new Date().toISOString().split('T')[0],
      completedToday: false,
    };
    setChores(prev => [...prev, newChore]);
    showToast('Nuevo turno rotativo registrado', 'success');
  };

  const updateChore = (id: string, updates: Partial<ChoreRotation>) => {
    setChores(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Turno rotativo actualizado', 'success');
  };

  const deleteChore = (id: string) => {
    setChores(prev => prev.filter(c => c.id !== id));
    showToast('Turno rotativo eliminado del hogar', 'info');
  };

  // Meals
  const updateMealDay = (dayName: string, updates: Partial<MealPlanDay>) => {
    setMeals(prev => prev.map(m => m.dayName === dayName ? { ...m, ...updates } : m));
    showToast(`Menú de ${dayName} actualizado`, 'success');
  };

  const clearMealDay = (dayName: string) => {
    setMeals(prev => prev.map(m => m.dayName === dayName ? {
      ...m,
      breakfast: '',
      lunch: '',
      snack: '',
      dinner: '',
      ingredients: [],
    } : m));
    showToast(`Menú de ${dayName} vaciado`, 'info');
  };

  // Email & Push Notifications state & actions
  const [sentEmails, setSentEmails] = useState<EmailNotificationLog[]>(() => 
    getStored('sentEmails', [
      {
        id: 'eml-1',
        to: 'lachicadelaesquinita@gmail.com',
        subject: 'Recordatorio FamiliApp: Cita Médica de Lucas Gómez',
        body: 'Hola Elena, recordatorio de tu cita médica sincronizada para mañana en Pediatría.',
        date: 'Hoy, 09:15',
        sourceType: 'calendario'
      }
    ])
  );
  useEffect(() => { setStored('sentEmails', sentEmails); }, [sentEmails]);

  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted';
    }
    return false;
  });

  const requestBrowserNotifications = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        const granted = perm === 'granted';
        setBrowserNotificationsEnabled(granted);
        if (granted) {
          showToast('Notificaciones push activadas correctamente', 'success');
          new Notification('FamiliApp', {
            body: 'Las alertas de eventos y fechas límite están activas.',
            icon: '/favicon.ico'
          });
        } else {
          showToast('Permiso de notificaciones no concedido', 'warning');
        }
        return granted;
      } catch {
        return false;
      }
    }
    showToast('Tu navegador no soporta notificaciones push nativas', 'info');
    return false;
  };

  const sendEmailReminder = ({ to, subject, body, sourceType }: { to: string; subject: string; body: string; sourceType: 'calendario' | 'tarea' | 'documento' | 'salud'; title?: string }) => {
    const targetEmail = to?.trim() || currentUser?.email || 'lachicadelaesquinita@gmail.com';
    const newLog: EmailNotificationLog = {
      id: 'eml-' + Date.now(),
      to: targetEmail,
      subject,
      body,
      date: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
      sourceType,
    };
    setSentEmails(prev => [newLog, ...prev]);
    showToast(`Recordatorio enviado a ${targetEmail}`, 'success');

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(subject, {
          body: `Aviso enviado a ${targetEmail}: ${body}`,
          icon: '/favicon.ico'
        });
      } catch (e) {
        console.error('Browser notification error', e);
      }
    }
  };

  const clearSentEmails = () => {
    setSentEmails([]);
    showToast('Historial de correos vaciado', 'info');
  };

  const exportMealPlanToShoppingList = () => {
    const existingTitles = new Set(shoppingItems.map(s => s.title.toLowerCase().trim()));
    const itemsToAdd: Array<Omit<ShoppingItem, 'id' | 'createdAt' | 'completed'>> = [];

    meals.forEach(day => {
      day.ingredients.forEach(ing => {
        const clean = ing.trim();
        if (clean && !existingTitles.has(clean.toLowerCase())) {
          existingTitles.add(clean.toLowerCase());
          itemsToAdd.push({
            title: clean,
            type: 'compra',
            category: 'Supermercado',
            quantity: '1',
            assignedTo: 'all',
          });
        }
      });
    });

    if (itemsToAdd.length > 0) {
      addMultipleShoppingItems(itemsToAdd);
      triggerConfetti();
      showToast(`¡Se añadieron ${itemsToAdd.length} ingredientes a tu lista de Compras!`, 'success');
    } else {
      showToast('Todos los ingredientes del menú semanal ya están en la lista de compras', 'info');
    }
    return itemsToAdd.length;
  };

  // Gallery
  const addPhoto = (photoData: Omit<GalleryPhoto, 'id' | 'likes'>) => {
    const newPhoto: GalleryPhoto = {
      ...photoData,
      id: 'ph-' + Date.now(),
      likes: 0,
    };
    setPhotos(prev => [newPhoto, ...prev]);
    showToast('Foto agregada a la galería familiar', 'success');
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    showToast('Foto eliminada', 'info');
  };

  const likePhoto = (id: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const addAlbum = (albumData: Omit<GalleryAlbum, 'id'>) => {
    const newAlbum: GalleryAlbum = {
      ...albumData,
      id: 'alb-' + Date.now(),
    };
    setAlbums(prev => [...prev, newAlbum]);
    showToast('Nuevo álbum creado', 'success');
  };

  // Health
  const toggleMedicationTaken = (id: string) => {
    setMedications(prev => prev.map(m => {
      if (m.id === id) {
        const next = !m.takenToday;
        if (next) triggerConfetti();
        return { ...m, takenToday: next };
      }
      return m;
    }));
  };

  const addMedication = (medData: Omit<MedicationReminder, 'id' | 'takenToday'>) => {
    const newMed: MedicationReminder = {
      ...medData,
      id: 'med-' + Date.now(),
      takenToday: false,
    };
    setMedications(prev => [...prev, newMed]);
    showToast('Recordatorio de medicamento guardado', 'success');
  };

  const updateMedication = (id: string, updates: Partial<MedicationReminder>) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    showToast('Medicamento actualizado correctamente', 'success');
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    showToast('Medicamento eliminado', 'info');
  };

  const addMedicalRecord = (recData: Omit<MedicalRecord, 'id'>) => {
    const newRec: MedicalRecord = {
      ...recData,
      id: 'mr-' + Date.now(),
    };
    setMedicalRecords(prev => [newRec, ...prev]);
    showToast('Historial médico guardado con éxito', 'success');
  };

  const updateMedicalRecord = (id: string, updates: Partial<MedicalRecord>) => {
    setMedicalRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    showToast('Historial clínico actualizado correctamente', 'success');
  };

  const deleteMedicalRecord = (id: string) => {
    setMedicalRecords(prev => prev.filter(r => r.id !== id));
    showToast('Registro clínico eliminado', 'info');
  };

  return (
    <FamilyContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        activeTab,
        setActiveTab,
        activeMemberId,
        setActiveMemberId,
        darkMode,
        toggleDarkMode,
        familyName,
        setFamilyName,
        inviteCode,
        activeMember,
        members,
        addMember,
        updateMember,
        updateMemberHealthProfile,
        deleteMember,
        tasks,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        shoppingItems,
        addShoppingItem,
        addMultipleShoppingItems,
        updateShoppingItem,
        toggleShoppingItem,
        deleteShoppingItem,
        expenses,
        monthlyIncome,
        savingsGoal,
        setMonthlyIncome,
        setSavingsGoal,
        addExpense,
        updateExpense,
        deleteExpense,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        chores,
        rotateChore,
        toggleChoreCompleted,
        swapChoreMember,
        addChore,
        updateChore,
        deleteChore,
        meals,
        updateMealDay,
        clearMealDay,
        exportMealPlanToShoppingList,
        sentEmails,
        sendEmailReminder,
        clearSentEmails,
        browserNotificationsEnabled,
        requestBrowserNotifications,
        albums,
        photos,
        addPhoto,
        deletePhoto,
        likePhoto,
        addAlbum,
        medications,
        toggleMedicationTaken,
        addMedication,
        updateMedication,
        deleteMedication,
        medicalRecords,
        addMedicalRecord,
        updateMedicalRecord,
        deleteMedicalRecord,
        toasts,
        showToast,
        triggerConfetti,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
