import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onBack: () => void;
  initialMessage?: string;
  initialIsRegistering?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack, initialMessage, initialIsRegistering = false }) => {
  const [isRegistering, setIsRegistering] = useState(initialIsRegistering);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize state if prop changes while component is mounted
  useEffect(() => {
    setIsRegistering(initialIsRegistering);
  }, [initialIsRegistering]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { supabase } = await import('../lib/supabase');

      if (isRegistering) {
        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Check if email confirmation is required
          if (data.user.identities && data.user.identities.length === 0) {
            setError('Este email já está registrado. Por favor, faça login.');
            return;
          }

          // User created successfully
          const userData: User = {
            id: data.user.id,
            email: data.user.email || email,
            name: name
          };
          onLogin(userData);
        }
      } else {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (data.user) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || email.split('@')[0]
          };
          onLogin(userData);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Erro de autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirects to backend OAuth flow.
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="text-blue-600">
                <svg viewBox="0 0 512 512" width="48" height="48">
                  <path fill="currentColor" d="M140 40h240v64h64v320H140z" opacity=".15" />
                  <rect x="60" y="120" width="300" height="360" rx="24" fill="currentColor" />
                  <text x="120" y="270" fill="white" fontFamily="Arial" fontWeight="900" fontSize="110">CV</text>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isRegistering ? 'Criar sua conta' : 'Entrar no Simplescurriculo'}
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              {initialMessage || 'Acesse seus currículos salvos com segurança.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                  placeholder="Seu nome"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              ) : (
                isRegistering ? 'Criar Conta' : 'Entrar'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">OU</span>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="w-full py-3 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-3"
            title="Google OAuth precisa ser configurado no Supabase Dashboard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#9CA3AF" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#9CA3AF" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#9CA3AF" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#9CA3AF" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google (Em breve)
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              {isRegistering ? 'Já tem uma conta? Entre aqui' : 'Não tem conta? Cadastre-se grátis'}
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Voltar para o Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;