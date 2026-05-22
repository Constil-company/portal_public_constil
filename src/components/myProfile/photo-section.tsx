/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from '@mui/material';
import { UserResponse } from '../../api/user';
import { PencilIcon } from 'lucide-react';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';
import { useUpdatePhoto } from '../../hooks/user/use-update-photo';
import { useEffect, useState } from 'react';
import { getTokens } from '../../constants/storage/functions';

type Props = {
  user?: UserResponse;
};

export default function PhotoSection({ user }: Props) {
  const { update, isPending } = useUpdatePhoto();

  const fileTypes = ['JPG', 'PNG'];
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const handleChange = (file: File) => {
    update(file);
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (!user?.picture) {
        console.error('No picture URL provided');
        return;
      }

      const token = getTokens();
      if (!token?.accessToken) {
        return;
      }

      const res = await fetch(user.picture, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });

      if (!res.ok) {
        console.error('Image fetch failed');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImgSrc(url);
    };

    fetchImage();

    // Optional cleanup
    return () => {
      if (imgSrc) URL.revokeObjectURL(imgSrc);
    };
  }, [user?.picture]);

  return (
    <div>
      <span className="uppercase font-semibold text-[13px] text-[#12153A]">PICTURE PROFILE</span>

      <div className="flex flex-col items-center justify-center gap-3 w-full md:min-w-max bg-[#FCFCFC] py-7 px-9 mt-2 border border-[#EBE9E9] rounded-[17px]">
        <Avatar src={imgSrc ?? undefined} alt={user?.businessName} sx={{ width: 80, height: 80 }} />
        <span className="font-medium text-base text-[#13173C]">{user?.businessName}</span>
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          onTypeError={() => {
            toast.error('Format not supported!');
          }}
          children={
            <button
              type="button"
              className="flex items-center gap-2 py-2 px-4 font-semibold text-[#2386AF] border border-[#2386AF] rounded-[10px] cursor-pointer">
              Edit Picture
              {isPending ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"></path>
                </svg>
              ) : (
                <PencilIcon className="size-4" />
              )}
            </button>
          }
        />
      </div>
    </div>
  );
}
