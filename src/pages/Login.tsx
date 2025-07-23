import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Endereço de email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

const signupSchema = loginSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, signup, loginWithGoogle } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Bem-vindo de volta!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signup(data.email, data.password);
      toast.success('Conta criada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Bem-vindo!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">H</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Bem-vindo ao HabitFlow
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
              {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 touch-target ${
                isLogin
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 touch-target ${
                !isLogin
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Forms */}
          {isLogin ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
              <Input
                label="E-mail"
                type="email"
                {...loginForm.register('email')}
                error={loginForm.formState.errors.email?.message}
                placeholder="Digite seu e-mail"
                className="text-base"
              />
              
              <div className="relative">
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  {...loginForm.register('password')}
                  error={loginForm.formState.errors.password?.message}
                  placeholder="Digite sua senha"
                  className="text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 p-1 touch-target"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full text-base py-3"
                loading={loading}
              >
                Entrar
              </Button>
            </form>
          ) : (
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-5">
              <Input
                label="E-mail"
                type="email"
                {...signupForm.register('email')}
                error={signupForm.formState.errors.email?.message}
                placeholder="Digite seu e-mail"
                className="text-base"
              />
              
              <div className="relative">
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  {...signupForm.register('password')}
                  error={signupForm.formState.errors.password?.message}
                  placeholder="Crie uma senha"
                  className="text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 p-1 touch-target"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Input
                label="Confirmar Senha"
                type={showPassword ? 'text' : 'password'}
                {...signupForm.register('confirmPassword')}
                error={signupForm.formState.errors.confirmPassword?.message}
                placeholder="Confirme sua senha"
                className="text-base"
              />

              <Button
                type="submit"
                className="w-full text-base py-3"
                loading={loading}
              >
                Criar Conta
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">ou</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            variant="secondary"
            className="w-full text-base py-3"
            loading={loading}
          >
            <Mail className="w-4 h-4 mr-2" />
            Continuar com Google
          </Button>
        </div>
      </motion.div>
    </div>
  );
};