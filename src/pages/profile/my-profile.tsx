/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar } from "@mui/material";
import { PencilIcon } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { SkeletonLoader } from "../../components/common/skeleton-loader";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "../../services/rtkapi/invoiceApi";
import { useJsApiLoader } from "@react-google-maps/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { S3UploadService } from "../../components/data/s3-data";


interface ProfileFormData {
  name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone: string;
  address: string;
  countryCode: string; 
  stateCode: string;   
  country: string;
  state: string; 
  city: string;
  zipCode: string;
  picture: File | null;
}


const libraries: ("places")[] = ["places"];

export function MyProfile() {
  const { data, isLoading, refetch } = useGetUserProfileQuery();
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    last_name: "",
    company_name: "",
    email: "",
    phone: "",
    address: "",
    countryCode: "", 
    stateCode: "", 
    city: "",
    zipCode: "",
    picture: null,
  });

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialSnapshot, setInitialSnapshot] = useState("");
  const addressRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDXJS_VZMhnp0szh92aZGg8RHszz6RMQN8",
    libraries,
  });

  // Load API data into form
  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      
      const apiCountry = p.country || "";
      const apiState = p.state || "";
      const apiCity = p.city || "";

      const countryObj = Country.getAllCountries().find(
        (c) => c.name.toLowerCase() === apiCountry.toLowerCase()
      );
      const stateObj = countryObj
        ? State.getStatesOfCountry(countryObj.isoCode).find(
          (s) => s.name.toLowerCase() === apiState.toLowerCase()
        )
        : null;

      setFormData({
        name: p.first_name || p.full_name?.split(" ")[0] || "",
        last_name: p.last_name || p.full_name?.split(" ").slice(1).join(" ") || "",
        company_name: p.company_name || "",
        email: p.email || "",
        phone: p.phone || "",
        address: p.address || "",
        countryCode: countryObj?.isoCode || "",  
        stateCode: stateObj?.isoCode || "",     
        city: apiCity || "",
        zipCode: p.zip_code || "",
        picture: null,
      });
      setInitialSnapshot(JSON.stringify({
        name: p.first_name || p.full_name?.split(" ")[0] || "",
        last_name: p.last_name || p.full_name?.split(" ").slice(1).join(" ") || "",
        company_name: p.company_name || "",
        email: p.email || "",
        phone: p.phone || "",
        address: p.address || "",
        countryCode: countryObj?.isoCode || "",
        stateCode: stateObj?.isoCode || "",
        city: apiCity || "",
        zipCode: p.zip_code || "",
        picture: null,
      }));
      if (p.avatar_url) {
        const profilePath = p.avatar_url;
        setImgSrc(S3UploadService.getPublicUrl(profilePath, 'document-logos'));
      }
    }
  }, [data]);

  // Google autocomplete
  useEffect(() => {
    if (!isLoaded) return;

    const initAutocomplete = () => {
      if (!addressRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
        types: ["geocode"],
        fields: ["address_components", "formatted_address"],
      });

      addressRef.current.addEventListener("focus", () => {
        const value = addressRef.current?.value || "";
        addressRef.current?.setSelectionRange(value.length, value.length);
        const e = new Event("input", { bubbles: true });
        addressRef.current?.dispatchEvent(e);
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.address_components) return;

        const components: Record<string, string> = {};
        for (const comp of place.address_components) {
          const types = comp.types;
          if (types.includes("locality")) components.city = comp.long_name;
          if (types.includes("administrative_area_level_1")) components.state = comp.long_name;
          if (types.includes("postal_code")) components.zipCode = comp.long_name;
          if (types.includes("country")) components.country = comp.long_name;
        }

        // Convert country/state names to ISO codes for dropdown
        const countryObj = Country.getAllCountries().find((c) => c.name === components.country);
        const stateObj = countryObj
          ? State.getStatesOfCountry(countryObj.isoCode).find((s) => s.name === components.state)
          : null;

        setFormData((prev) => ({
          ...prev,
          address: place.formatted_address || "",
          city: components.city || prev.city,
          zipCode: components.zipCode || prev.zipCode,
          countryCode: countryObj?.isoCode || prev.countryCode,
          stateCode: stateObj?.isoCode || prev.stateCode,
        }));
      });
    };

    const timer = setTimeout(initAutocomplete, 300);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  const hasChanges =
    JSON.stringify({
      ...formData,
      picture: formData.picture instanceof File ? formData.picture.name : null,
    }) !== initialSnapshot;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleFileChange = (file: File) => {
    if (imgSrc?.startsWith("blob:")) URL.revokeObjectURL(imgSrc);
    setFormData((prev) => ({ ...prev, picture: file }));
    const previewUrl = URL.createObjectURL(file);
    setImgSrc(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    
    // We update the 'profiles' table using the Supabase REST API
    // Supabase REST prefers JSON, so we create a plain object
    const body: any = {
      first_name: formData.name,
      last_name: formData.last_name,
      company_name: formData.company_name,
      phone: formData.phone,
      address: formData.address,
      zip_code: formData.zipCode,
    };

    const countryObj = Country.getAllCountries().find((c) => c.isoCode === formData.countryCode);
    const stateObj = State.getStatesOfCountry(formData.countryCode).find(
      (s) => s.isoCode === formData.stateCode
    );

    body.country = countryObj?.name || "";
    body.state = stateObj?.name || "";
    body.city = formData.city || "";

    // Image upload handling
    let finalAvatarPath = data?.data?.avatar_url;

    try {
      if (formData.picture instanceof File) {
        finalAvatarPath = await S3UploadService.uploadFileInChunks(formData.picture, undefined, 'document-logos/profiles');
        body.avatar_url = finalAvatarPath;
      }

      const profileId = data?.data?.id || data?.data?.user_id;
      if (!profileId) {
        toast.error("User profile ID not found.");
        return;
      }

      await updateUserProfile({ id: profileId, body }).unwrap();
      setInitialSnapshot(JSON.stringify({ ...formData, picture: null }));
      refetch();
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Update failed", err);
      // Fallback to error fields if available
      setErrors(err?.data?.errors || {});
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg">
        <SkeletonLoader lines={6} />
      </div>
    );
  }

  return (
    <>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-10 pb-5 ">
        {/* === Profile Section === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border border-[#EBE9E9] rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
          {/* Profile Picture */}
          <div className="flex flex-col items-center justify-center gap-3 w-full bg-[#FCFCFC] py-7 px-6 border border-[#EBE9E9] rounded-2xl">
            <Avatar
              src={
                imgSrc?.startsWith("blob:")
                  ? imgSrc
                  : imgSrc
                    ? imgSrc
                    : undefined
              }
              alt={formData.name}
              sx={{ width: 70, height: 70 }}
            />

            <span className="font-medium text-base text-[#13173C] text-center">
              {formData.name || "User Name"}
            </span>

            <FileUploader
              handleChange={handleFileChange}
              name="file"
              types={["JPG", "PNG"]}
              onTypeError={() => toast.error("Format not supported!")}
            >
              <button
                type="button"
                className="flex items-center gap-2 text-sm py-2 px-2 font-semibold text-[#2386AF] border border-[#2386AF] rounded-lg hover:bg-[#2386AF]/10 transition"
              >
                Edit Picture
                {isUpdating ? (
                  <svg
                    className="animate-spin h-5 w-5 text-[#2386AF]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"
                    ></path>
                  </svg>
                ) : (
                  <PencilIcon className="w-4 h-4" />
                )}
              </button>
            </FileUploader>
          </div>

          {/* Info Section */}
          <div className="flex flex-col gap-4 text-[13px] lg:col-span-2 pt-5 sm:pt-16 lg:pt-10">
            {/* Full Name Section (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase mb-2 text-[#12153A]">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Type your first name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                autoComplete="given-name"
                  className="w-full h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2386AF]"
                />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block font-semibold uppercase mb-2 text-[#12153A]">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Type your last name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                autoComplete="family-name"
                  className="w-full h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2386AF]"
                />
              {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold uppercase mb-2 text-[#12153A]">
                Email
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full h-[47px] px-4 rounded-lg bg-gray-100 border border-[#EAE8E8] disabled:cursor-not-allowed"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block font-semibold uppercase mb-2 text-[#12153A]">
                Company Name
              </label>
              <input
                type="text"
                placeholder="Type your company name"
                value={formData.company_name}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
                autoComplete="organization"
                className="w-full h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8] focus:outline-none focus:ring-2 focus:ring-[#2386AF]"
              />
              {errors.company_name && <p className="text-xs text-red-500 mt-1">{errors.company_name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold uppercase mb-2 text-[#12153A]">
                Phone Number
              </label>
              <PhoneInput
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                inputClass="
    !w-full 
    !text-[13px] 
    !h-[45px] 
    !border !border-gray-300 
    !rounded-lg 
    !pl-12 !pr-3 
    !py-2 
    !outline-none 
    !focus:ring-2 !focus:ring-[#2386AF] 
    !focus:border-[#2386AF] 
    !bg-white 
    sm:!text-[13px] 
    xs:!text-[12px]
  "
                buttonClass="
    !border-none 
    !bg-transparent 
    !pl-3 
    !flex !items-center
  "
                dropdownClass="!text-sm"
                containerClass="
    !w-full 
    !mt-1 sm:!mt-2 
    !flex 
    !flex-col
  "
                placeholder="Enter phone number"
                enableSearch
              />


            </div>
          </div>
        </div>

        {/* === Address Section === */}
        <div className="flex flex-col border border-[#EBE9E9] rounded-2xl py-5 px-6 bg-white shadow-sm">
          <span className="uppercase font-semibold text-[#12153A]">
            Address Information
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            {/* Address Input */}
            <input
              type="text"
              ref={addressRef}
              placeholder="Address"
              value={formData.address}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              onChange={(e) => handleInputChange("address", e.target.value)}
              autoComplete="street-address"
              className="h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8]"
            />

            {/* Country */}
            <select
              value={formData.countryCode}
              onChange={(e) => {
                const code = e.target.value;
                // const country = Country.getAllCountries().find((c) => c.isoCode === code);
                handleInputChange("countryCode", code);
                handleInputChange("stateCode", "");
                handleInputChange("city", "");
              }}
              className="h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8]"
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* State */}
            {formData.countryCode && (
              <select
                value={formData.stateCode}
                onChange={(e) => handleInputChange("stateCode", e.target.value)}
                className="h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8]"
              >
                <option value="">Select State</option>
                {State.getStatesOfCountry(formData.countryCode).map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            {/* City */}
            {formData.stateCode && (
              <select
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8]"
              >
                <option value="">Select City</option>
                {City.getCitiesOfState(formData.countryCode, formData.stateCode).map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            {/* Zip */}
            <input
              type="text"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              autoComplete="postal-code"
              className="h-[47px] px-4 rounded-lg bg-[#FCFCFC] border border-[#EAE8E8]"
            />
          </div>
        </div>

        {/* === Buttons === */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full">
          <button
            type="submit"
            disabled={isUpdating || !hasChanges}
            className="bg-[#2386AF] text-white px-5 py-2 rounded-md hover:bg-[#1d6d8e] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : hasChanges ? "Update Profile" : "No Changes to Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (data) {
                const p = data.data || {};
                const countryObj = Country.getAllCountries().find((c) => c.name.toLowerCase() === (p.country || "").toLowerCase());
                const stateObj = countryObj
                  ? State.getStatesOfCountry(countryObj.isoCode).find((s) => s.name.toLowerCase() === (p.state || "").toLowerCase())
                  : null;
                setFormData({
                  name: p.first_name || "",
                  email: p.email || "",
                  last_name: p.last_name || "",
                  company_name: p.company_name || "",
                  phone: p.phone || "",
                  address: p.address || "",
                  countryCode: countryObj?.isoCode || "",
                  stateCode: stateObj?.isoCode || "",
                  city: p.city || "",
                  zipCode: p.zip_code || "",
                  picture: null,
                });
              }
              setErrors({});
            }}
            className="px-5 py-2 border border-[#EAE8E8] rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>

    </>
  );
}

