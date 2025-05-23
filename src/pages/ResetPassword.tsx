/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .required('Nova senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Senhas não coincidem')
    .required('Confirmação de senha é obrigatória'),
});

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Debug: Verificar se o token existe
  console.log('Token da URL:', token);
  console.log('URL da API:', import.meta.env.VITE_API_URL);

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError('');

    // Verificações de debug
    if (!token) {
      setError('Token de redefinição não encontrado na URL');
      setIsLoading(false);
      return;
    }

    if (!import.meta.env.VITE_API_URL) {
      setError('URL da API não configurada');
      setIsLoading(false);
      return;
    }

    console.log('Enviando requisição com:', {
      token,
      newPassword: values.newPassword,
      url: `${import.meta.env.VITE_API_URL}/api/auth/reset-password`
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          token,
          newPassword: values.newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 segundos de timeout
        }
      );
      
      console.log('Resposta da API:', response.data);
      setIsSuccess(true);
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Erro completo:', err);
      console.error('Resposta do erro:', err.response);
      console.error('Status do erro:', err.response?.status);
      console.error('Dados do erro:', err.response?.data);
      
      let errorMessage = 'Erro desconhecido ao redefinir senha';
      
      if (err.response) {
        // Erro da API (4xx, 5xx)
        const status = err.response.status;
        const data = err.response.data;
        
        switch (status) {
          case 400:
            errorMessage = data?.message || 'Dados inválidos fornecidos';
            break;
          case 404:
            errorMessage = 'Token de redefinição não encontrado ou expirado';
            break;
          case 422:
            errorMessage = data?.message || 'Token inválido ou expirado';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor. Tente novamente.';
            break;
          default:
            errorMessage = data?.message || `Erro ${status}: ${err.response.statusText}`;
        }
      } else if (err.request) {
        // Erro de rede/conexão
        console.error('Erro de requisição:', err.request);
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else {
        // Erro de configuração
        console.error('Erro de configuração:', err.message);
        errorMessage = `Erro de configuração: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar se token existe na URL
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Link inválido
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              O link de redefinição de senha é inválido ou expirou.
            </p>
            <div className="mt-4">
              <Link
                to="/forgot-password"
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                Solicitar novo link de redefinição
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Senha redefinida!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sua senha foi alterada com sucesso. Você será redirecionado para o login em alguns segundos.
            </p>
          </div>
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-500"
            >
              Ir para login agora
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-gray-500 rounded-full">
            <Lock className="h-6 w-6 text-black" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Redefinir senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite sua nova senha abaixo.
          </p>
        </div>

        <Formik
          initialValues={{ newPassword: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              {error && (
                <div className="flex items-start p-4 text-red-700 bg-red-100 rounded-md">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium">Erro:</div>
                    <div>{error}</div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nova senha
                </label>
                <div className="mt-1 relative">
                  <Field
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                    placeholder="Digite sua nova senha"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar nova senha
                </label>
                <div className="mt-1 relative">
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                    placeholder="Confirme sua nova senha"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Redefinindo...
                    </div>
                  ) : (
                    'Redefinir senha'
                  )}
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Voltar para login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;