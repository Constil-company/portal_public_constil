import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from '../services/api/auth/signIn';
import { loginSchema, userLoginForm } from '../components/validations/login-validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { saveUserData } from '../constants/storage/functions';

export function useSignIn() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: userLoginForm) => await signInWithEmailAndPassword(data),
    onSuccess: (response) => {
      if (response) {
        saveUserData(response);
        navigate('/home');
      }
    },
  });

  const form = useForm<userLoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function signIn(data: userLoginForm) {
    mutate(data);
  }

  return {
    form,
    signIn,
    isPending,
    error,
  };
}
