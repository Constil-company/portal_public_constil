/* eslint-disable @typescript-eslint/no-unused-vars */
import './style.css';
import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../assets/logo/CONSTIL.svg"
import Carousel from '../../components/carrocel/carrocel';
import { resetPassword } from '../../services/auth-service';
import { toast } from 'react-toastify';

export function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const otp = location.state?.otp || '';
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in all fields!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(email, otp, newPassword);
            toast.success("Password reset successfully!");
            navigate("/");
        } catch (error: any) {
            toast.error(error.message || "Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-white">
            <div className='grid grid-cols-1 md:grid-cols-2 w-full h-full'>

                <div className='flex flex-col items-center justify-center bg-white p-8  w-full loginSpace relative'>
                    <div className='absolute top-10 left-25'>
                        <img src={logoImg} alt="Logo" className=" h-5 w-40 " />
                    </div>
                    <div className="card w-100 items-center justify-center">
                        <h1 className='text-3xl mb-2'>Reset your password</h1>
                        <p className="text-[#88939D]">Enter your new password</p>
                        <form onSubmit={handleFormSubmit} className="login-form flex flex-col space-y-4 mt-10">

                            <div className="input-group">
                                <label htmlFor="newPassword" className='uppercase mb-2'>NEW PASSWORD</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full p-3 rounded mt-2 borderInput border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="confirmPassword" className='uppercase mb-2'>CONFIRM PASSWORD</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full mt-2 p-3 rounded  borderInput border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none"
                                />
                            </div>
                            <button type="submit" disabled={isLoading} className="btn_auth text-white p-3 rounded w-full cursor-pointer flex items-center justify-center">
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </button>

                        </form>

                    </div>
                </div>

                <div className='hidden md:flex img_backgrounds items-center justify-center text-white text-4xl font-bold w-full h-full img_backgrouns relative p-2'>
                    <Carousel />

                </div>
            </div>
        </div>
    );
}
