import { UserApi, UserLogoUploadResponse, UserResponse, UserResponseEnriched, UserUpdateDetails } from "../../../api/user";
import { userProfileForm } from "../../../components/validations/profile-validation";
import apiInstance from "../../configs/api-config";
import { DefaultError } from "../../errors/default-error";

const api = new UserApi(undefined, undefined, apiInstance);

export async function getCurrentUser(): Promise<UserResponseEnriched> {
    const response = await api.getCurrentUser().catch(error => {
        throw new DefaultError(error.status, error.response.data.details);
    });

    return await response.data;
}

export async function getEditUser(user: userProfileForm): Promise<UserResponse> {
    const response = await api.updateCurrentUser({ userUpdateDetails: {
        companyName: user.companyName,
        phone: user.phone,
        zipCode: user.zipCode,
        companyAddress: user.companyAddress,
        country: user.country,
        site: user.site,
        companyTaxNumber: user.companyTaxNumber
    } as UserUpdateDetails}).catch(error => {
        throw new DefaultError(error.status, error.response.data.details);
    });

    return await response.data;
}

export async function updatePhoto(image: File): Promise<UserLogoUploadResponse> {
    const response = await api.uploadUserLogo({file: image}).catch(error => {
        throw new DefaultError(error.status, error.response.data.details);
    });

    return await response.data;
}