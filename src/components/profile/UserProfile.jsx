import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { user } from '../../lib/stores/userStore';
import { apiFetch } from '../../lib/utils/fetch';
import { apiAction } from '../../lib/utils/apiAction';
import { showLoading, hideLoading } from '../../lib/utils/loading';
import { showError } from '../../lib/utils/alert';

export default function UserProfile() {
  const currentUser = useStore(user);
  const [activeTab, setActiveTab] = useState('overview');
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Estado para los datos del formulario de edición
  const [formData, setFormData] = useState({
    name: '',
    document_id: '',
    phone: '',
    birth_date: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  // Estado para el cambio de contraseña
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Estados para las estadísticas del backend
  const [stats, setStats] = useState({
    totalHoursMonth: 0,
    completedShifts: 0,
    nightShiftsCount: 0,
    totalReplacements: 0,
    requestedRestDays: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Sincronizar el estado del formulario cuando currentUser se cargue
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        document_id: currentUser.document_id || '',
        phone: currentUser.phone || '',
        birth_date: currentUser.birth_date || '',
        address: currentUser.address || '',
        emergency_contact_name: currentUser.emergency_contact_name || '',
        emergency_contact_phone: currentUser.emergency_contact_phone || '',
      });
      setAvatarPreview(currentUser.avatar_url || null);
    }
  }, [currentUser]);

  // Cargar estadísticas operativas utilizando apiFetch
  useEffect(() => {
    async function fetchStats() {
      if (!currentUser?.id) return;
      setIsLoadingStats(true);
      try {
        const res = await apiFetch(`/employees/stats/profile/${currentUser.id}`);
        console.log("respuesta de stats profile", res)
        if (res?.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Error al cargar las estadísticas del perfil:", error);
      } finally {
        setIsLoadingStats(false);
      }
    }

    fetchStats();
  }, [currentUser?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    showLoading("Guardando cambios...");
    try {
      await apiAction(
        apiFetch(`/employees/${currentUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        }),
        "Perfil actualizado correctamente",
        () => setActiveTab('overview')
      );
    } catch {
      showError("Error al actualizar la información del perfil.");
    } finally {
      hideLoading();
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      showError("Las contraseñas no coinciden.");
      return;
    }

    showLoading("Actualizando contraseña...");
    try {
      await apiAction(
        apiFetch(`/users/${currentUser.id}/change-password`, {
          method: 'POST',
          body: JSON.stringify({
            currentPassword: securityData.currentPassword,
            newPassword: securityData.newPassword,
          }),
        }),
        "Contraseña actualizada con éxito",
        () => {
          setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setActiveTab('overview');
        }
      );
    } catch {
      showError("No se pudo cambiar la contraseña. Verifica tus datos.");
    } finally {
      hideLoading();
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-red-500/20 border-t-red-600 animate-spin"></div>
        </div>
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">
          Cargando perfil...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans antialiased">
      
      {/* ------------------- BANNER & HEADER ------------------- */}
      <div className="relative bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40">
        <div className="h-44 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-black/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        <div className="px-6 md:px-8 pb-6 relative flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="relative group z-10">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 ring-4 ring-white shadow-2xl overflow-hidden flex items-center justify-center text-white text-3xl font-extrabold transition-transform duration-300 group-hover:scale-[1.02]">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser.name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-20"
              >
                <svg className="w-6 h-6 mb-1 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[10px] font-bold tracking-wider uppercase">Cambiar</span>
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange} 
              />

              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 z-30">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white shadow-sm"></span>
              </span>
            </div>

            <div className="mb-1 space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{currentUser.name || 'Usuario'}</h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200/60 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  {currentUser.role || 'Worker'}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {currentUser.email || 'sin-correo@dominio.com'}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab(activeTab === 'edit' ? 'overview' : 'edit')}
            className="w-full md:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {activeTab === 'edit' ? 'Ver Perfil' : 'Editar Perfil'}
          </button>
        </div>

        <div className="px-6 md:px-8 bg-slate-50/80 border-t border-slate-100 py-2">
          <nav className="flex space-x-2">
            {[
              { id: 'overview', label: 'Información General', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { id: 'edit', label: 'Editar Datos', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
              { id: 'security', label: 'Seguridad y Accesos', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-rose-600 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                }`}
              >
                <svg className={`w-4 h-4 ${activeTab === tab.id ? 'text-rose-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ------------------- TAB 1: INFORMACIÓN GENERAL ------------------- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Datos Personales</h2>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verificados</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Documento ID', val: currentUser.document_id, placeholder: 'Sin registrar', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0' },
                  { label: 'Fecha de Cumpleaños', val: currentUser.birth_date, placeholder: 'Sin registrar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { label: 'Correo Electrónico', val: currentUser.email, placeholder: 'Sin registrar', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                  { label: 'Teléfono Móvil', val: currentUser.phone, placeholder: 'Sin registrar', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:border-slate-200 transition-all duration-200 group">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      </svg>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 pl-5">{item.val || item.placeholder}</p>
                  </div>
                ))}

                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:border-slate-200 transition-all duration-200 group">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dirección de Residencia</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 pl-5">{currentUser.address || 'Sin registrar'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/5 via-amber-500/0 to-transparent border border-amber-200/60 rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-amber-100">
                <div className="w-8 h-8 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Contacto de Emergencia</h2>
                  <p className="text-[11px] text-slate-500">Información prioritaria para protocolos de asistencia</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/80 border border-amber-100/80 shadow-xs">
                  <span className="text-[10px] font-bold text-amber-700/80 uppercase tracking-wider block mb-1">Nombre Completo</span>
                  <p className="text-xs font-bold text-slate-800">{currentUser.emergency_contact_name || 'No asignado'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/80 border border-amber-100/80 shadow-xs">
                  <span className="text-[10px] font-bold text-amber-700/80 uppercase tracking-wider block mb-1">Teléfono Directo</span>
                  <p className="text-xs font-bold text-slate-800">{currentUser.emergency_contact_phone || 'No asignado'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Perfil Operativo
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Rol Asignado</span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200/60 uppercase">
                    {currentUser.role || 'Worker'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Fecha de Ingreso</span>
                  <span className="text-xs font-bold text-slate-700">{currentUser.hire_date || 'No registrada'}</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Estado de Cuenta</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Activa
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/10 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Desempeño del Mes</p>
                {stats.nightShiftsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    🌙 {stats.nightShiftsCount} nocturnos
                  </span>
                )}
              </div>
              
              {isLoadingStats ? (
                <div className="py-4 flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin"></div>
                  <span className="text-xs text-slate-400 animate-pulse">Calculando métricas...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="border-l-2 border-amber-500 pl-3">
                    <p className="text-xl font-extrabold">{stats.totalHoursMonth} hrs</p>
                    <p className="text-[10px] font-medium text-slate-400">Trabajadas</p>
                  </div>
                  <div className="border-l-2 border-rose-500 pl-3">
                    <p className="text-xl font-extrabold">{stats.completedShifts}</p>
                    <p className="text-[10px] font-medium text-slate-400">Turnos</p>
                  </div>
                  <div className="border-l-2 border-emerald-500 pl-3">
                    <p className="text-xl font-extrabold">{stats.totalReplacements}</p>
                    <p className="text-[10px] font-medium text-slate-400">Reemplazos</p>
                  </div>
                  <div className="border-l-2 border-sky-500 pl-3">
                    <p className="text-xl font-extrabold">{stats.requestedRestDays}</p>
                    <p className="text-[10px] font-medium text-slate-400">Descansos Pedidos</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ------------------- TAB 2: FORMULARIO DE EDICIÓN ------------------- */}
      {activeTab === 'edit' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm max-w-4xl mx-auto animate-fadeIn">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Editar Información del Perfil</h2>
              <p className="text-xs text-slate-400 mt-0.5">Mantén tus datos operativos actualizados para la gestión de turnos.</p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Información Personal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Documento ID</label>
                  <input 
                    type="text" 
                    name="document_id"
                    value={formData.document_id}
                    onChange={handleInputChange}
                    placeholder="Ej: 1098765432"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Teléfono Móvil</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+57 300 000 0000"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Fecha de Cumpleaños</label>
                  <input 
                    type="date" 
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dirección de Residencia</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Calle / Carrera / Número / Barrio"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Contacto de Emergencia</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nombre Completo del Contacto</label>
                  <input 
                    type="text" 
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleInputChange}
                    placeholder="Ej: María Carmen Cuellar"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Teléfono Directo de Emergencia</label>
                  <input 
                    type="text" 
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleInputChange}
                    placeholder="+57 300 000 0000"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setActiveTab('overview')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 font-bold text-xs rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-rose-600/20 flex items-center gap-2"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------- TAB 3: SEGURIDAD Y CUENTA ------------------- */}
      {activeTab === 'security' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto animate-fadeIn space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Seguridad y Credenciales</h2>
            <p className="text-xs text-slate-400 mt-0.5">Actualiza tu contraseña para mantener protegida tu cuenta.</p>
          </div>

          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Contraseña Actual</label>
              <input 
                type="password" 
                name="currentPassword"
                value={securityData.currentPassword}
                onChange={handleSecurityChange}
                placeholder="••••••••••••"
                required
                className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nueva Contraseña</label>
              <input 
                type="password" 
                name="newPassword"
                value={securityData.newPassword}
                onChange={handleSecurityChange}
                placeholder="Mínimo 8 caracteres"
                required
                className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Confirmar Nueva Contraseña</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={securityData.confirmPassword}
                onChange={handleSecurityChange}
                placeholder="Repite la nueva contraseña"
                required
                className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-slate-900/10 flex items-center gap-2"
              >
                Actualizar Contraseña
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}