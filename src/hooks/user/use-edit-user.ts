import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getEditUser } from "../../services/api/user/user";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProfileSchema, userProfileForm } from "../../components/validations/profile-validation";

export function useEditUser(onSuccess?: () => void) {
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (data: userProfileForm) => await getEditUser(data),
        onSuccess: () => {
            toast.success('Profile Updated!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            if (onSuccess)
                onSuccess();
        },
        onError: () => {
            toast.error("There was an unexpected error, please try again!");
        }
    });

    const form = useForm<userProfileForm>({
        resolver: yupResolver(ProfileSchema)
    });

    function edit(data: userProfileForm) {
        return mutateAsync(data);
    }

    return {
        form,
        edit,
        isPending
    };
}