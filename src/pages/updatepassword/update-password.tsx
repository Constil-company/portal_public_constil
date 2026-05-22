/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useUpdatePasswordMutation } from "../../services/rtkapi/authApi";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const [formValues, setFormValues] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field: "old" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { old_password, new_password, confirm_password } = formValues;

    if (!old_password || !new_password || !confirm_password) {
      toast.error("All fields are required!");
      return;
    }

    if (new_password !== confirm_password) {
      toast.error("New password and confirm password must match!");
      return;
    }

    try {
      await updatePassword({
        old_password,
        new_password,
        confirm_password,
      }).unwrap();

      toast.success("Password updated successfully!");
      setFormValues({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error: any) {
      console.error("[UpdatePassword] Error:", error);
      toast.error(error?.data?.error_description || error?.data?.message || "Failed to update password");
    }
  };

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      <div className="gap-6 border border-[#EBE9E9] rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
        <span className="uppercase font-semibold text-[#12153A]">
          Update Your Password
        </span>

        <div className="flex flex-col gap-4 text-[13px] pt-5 sm:pt-10">
          {/* Old Password */}
          <div>
            <label className="block font-semibold uppercase mb-2 text-[#12153A]">
              Old Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword.old ? "text" : "password"}
                name="old_password"
                value={formValues.old_password}
                onChange={handleChange}
                placeholder="Type your Old Password"
                className="w-full h-[47px] px-4 pr-12 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2386AF]"
              />
              <IconButton
                type="button"
                onClick={() => toggleVisibility("old")}
                className="!absolute right-2 text-gray-500 hover:text-[#2386AF]"
                size="small"
              >
                {showPassword.old ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block font-semibold uppercase mb-2 text-[#12153A]">
              New Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword.new ? "text" : "password"}
                name="new_password"
                value={formValues.new_password}
                onChange={handleChange}
                placeholder="Type your New Password"
                className="w-full h-[47px] px-4 pr-12 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2386AF]"
              />
              <IconButton
                type="button"
                onClick={() => toggleVisibility("new")}
                className="!absolute right-2 text-gray-500 hover:text-[#2386AF]"
                size="small"
              >
                {showPassword.new ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-semibold uppercase mb-2 text-[#12153A]">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirm_password"
                value={formValues.confirm_password}
                onChange={handleChange}
                placeholder="Type your Confirm Password"
                className="w-full h-[47px] px-4 pr-12 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2386AF]"
              />
              <IconButton
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="!absolute right-2 text-gray-500 hover:text-[#2386AF]"
                size="small"
              >
                {showPassword.confirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#2386AF] text-white px-5 py-2 rounded-md hover:bg-[#1d6d8e] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

export default UpdatePassword;
