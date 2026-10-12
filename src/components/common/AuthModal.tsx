import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Heart,
  Phone,
  AlertCircle
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    openAuthModal, 
    login, 
    register, 
    members,
    showToast 
  } = useFamily();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<FamilyMember['role']>('Mamá');
  const [regAvatar, setRegAvatar] = useState('👩‍💼');
  const [regColor, setRegColor] = useState('#8b5cf6');
  const [regBloodType, setRegBloodType] = useState('A+');
  const [regAllergies, setRegAllergies] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep in sync with opened mode
  React.useEffect(() => {
    setMode(authModalMode);
    setErrorMessage('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const avatarChoices = ['👩‍💼', '👨‍🔧', '👧', '👦', '👵', '👴', '🧑‍🎨', '👩‍⚕️', '👨‍🎓', '🐶'];
  const colorChoices = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#6366f1'];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    const res = await login(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    const res = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      avatar: regAvatar,
      color: regColor,
      bloodType: regBloodType,
      allergies: regAllergies ? regAllergies.split(',').map(s => s.trim()).filter(Boolean) : [],
      phone: regPhone,
    });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleQuickLogin = (email: string) => {
    setLoginEmail(email);
    login(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-850 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-700 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-750">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                {mode === 'login' ? 'Iniciar Sesión en el Hogar' : 'Crear Cuenta Familiar'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Accede con tu correo para sincronizar tus tareas y datos
              </p>
            </div>
          </div>
          <button 
            onClick={closeAuthModal}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-white p-2 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 my-5">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Ya tengo cuenta</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(''); }}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Crear cuenta nueva</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {mode === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Correo Electrónico *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all mt-2"
            >
              {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>

            {/* Quick Login Accounts list for fast testing */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2 text-center">
                O entra con un toque rápido:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {members.slice(0, 4).map(m => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => handleQuickLogin(m.email || 'correo@familia.com')}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-stone-200 dark:border-stone-700 text-left transition-colors"
                  >
                    <span className="text-lg">{m.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">{m.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-stone-400 truncate">{m.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Tu Nombre Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Elena Gómez, Carlos Morales..."
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="tucorreo@gmail.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Rol en el hogar
                </label>
                <select
                  value={regRole}
                  onChange={e => setRegRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                >
                  <option value="Mamá">Mamá</option>
                  <option value="Papá">Papá</option>
                  <option value="Hijo">Hijo</option>
                  <option value="Hija">Hija</option>
                  <option value="Abuelo">Abuelo</option>
                  <option value="Abuela">Abuela</option>
                  <option value="Tutor">Tutor / Pareja</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Grupo Sanguíneo (Salud)
                </label>
                <select
                  value={regBloodType}
                  onChange={e => setRegBloodType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none font-bold"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="0+">0+</option>
                  <option value="0-">0-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            {/* Avatar & Color selection */}
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Elige tu Avatar y Color
              </label>
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 mb-2">
                {avatarChoices.map(av => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setRegAvatar(av)}
                    className={`text-xl p-1.5 rounded-xl border transition-all ${
                      regAvatar === av ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 scale-110' : 'border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                {colorChoices.map(col => (
                  <button
                    type="button"
                    key={col}
                    onClick={() => setRegColor(col)}
                    className={`w-6 h-6 rounded-full transition-transform ${regColor === col ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Alergias o Condiciones Médicas (Salud)
              </label>
              <input
                type="text"
                placeholder="Ej. Polen, Penicilina, Frutos secos (separadas por coma)"
                value={regAllergies}
                onChange={e => setRegAllergies(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Teléfono de Contacto (Opcional)
              </label>
              <input
                type="tel"
                placeholder="+34 600 000 000"
                value={regPhone}
                onChange={e => setRegPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all mt-3"
            >
              {isSubmitting ? 'Registrando...' : 'Crear Mi Cuenta & Entrar'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
