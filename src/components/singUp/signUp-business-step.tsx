import { FileImage, UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { updateCurrentUserData } from '../../services/auth-service';
import { getTokens } from '../../constants/storage/functions';
import { uploadBusinessLogo } from '../../services/api/auth/signUp';

// import SubscriptionModal from "./../../pages/onboarding/subscription/subscriptionModal";
// import CheckoutModal from "./../../pages/onboarding/subscription/checkoutModal";
// import { CheckoutSession } from "../../models/checkout";

import { useNavigate } from 'react-router-dom';

// Updated validation schema
const BusinessStepSchema = yup.object({
  taxNumber: yup
    .string()
    .nullable()
    .notRequired()
    .when({
      is: (value: string | null | undefined) => !!value,
      then: (schema) => schema.matches(/^\d{2}-\d{7}$/, 'Must be exactly in XX-XXXXXXX format'),
    }),
  webSite: yup
    .string()
    .nullable()
    .notRequired()
    .when({
      is: (value: string | null | undefined) => !!value,
      then: (schema) =>
        schema
          .url('Must include https:// or http://')
          .matches(
            /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
            'Enter a valid URL (e.g., https://example.com)'
          ),
    }),
  image: yup.mixed(),
});

type BusinessStepForm = yup.InferType<typeof BusinessStepSchema>;

export const SingUpBusinessStep = () => {
  const fileTypes = ['JPG', 'PNG'];
  const [file, setFile] = useState<File | null>(null);

  // const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  //     const [plan, setPlan] = useState<CheckoutSession | undefined>(undefined);

  //     const handleSubscriptionSelected = (session: CheckoutSession) => {
  //         setPlan(session);
  //         setIsSubscriptionOpen(false);
  //     };

  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<BusinessStepForm>({
    resolver: yupResolver(BusinessStepSchema),
  });

  const setSelectedImage = (image: File) => setValue('image', image);

  const handleChange = (file: File) => {
    setFile(file);
    setSelectedImage(file);
  };

  const onSubmit = async (data: BusinessStepForm) => {
    try {
      const response = await updateCurrentUserData({
        companyTaxNumber: data.taxNumber ?? undefined,
        site: data.webSite ?? undefined,
      });

      if (file) {
        await uploadBusinessLogo(file, getTokens() as string);
      }

      if (response.status === 200) {
        toast.success('Business information updated successfully!');
        // setIsSubscriptionOpen(true)
        navigate('/subscribe');
      }
    } catch (error) {
      toast.error('Failed to update business information. Please try again.');
    }
  };

  return (
    <>
      <div className="flex justify-center w-full bg-[#fafafa] py-10 ">
        <div className="flex flex-col items-center justify-center md:p-8 w-full max-w-lg relative mt-[-5%]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full md:w-full border p-8 border-gray-200 rounded-2xl bg-white">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Add Your Brand Identity</h2>
              <p className="text-gray-500">Upload your company logo and website to personalize your experience.</p>
            </div>

            <div className="flex flex-col gap-6 mb-6">
              <div>
                <FileUploader
                  handleChange={handleChange}
                  name="file"
                  types={fileTypes}
                  onTypeError={() => {
                    toast.error('Unsupported file format!');
                    setFile(null);
                  }}
                  children={
                    <div className="border-2 border-dashed border-gray-200 px-4 py-10 rounded-md flex flex-col items-center justify-center">
                      {file ? (
                        <>
                          <FileImage className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="text-gray-500">{file.name}</p>
                        </>
                      ) : (
                        <>
                          <UploadIcon className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="text-gray-500">Drag & drop your logo image here</p>
                          <p className="text-gray-500">
                            or <span className="underline text-[#448AFF] cursor-pointer">Upload File</span>
                          </p>
                        </>
                      )}
                    </div>
                  }
                />
              </div>

              <div className="input-group col-span-3">
                <label htmlFor="webSite" className="mb-3 font-semibold text-gray-500">
                  Website
                </label>
                <div className="relative">
                  <input
                    {...register('webSite')}
                    type="text"
                    id="webSite"
                    placeholder="https://example.com"
                    className="w-full p-3 rounded-md border border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none"
                  />
                  {errors.webSite && <p className="text-[#f4777f] mt-1.5">{errors.webSite.message}</p>}
                </div>
              </div>

              <div className="input-group col-span-3">
                <label htmlFor="taxNumber" className="font-semibold text-gray-500 mb-3">
                  Tax Number
                </label>
                <div className="relative">
                  <input
                    {...register('taxNumber', {
                      onChange: (e) => {
                        const rawValue = e.target.value;
                        const digits = rawValue.replace(/\D/g, '');
                        let formattedValue = digits;

                        if (digits.length > 2) {
                          formattedValue = `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
                        }

                        e.target.value = formattedValue;
                      },
                    })}
                    type="text"
                    id="taxNumber"
                    placeholder="12-3456789"
                    className="w-full p-3 rounded-md border border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none"
                    maxLength={10}
                  />

                  {errors.taxNumber && <p className="text-[#f4777f] mt-1.5">{errors.taxNumber.message}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn_auth text-white p-3 rounded-md w-full cursor-pointer flex items-center justify-center mt-6">
              Continue
            </button>
            <button
              type="button"
              onClick={() => navigate('/subscribe')}
              className="text-gray-500 text-sm mt-4 hover:text-blue-600 transition-colors w-full text-center">
              Skip for now
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
