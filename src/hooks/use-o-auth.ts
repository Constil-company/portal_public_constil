import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../constants/storage/functions";
import { signInWithGoogle } from "../services/api/auth/signIn";
import { toast } from "react-toastify";

export function useOAuth() {
    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({
        mutationFn: async (token: string) => await signInWithGoogle(token),
        onSuccess: (userData) => {
            if (userData) {
                saveUserData(userData);
                navigate('/home');
            }
        },
        onError: () => {
            toast.error("Oops! Login with Google Failed");
        }
    });

    function signInGoogle(token: string) {
        mutate(token);
    }

    return {
        signInGoogle,
        isPending
    };
}