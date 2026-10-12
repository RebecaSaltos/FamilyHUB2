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

    const user:
