import './style.css';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo/CONSTIL.svg';
import Carousel from '../../components/carrocel/carrocel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FormEvent } from 'react';

export function ResetSent() {
  const navigate = useNavigate();
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/resetpassword');
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
        <div className="flex flex-col items-center justify-center bg-white p-8  w-full loginSpace relative">
          <div className='absolute top-10 left-25'>
            <img src={logoImg} alt="Logo" className=" h-5 w-40 " />
          </div>
          <div className="card w-100 items-center justify-center">
            <div className="flex items-center gap-2  rounded-lg ">
              <h1 className="text-3xl mb-4 text-[#12153A] relative">
                <span>Reset link sent!</span>
                <CheckCircleIcon className="text--[#9ED0FF]  absolute top-0" fontSize="medium" />
              </h1>
            </div>
            <p className="text-[#88939D]">Check your email for the reset password link</p>

            <form onSubmit={handleFormSubmit} className="login-form flex flex-col space-y-4 mt-10">
              <button type="submit" className=" text-white p-3 rounded w-full cursor-pointer bg-[#35A853]">
                Open email app
              </button>
              <p className="text-center text-[#88939D]">
                If you don’t see your reset password email link, please check your spam folder inside your mail{' '}
              </p>
            </form>
          </div>
        </div>

        <div className="hidden md:flex img_backgrounds items-center justify-center text-white text-4xl font-bold w-full h-full img_backgrouns relative p-2">
          <Carousel />
        </div>
      </div>
    </div>
  );
}
