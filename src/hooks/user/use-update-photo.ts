import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updatePhoto } from "../../services/api/user/user";

export function useUpdatePhoto() {
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (file: File) => await updatePhoto(file),
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
        },
        onError: () => {
            toast.error("There was an unexpected error, please try again!");
        }
    });

    function update(file: File) {
        return mutateAsync(file);
    }

    return {
        update,
        isPending
    };
}