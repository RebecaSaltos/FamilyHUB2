import React, { useState } from 'react';
import { 
  Activity, 
  Pill, 
  Calendar, 
  FileText, 
  Plus, 
  Check, 
  Clock, 
  Trash2, 
  Edit3, 
  User, 
  Stethoscope, 
  Heart, 
  CheckCircle2,
  Sparkles,
  Phone,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { MedicationReminder, MedicalRecord, FamilyMember } from '../../types';

export const HealthTab: React.FC = () => {
  const { 
    medications, 
    toggleMedicationTaken, 
    addMedication, 
    updateMedication,
    deleteMedication, 
    medicalRecords, 
    addMedicalRecord, 
    updateMedicalRecord,
    deleteMedicalRecord, 
    members, 
    updateMemberHealthProfile,
    activeMemberId,
    showToast 
  } = useFamily();

  const [activeSubTab, setActiveSubTab] = useState<'perfiles' | 'medicinas' | 'historial'>('perfiles');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>(activeMemberId);

  // Modals
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<MedicationReminder | null>(null);

  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);

  const [editingHealthMember, setEditingHealthMember] = useState<FamilyMember | null>(null);

  // New Medication Form State
  const [medName, setMedName] = useState('');
  const [medMemberId, setMedMemberId] = useState(members[0]?.id || 'm-1');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('Cada 8 horas con comida');
  const [medTimes, setMedTimes] = useState('08:00, 16:00, 00:00');
  const [medNotes, setMedNotes] = useState('');

  // New Record Form State
  const [recTitle, setRecTitle] = useState('');
  const [recMemberId, setRecMemberId] = useState(members[0]?.id || 'm-1');
  const [recDoctor, setRecDoctor] = useState('');
  const [recSpecialty, setRecSpecialty] = useState('Pediatría');
  const [recClinic, setRecClinic] = useState('');
  const [recDate, setRecDate] = useState(new Date().toISOString().split('T')[0]);
  const [recDiagnosis, setRecDiagnosis] = useState('');
  const [recPrescription, setRecPrescription] = useState('');

  // Health Profile Edit State
  const [healthBloodType, setHealthBloodType] = useState('A+');
  const [healthAllergiesStr, setHealthAllergiesStr] = useState('');
  const [healthEmergencyContact, setHealthEmergencyContact] = useState('');
  const [healthMedicalNotes, setHealthMedicalNotes] = useState('');

  const filteredMeds = medications.filter(m => 
    selectedMemberFilter === 'all' || m.memberId === selectedMemberFilter
  );

  const filteredRecords = medicalRecords.filter(r => 
    selectedMemberFilter === 'all' || r.memberId === selectedMemberFilter
  );

  // Save new or update medication
  const handleSaveMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMedication) {
      updateMedication(editingMedication.id, {
        medicationName: editingMedication.medicationName,
        memberId: editingMedication.memberId,
        dosage: editingMedication.dosage,
        frequency: editingMedication.frequency,
        timesPerDay: typeof editingMedication.timesPerDay === 'string'
          ? (editingMedication.timesPerDay as string).split(',').map(s => s.trim())
          : editingMedication.timesPerDay,
        notes: editingMedication.notes,
      });
      setEditingMedication(null);
    } else {
      if (!medName.trim() || !medDosage.trim()) return;
      addMedication({
        memberId: medMemberId,
        medicationName: medName.trim(),
        dosage: medDosage.trim(),
        frequency: medFrequency.trim(),
        timesPerDay: medTimes.split(',').map(s => s.trim()).filter(Boolean),
        startDate: new Date().toISOString().split('T')[0],
        notes: medNotes.trim() || undefined,
      });
      setMedName('');
      setMedDosage('');
      setMedNotes('');
      setShowAddMedModal(false);
    }
  };

  // Save new or update medical record
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      updateMedicalRecord(editingRecord.id, {
        title: editingRecord.title,
        memberId: editingRecord.memberId,
        doctor: editingRecord.doctor,
        specialty: editingRecord.specialty,
        clinic: editingRecord.clinic,
        date: editingRecord.date,
        diagnosisNotes: editingRecord.diagnosisNotes,
        prescriptions: editingRecord.prescriptions,
      });
      setEditingRecord(null);
    } else {
      if (!recTitle.trim()) return;
      addMedicalRecord({
        memberId: recMemberId,
        title: recTitle.trim(),
        doctor: recDoctor.trim() || 'Dr. Médico',
        specialty: recSpecialty,
        clinic: recClinic.trim() || 'Centro de Salud',
        date: recDate,
        diagnosisNotes: recDiagnosis.trim(),
        prescriptions: recPrescription.trim() || undefined,
      });
      setRecTitle('');
      setRecDoctor('');
      setRecClinic('');
      setRecDiagnosis('');
      setRecPrescription('');
      setShowAddRecordModal(false);
    }
  };

  // Save edited health profile
  const handleSaveHealthProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHealthMember) return;

    updateMemberHealthProfile(editingHealthMember.id, {
      bloodType: healthBloodType,
      allergies: healthAllergiesStr.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: healthEmergencyContact.trim() || undefined,
      medicalNotes: healthMedicalNotes.trim() || undefined,
    });

    setEditingHealthMember(null);
  };

  const openHealthProfileEditor = (member: FamilyMember) => {
    setEditingHealthMember(member);
    setHealthBloodType(member.bloodType || 'A+');
    setHealthAllergiesStr(member.allergies ? member.allergies.join(', ') : '');
    setHealthEmergencyContact(member.emergencyContact || '');
    setHealthMedicalNotes(member.medicalNotes || '');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            Salud Familiar & Perfiles Médicos
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Información 100% editable: tipo de sangre, alergias, medicación con tomas y consultas clínicas.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto flex-wrap gap-y-2">
          <button
            onClick={() => setShowAddMedModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 transition-colors"
          >
            <Pill className="w-4 h-4 text-rose-500" />
            <span>+ Medicamento</span>
          </button>

          <button
            onClick={() => setShowAddRecordModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Stethoscope className="w-4 h-4" />
            <span>+ Cita Médica</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation and Member Selector Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          
          <div className="flex p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setActiveSubTab('perfiles')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'perfiles'
                  ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Fichas de Salud ({members.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('medicinas')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'medicinas'
                  ? 'bg-white dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>Medicamentos ({medications.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('historial')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'historial'
                  ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Consultas Médicas ({medicalRecords.length})</span>
            </button>
          </div>

          {/* Member Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <button
              onClick={() => setSelectedMemberFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedMemberFilter === 'all'
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              🏡 Todos
            </button>

            {members.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMemberFilter(m.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedMemberFilter === m.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                <span>{m.avatar}</span>
                <span>{m.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Subtab 1: Member Health Profiles (Tipo de sangre, Alergias, Emergencia - FULLY EDITABLE) */}
      {activeSubTab === 'perfiles' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Haz clic en el botón <strong>"✏️ Editar Salud"</strong> de cualquier familiar para cambiar su tipo de sangre, alergias o notas médicas.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {members.map(m => (
              <div
                key={m.id}
                className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                        style={{ backgroundColor: `${m.color}20` }}
                      >
                        {m.avatar}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-stone-900 dark:text-white leading-tight">
                          {m.name}
                        </h3>
                        <p className="text-xs text-stone-400">{m.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => openHealthProfileEditor(m)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors shrink-0"
                      title="Editar ficha médica de este miembro"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-800">
                      <span className="text-stone-400 font-semibold">Grupo Sanguíneo:</span>
                      <span className="font-black text-rose-600 dark:text-rose-400 text-sm px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/50">
                        🩸 {m.bloodType || 'A+'}
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 font-semibold block mb-1">Alergias conocidas:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.allergies && m.allergies.length > 0 ? (
                          m.allergies.map((alg, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[11px] font-bold"
                            >
                              ⚠️ {alg}
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-400 italic">Sin alergias reportadas</span>
                        )}
                      </div>
                    </div>

                    {m.emergencyContact && (
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                        <span className="text-stone-400 font-semibold block text-[10px] uppercase">Contacto emergencia:</span>
                        <p className="font-medium text-stone-700 dark:text-stone-300 mt-0.5">{m.emergencyContact}</p>
                      </div>
                    )}

                    {m.medicalNotes && (
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850 text-stone-600 dark:text-stone-400 text-[11px] italic">
                        "{m.medicalNotes}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={() => openHealthProfileEditor(m)}
                    className="w-full py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Editar Alergias & Sangre</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: Medications (Fully Editable with Edit button) */}
      {activeSubTab === 'medicinas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredMeds.map(med => {
              const member = members.find(m => m.id === med.memberId);
              return (
                <div
                  key={med.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between shadow-xs ${
                    med.takenToday
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                      : 'bg-white dark:bg-stone-900 border-rose-200/80 dark:border-rose-900/40 hover:border-rose-400'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl p-2 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600">
                          💊
                        </span>
                        <div>
                          <div className="flex items-center space-x-1 text-xs text-stone-500 font-semibold">
                            <span>{member?.avatar}</span>
                            <span>{member?.name}</span>
                          </div>
                          <h3 className="text-base font-black text-stone-900 dark:text-white mt-0.5">
                            {med.medicationName}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingMedication(med)}
                          className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                          title="Editar medicamento"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMedication(med.id)}
                          className="text-stone-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                          title="Eliminar recordatorio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-700/70 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Dosis:</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{med.dosage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Pauta:</span>
                        <span className="font-semibold text-stone-700 dark:text-stone-300">{med.frequency}</span>
                      </div>
                      {med.timesPerDay.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-stone-400">Horarios:</span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                            {med.timesPerDay.join(' • ')}
                          </span>
                        </div>
                      )}
                      {med.notes && (
                        <p className="text-stone-500 italic pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                          {med.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center space-x-2">
                    <button
                      onClick={() => toggleMedicationTaken(med.id)}
                      className={`flex-1 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                        med.takenToday
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 active:scale-95'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{med.takenToday ? 'Dosis de hoy tomada ✓' : 'Tomar dosis ahora'}</span>
                    </button>

                    <button
                      onClick={() => setEditingMedication(med)}
                      className="p-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-indigo-600 font-bold text-xs"
                      title="Editar detalles"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 3: Medical Consultations (Fully Editable with Edit button) */}
      {activeSubTab === 'historial' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredRecords.map(record => {
              const member = members.find(m => m.id === record.memberId);
              return (
                <div
                  key={record.id}
                  className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center space-x-2 text-xs text-stone-500 mb-1">
                          <span>{member?.avatar} {member?.name}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
                            {record.specialty}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                          {record.title}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingRecord(record)}
                          className="text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                          title="Editar registro clínico"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMedicalRecord(record.id)}
                          className="text-stone-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                      <div className="flex items-center space-x-2 text-stone-400">
                        <Stethoscope className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{record.doctor} ({record.clinic})</span>
                        <span>•</span>
                        <span>{record.date}</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-700/60 mt-2">
                        <span className="font-bold text-stone-400 block mb-0.5 uppercase tracking-wider text-[10px]">
                          Diagnóstico & Indicaciones:
                        </span>
                        <p>{record.diagnosisNotes}</p>
                      </div>

                      {record.prescriptions && (
                        <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-rose-900 dark:text-rose-200">
                          <span className="font-bold block mb-0.5 uppercase tracking-wider text-[10px]">
                            Tratamiento recetado:
                          </span>
                          <p>{record.prescriptions}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setEditingRecord(record)}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar Ficha de Consulta</span>
                    </button>
                    {record.nextFollowUp && (
                      <span className="text-stone-400">Próx: {record.nextFollowUp}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Edit Member Health Profile (Blood type, allergies, emergency contact, notes) */}
      {editingHealthMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Editar Ficha Médica de {editingHealthMember.name}
              </h3>
              <button onClick={() => setEditingHealthMember(null)} className="text-stone-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleSaveHealthProfile} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Grupo Sanguíneo *
                </label>
                <select
                  value={healthBloodType}
                  onChange={e => setHealthBloodType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm font-bold text-rose-600 dark:text-rose-400 outline-none"
                >
                  <option value="A+">A+ (A Positivo)</option>
                  <option value="A-">A- (A Negativo)</option>
                  <option value="B+">B+ (B Positivo)</option>
                  <option value="B-">B- (B Negativo)</option>
                  <option value="0+">0+ (Cero Positivo)</option>
                  <option value="0-">0- (Cero Negativo - Donante Universal)</option>
                  <option value="AB+">AB+ (AB Positivo)</option>
                  <option value="AB-">AB- (AB Negativo)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Alergias Conocidas (separadas por coma)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Penicilina, Polen, Frutos secos, Ácaros..."
                  value={healthAllergiesStr}
                  onChange={e => setHealthAllergiesStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Escribe las alergias separadas por comas para mostrarlas como etiquetas en su perfil.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Contacto de Emergencia
                </label>
                <input
                  type="text"
                  placeholder="Ej. Nombre y teléfono: Papá (+34 600 123 456)"
                  value={healthEmergencyContact}
                  onChange={e => setHealthEmergencyContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Condiciones médicas, intolerancias o notas clínicas
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej. Llevar siempre antihistamínico o inhalador en la mochila, usar tapones para nadar..."
                  value={healthMedicalNotes}
                  onChange={e => setHealthMedicalNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingHealthMember(null)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
                >
                  Guardar Ficha Médica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Medication */}
      {(showAddMedModal || editingMedication) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-rose-500" />
                {editingMedication ? 'Editar Medicamento' : 'Añadir Recordatorio de Medicamento'}
              </h3>
              <button 
                onClick={() => { setShowAddMedModal(false); setEditingMedication(null); }} 
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMedication} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Nombre del medicamento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ibuprofeno 400mg, Amoxicilina, Vitamina D..."
                  value={editingMedication ? editingMedication.medicationName : medName}
                  onChange={e => editingMedication 
                    ? setEditingMedication({ ...editingMedication, medicationName: e.target.value })
                    : setMedName(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Para quién</label>
                  <select
                    value={editingMedication ? editingMedication.memberId : medMemberId}
                    onChange={e => editingMedication
                      ? setEditingMedication({ ...editingMedication, memberId: e.target.value })
                      : setMedMemberId(e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Dosis *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 1 comprimido, 5 ml, 1 sobre"
                    value={editingMedication ? editingMedication.dosage : medDosage}
                    onChange={e => editingMedication
                      ? setEditingMedication({ ...editingMedication, dosage: e.target.value })
                      : setMedDosage(e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Frecuencia</label>
                  <input
                    type="text"
                    placeholder="Ej. Cada 8 horas, 1 vez al día"
                    value={editingMedication ? editingMedication.frequency : medFrequency}
                    onChange={e => editingMedication
                      ? setEditingMedication({ ...editingMedication, frequency: e.target.value })
                      : setMedFrequency(e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Horarios</label>
                  <input
                    type="text"
                    placeholder="08:00, 16:00, 00:00"
                    value={editingMedication ? (Array.isArray(editingMedication.timesPerDay) ? editingMedication.timesPerDay.join(', ') : editingMedication.timesPerDay) : medTimes}
                    onChange={e => editingMedication
                      ? setEditingMedication({ ...editingMedication, timesPerDay: e.target.value.split(',').map(s => s.trim()) })
                      : setMedTimes(e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Instrucciones o advertencias</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Tomar siempre con el estómago lleno o antes de dormir..."
                  value={editingMedication ? (editingMedication.notes || '') : medNotes}
                  onChange={e => editingMedication
                    ? setEditingMedication({ ...editingMedication, notes: e.target.value })
                    : setMedNotes(e.target.value)
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => { setShowAddMedModal(false); setEditingMedication(null); }}
                  className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
                >
                  {editingMedication ? 'Guardar Cambios' : 'Guardar Medicamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Medical Record */}
      {(showAddRecordModal || editingRecord) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-indigo-600" />
                {editingRecord ? 'Editar Consulta Médica' : 'Registrar Consulta o Informe Médico'}
              </h3>
              <button 
                onClick={() => { setShowAddRecordModal(false); setEditingRecord(null); }} 
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Motivo o Título de la consulta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Chequeo anual, Revisión oftalmológica..."
                  value={editingRecord ? editingRecord.title : recTitle}
                  onChange={e => editingRecord
                    ? setEditingRecord({ ...editingRecord, title: e.target.value })
                    : setRecTitle(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Paciente</label>
                  <select
                    value={editingRecord ? editingRecord.memberId : recMemberId}
                    onChange={e => editingRecord
                      ? setEditingRecord({ ...editingRecord, memberId: e.target.value })
                      : setRecMemberId(e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-white outline-none"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Especialidad</label>
                  <input
                    type="text"
                    value={editingRecord ? editingRecord.specialty : recSpecialty}
                    onChange={e => editingRecord
                      ? setEditingRecord({ ...editingRecord, specialty: e.target.value })
                      : setRecSpecialty(e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Médico / Especialista</label>
                  <input
                    type="text"
                    value={editingRecord ? editingRecord.doctor : recDoctor}
                    onChange={e => editingRecord
                      ? setEditingRecord({ ...editingRecord, doctor: e.target.value })
                      : setRecDoctor(e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Clínica / Hospital</label>
                  <input
                    type="text"
                    value={editingRecord ? editingRecord.clinic : recClinic}
                    onChange={e => editingRecord
                      ? setEditingRecord({ ...editingRecord, clinic: e.target.value })
                      : setRecClinic(e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Diagnóstico & Conclusiones</label>
                <textarea
                  rows={2}
                  value={editingRecord ? editingRecord.diagnosisNotes : recDiagnosis}
                  onChange={e => editingRecord
                    ? setEditingRecord({ ...editingRecord, diagnosisNotes: e.target.value })
                    : setRecDiagnosis(e.target.value)
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">Tratamiento o Medicación prescrita</label>
                <textarea
                  rows={2}
                  value={editingRecord ? (editingRecord.prescriptions || '') : recPrescription}
                  onChange={e => editingRecord
                    ? setEditingRecord({ ...editingRecord, prescriptions: e.target.value })
                    : setRecPrescription(e.target.value)
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => { setShowAddRecordModal(false); setEditingRecord(null); }}
                  className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                >
                  {editingRecord ? 'Guardar Cambios' : 'Guardar Historial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
