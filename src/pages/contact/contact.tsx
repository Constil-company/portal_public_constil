/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export function Contact() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        company_name: "",
        message: "",
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const { first_name, last_name, email, company_name, message } = formData;
        if (!first_name || !last_name || !email || !message || !company_name) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/submit-support-query`, 
                formData, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
                    },
                }
            );
            setIsLoading(false);
            toast.success(response?.data?.message || "Message sent successfully!");

            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                company_name: "",
                message: "",
            });
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send message");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="gap-6 border border-[#EBE9E9] rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
                <span className="uppercase font-semibold text-[#12153A]">
                    Client Support
                </span>

                <div className="flex flex-col gap-4 text-[13px] lg:col-span-2 pt-5 sm:pt-16 lg:pt-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold uppercase mb-2 text-[#12153A]">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Type your first name"
                                className="w-full h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2386AF]"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold uppercase mb-2 text-[#12153A]">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Type your last name"
                                className="w-full h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2386AF]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold uppercase mb-2 text-[#12153A]">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Type your email address"
                            className="w-full h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2386AF]"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold uppercase mb-2 text-[#12153A]">
                            Company Name
                        </label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            placeholder="Type your company name"
                            className="w-full h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2386AF]"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold uppercase mb-2 text-[#12153A]">
                            Message
                        </label>
                        <textarea
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Type your message here"
                            className="w-full px-4 py-2 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2386AF]"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-[#2386AF] text-white px-5 py-2 rounded-md hover:bg-[#1d6d8e] transition ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                >
                    {isLoading ? "Sending..." : "Submit"}
                </button>
            </div>
        </form>
    );
}
