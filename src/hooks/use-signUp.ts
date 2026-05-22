/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { saveUserData } from '../constants/storage/functions';
import { createAccount } from '../services/api/auth/signUp';
import { RegistrationSchema, userRegistrationForm } from '../components/validations/registration-validation';
import { toast } from 'react-toastify';
import { MouseEvent, useState } from 'react';

export function useSignUp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [accessToken, setAccessToken] = useState('');
  const isFinalStep = currentStep === 3;

  const { mutate, isPending, error } = useMutation({
    // @ts-ignore
    mutationFn: async (data: userRegistrationForm) => await createAccount({ ...data, accessToken }),
    onSuccess: (userData) => {
      // @ts-ignore
      if (userData) {
        saveUserData(userData);
        toast.success('Account created!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/');
      }
    },
  });

  const form = useForm<userRegistrationForm>({
    resolver: yupResolver(RegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const { trigger, getValues: getFormValues } = form;

  function signUp(data: userRegistrationForm) {
    mutate(data);
  }

  const onNextStepHandler = async (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (currentStep === 1 && !(await trigger(['name', 'email', 'password']))) return;
    if (currentStep === 3 && !(await trigger(['phoneNumber', 'zipCode', 'adress', 'city', 'state', 'country']))) return;
    if (currentStep === 3) {
      signUp(getFormValues());
    }
    if (!isFinalStep) setCurrentStep((prev) => prev + 1);
  };

  return {
    form,
    currentStep,
    setCurrentStep,
    signUp,
    onNextStepHandler,
    isFinalStep,
    isPending,
    setAccessToken,
    error,
  };
}
