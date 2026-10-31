import React, { useState } from 'react';
import {
  Heart,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Type,
  KeyRound,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { EmergencyModal } from '../components/EmergencyModal';

export const AuthView: React.FC = () => {
  const {
    login,
    register,
    loginAsDemo,
    fontSize,
    setFontSize,
    highContrast,
  } = useHealth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Criteria validation checks
  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^*]/.test(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isRegisterValid = hasMinLength && hasCapital && hasSpecial && passwordsMatch && name.trim().length > 0 && email.trim().length > 0;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
      }
    }, 200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!hasMinLength) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (!hasCapital) {
      setErrorMessage('Password must contain at least 1 capital letter (A-Z).');
      return;
    }
    if (!hasSpecial) {
      setErrorMessage('Password must contain at least 1 special symbol (! @ # $ % ^ *).');
      return;
    }
    if (!passwordsMatch) {
      setErrorMessage('Passwords MUST match. Please make sure both passwords are identical.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = register(name, email, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to create account.');
      }
    }, 200);
  };

  const fontSizeClass = {
    normal: 'font-scale-normal',
    large: 'font-scale-large',
    xl: 'font-scale-xl',
  }[fontSize];

  return (
    <div
      className={`min-h-screen flex flex-col justify-between ${fontSizeClass} ${
        highContrast ? 'high-contrast-mode bg-black text-white' : 'bg-gradient-to-b from-teal-50/50 via-slate-50 to-slate-100 text-slate-800'
      }`}
    >
      {/* Top Health & Safety Notice Banner */}
      <header className="w-full bg-teal-900 text-teal-100 px-4 sm:px-6 lg:px-8 py-2 text-xs sm:text-sm font-medium">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span>CareCompanion provides personal health management. In a medical emergency, call 911 immediately.</span>
          </div>
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded text-xs flex items-center gap-1.5 shadow transition-colors shrink-0"
          >
            <ShieldAlert className="w-4 h-4" /> SOS Emergency
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        {/* Accessible Text Size Switcher for Login Screen */}
        <div className="w-full max-w-md flex items-center justify-end mb-4">
          <div className="flex items-center bg-white/80 backdrop-blur-sm p-1 rounded-xl border border-slate-200 shadow-xs">
            <span className="px-2 text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" /> Text Size:
            </span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                fontSize === 'normal'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Standard text (16px)"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1 text-sm font-bold rounded-lg transition-all ${
                fontSize === 'large'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Large text (20px)"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`px-2.5 py-1 text-base font-extrabold rounded-lg transition-all ${
                fontSize === 'xl'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Extra large text (24px)"
            >
              A++
            </button>
          </div>
        </div>

        {/* Brand Card Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-teal-600 items-center justify-center text-white shadow-lg shadow-teal-600/30 mb-3">
            <Heart className="w-9 h-9 fill-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            CareCompanion
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
            Senior-Accessible Personal Health & Medication Management
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-3 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all min-h-[48px] ${
                mode === 'login'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4 text-teal-600" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`py-3 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all min-h-[48px] ${
                mode === 'register'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4 text-teal-600" />
              <span>Create Account</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Error Message Alert */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-3 text-rose-800 text-sm font-semibold animate-shake"
              >
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            {/* MODE 1: LOG IN */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. eleanor@example.com"
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-base min-h-[50px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-base min-h-[50px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold rounded-2xl text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[52px] cursor-pointer"
                >
                  {isLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Sign In to CareCompanion</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Quick Demo Login Option */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 text-center">
                    <p className="text-xs sm:text-sm font-semibold text-teal-900 mb-2">
                      Want to test CareCompanion immediately?
                    </p>
                    <button
                      type="button"
                      onClick={loginAsDemo}
                      className="w-full py-2.5 px-4 bg-white hover:bg-teal-50 border-2 border-teal-600 text-teal-800 font-bold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Sign in with Demo Account (Eleanor Davis)</span>
                    </button>
                    <p className="text-[11px] text-teal-700 mt-2 font-mono">
                      Demo: eleanor@example.com / Eleanor123!
                    </p>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-sm text-slate-600">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setErrorMessage(null);
                      }}
                      className="text-teal-700 hover:text-teal-800 font-bold underline"
                    >
                      Create a new user
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* MODE 2: REGISTER / CREATE NEW USER */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Martha Stewart"
                      autoComplete="name"
                      required
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-base min-h-[48px]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. martha@example.com"
                      autoComplete="email"
                      required
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-base min-h-[48px]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      required
                      className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-base min-h-[48px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      required
                      className={`w-full pl-11 pr-12 py-2.5 bg-slate-50 border-2 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:bg-white transition-all text-base min-h-[48px] ${
                        confirmPassword.length > 0 && !passwordsMatch
                          ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                          : confirmPassword.length > 0 && passwordsMatch
                          ? 'border-emerald-500 focus:border-emerald-500 bg-emerald-50/20'
                          : 'border-slate-200 focus:border-teal-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements Checklist (Explicitly Requested) */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Password Requirements
                  </div>

                  {/* 1. At least 8 characters long */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    {hasMinLength ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span
                      className={`font-semibold ${
                        hasMinLength ? 'text-emerald-700' : 'text-slate-600'
                      }`}
                    >
                      At least 8 characters long
                    </span>
                  </div>

                  {/* 2. At least 1 capital letter (A-Z) */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    {hasCapital ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span
                      className={`font-semibold ${
                        hasCapital ? 'text-emerald-700' : 'text-slate-600'
                      }`}
                    >
                      At least 1 capital letter (A-Z)
                    </span>
                  </div>

                  {/* 3. At least 1 special symbol (! @ # $ % ^ *) */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    {hasSpecial ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span
                      className={`font-semibold ${
                        hasSpecial ? 'text-emerald-700' : 'text-slate-600'
                      }`}
                    >
                      At least 1 special symbol (! @ # $ % ^ *)
                    </span>
                  </div>

                  {/* 4. Passwords MUST Match */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    {passwordsMatch ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span
                      className={`font-semibold ${
                        passwordsMatch ? 'text-emerald-700' : 'text-slate-600'
                      }`}
                    >
                      Passwords MUST Match
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 px-6 font-bold rounded-2xl text-base shadow-md transition-all flex items-center justify-center gap-2 min-h-[52px] cursor-pointer ${
                    isRegisterValid
                      ? 'bg-teal-700 hover:bg-teal-800 text-white hover:shadow-lg'
                      : 'bg-teal-700 hover:bg-teal-800 text-white'
                  }`}
                >
                  {isLoading ? (
                    <span>Creating your account...</span>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Create Account & Sign In</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-sm text-slate-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMessage(null);
                      }}
                      className="text-teal-700 hover:text-teal-800 font-bold underline"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Security & Privacy Notice */}
        <div className="mt-8 text-center text-xs text-slate-500 max-w-md">
          <p>
            🔒 Your health information is stored securely on your device. CareCompanion respects patient privacy and accessibility standards.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-2">
          <Heart className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
          <span>CareCompanion — Senior Accessible Personal Health & Medication Management</span>
        </div>
      </footer>

      {/* Emergency Modal */}
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
    </div>
  );
};
