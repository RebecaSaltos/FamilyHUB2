export type TabType = 
  | 'resumen'
  | 'listas'
  | 'presupuesto'
  | 'calendario'
  | 'documentos'
  | 'horarios'
  | 'comidas'
  | 'galeria'
  | 'salud'
  | 'familia';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'Mamá' | 'Papá' | 'Hijo' | 'Hija' | 'Abuelo' | 'Abuela' | 'Tutor' | 'Otro';
  avatar: string;
  memberId: string;
  familyId: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'Mamá' | 'Papá' | 'Hijo' | 'Hija' | 'Abuelo' | 'Abuela' | 'Tutor' | 'Otro';
  avatar: string; // Emoji or image URL
  color: string; // Tailwind color hex or class
  email?: string;
  phone?: string;
  bloodType?: string;
  allergies?: string[];
  emergencyContact?: string;
  medicalNotes?: string;
}

export type TaskType = 'tarea' | 'compra';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  type: 'tarea';
  assignedTo: string; // memberId or 'all'
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  priority: 'baja' | 'media' | 'alta';
  notifyEmail?: boolean;
  targetEmail?: string;
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  title: string;
  type: 'compra';
  category: 'Supermercado' | 'Frutería' | 'Farmacia' | 'Hogar' | 'Mascotas' | 'Otro';
  quantity: string;
  assignedTo: string; // memberId or 'all'
  estimatedPrice?: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface ExpenseItem {
  id: string;
  concept: string;
  amount: number;
  date: string;
  category: 'Alimentación' | 'Vivienda' | 'Servicios' | 'Salud' | 'Educación' | 'Transporte' | 'Ocio' | 'Otros';
  paidBy: string; // memberId
  splitBetween: string[]; // memberIds or ['all']
  receiptUrl?: string;
}

export interface BudgetConfig {
  monthlyIncome: number;
  savingsGoal: number;
  month: string; // YYYY-MM
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  type: 'familiar' | 'medica' | 'colegio' | 'cumpleanos' | 'hogar';
  assignedTo: string; // memberId or 'all'
  location?: string;
  notes?: string;
  reminderMinutes: number; // e.g. 15, 60, 1440
  notifyEmail?: boolean;
  targetEmail?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Recibos' | 'Garantías' | 'Contratos' | 'Identificación' | 'Salud' | 'Otros';
  memberId?: string; // if personal or whole family
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  expiryDate?: string; // for warranty or IDs
  notes?: string;
  notifyEmail?: boolean;
  targetEmail?: string;
  uploadDate: string;
}

export interface EmailNotificationLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  sourceType: 'calendario' | 'tarea' | 'documento' | 'salud';
}

export interface ChoreRotation {
  id: string;
  name: string;
  description: string;
  frequency: 'diaria' | 'semanal';
  membersOrder: string[]; // array of memberIds in rotating order
  currentMemberIndex: number;
  lastRotatedDate: string;
  icon: string;
  completedToday: boolean;
}

export interface MealPlanDay {
  dayName: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  dateStr?: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  ingredients: string[];
}

export interface GalleryPhoto {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  album: string;
  taggedMembers: string[];
  likes: number;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  coverUrl: string;
  description?: string;
}

export interface MedicationReminder {
  id: string;
  memberId: string;
  medicationName: string;
  dosage: string;
  frequency: string; // e.g., "Cada 8 horas", "1 vez al día (mañana)"
  timesPerDay: string[]; // ["08:00", "16:00", "00:00"]
  startDate: string;
  endDate?: string;
  takenToday: boolean;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  memberId: string;
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  clinic: string;
  diagnosisNotes: string;
  prescriptions?: string;
  nextFollowUp?: string;
}
