import { useEffect, useState } from 'react';
import { useGetCompanyQuery, useUploadCompanyMutation, useUpdateUserProfileMutation } from '../../services/rtkapi/invoiceApi';
import { toast } from 'react-toastify';
import LegalInfo from './legal-info';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { S3UploadService } from '../../components/data/s3-data';

/* eslint-disable @typescript-eslint/no-explicit-any */

const inputStyle =
  'w-full mt-1 px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';

const Company = () => {
  const Navigate = useNavigate();
  const { data, refetch } = useGetCompanyQuery();
  const [uploadCompany, { isLoading: isCompanyUpdating }] = useUploadCompanyMutation();
  const [updateUserProfile, { isLoading: isProfileUpdating }] = useUpdateUserProfileMutation();
  const user = useSelector((state: any) => state.auth.user);

  const [form, setForm] = useState<any>({
    first_name: '',
    last_name: '',
    company_legal_name: '',
    address: '',
    company_email: '',
    company_phone: '',
    website: '',
    industry: '',
    logo: null,
  });

  const isLoading = isCompanyUpdating || isProfileUpdating;

  useEffect(() => {
    if (data?.data) {
      const c = data.data.company_info || {};
      const u = data.data.user_info || {};
      setForm({
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        company_legal_name: c.company_legal_name || '',
        address: c.address || '',
        company_email: c.company_email || '',
        company_phone: c.company_phone || '',
        website: c.website || '',
        industry: c.industry || '',
        logo: null,
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files, value } = e.target;
    if (name === 'logo' && files && files[0]) {
      setForm((prev: any) => ({
        ...prev,
        logo: files[0],
      }));
    } else {
      setForm((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      const u = data?.data?.user_info || {};
      const c = data?.data?.company_info || {};
      
      let finalLogo = c.logo_url || c.logo;

      // 1. Upload logo if it is a File object
      if (form.logo instanceof File) {
        finalLogo = await S3UploadService.uploadFileInChunks(form.logo, undefined, 'document-logos');
      }

      // 2. Update User Profile
      // Preferred identifier is user_id then id
      const targetUserId = u.user_id || u.id;
      if (targetUserId) {
        await updateUserProfile({
          id: targetUserId,
          body: {
            first_name: form.first_name,
            last_name: form.last_name
          }
        }).unwrap();
      }

      // 3. Update Company Profile
      const companyPayload: any = {
        company_legal_name: form.company_legal_name,
        address: form.address,
        company_email: form.company_email,
        company_phone: form.company_phone,
        website: form.website,
        industry: form.industry,
        logo_url: finalLogo
      };

      if (user?.id) {
        companyPayload.user_id = user.id;
      }

      await uploadCompany(companyPayload).unwrap();
      toast.success('Information updated successfully');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update information');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-gray-300 rounded-xl bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-gray-900 mb-1">Company & Personal Info</div>
        <div className="text-xs text-gray-500 mb-6">
          Update your business details and personal information.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* LOGO */}
          <div className="lg:col-span-2 border border-gray-100 rounded-xl p-6 bg-gray-50/30 flex flex-col items-center gap-6">
            <div className="w-full h-48 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-inner border border-gray-100 p-4">
              {form.logo instanceof File ? (
                <img src={URL.createObjectURL(form.logo)} className="w-full h-full object-contain" />
              ) : (data?.data?.company_info?.logo_url || data?.data?.company_info?.logo) ? (
                <img 
                  src={S3UploadService.getPublicUrl(data?.data?.company_info?.logo_url || data?.data?.company_info?.logo, 'document-logos')} 
                  className="w-full h-full object-contain" 
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider">No Logo</span>
                </div>
              )}
            </div>

            <label className="text-sm font-semibold text-indigo-600 bg-white border border-indigo-100 px-6 py-2 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition shadow-sm">
              Upload New Logo
              <input type="file" accept="image/*" name="logo" onChange={handleChange} hidden />
            </label>
          </div>

          {/* DETAILS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">First Name</div>
                <input
                  name="first_name"
                  placeholder="Your first name"
                  value={form.first_name}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Last Name</div>
                <input
                  name="last_name"
                  placeholder="Your last name"
                  value={form.last_name}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Business Details</div>
              
              <div className="space-y-5">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Company Legal Name</div>
                  <input
                    name="company_legal_name"
                    placeholder="Legal business name"
                    value={form.company_legal_name}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Registered Address</div>
                  <input 
                    name="address" 
                    placeholder="Full business address"
                    value={form.address} 
                    onChange={handleChange} 
                    className={inputStyle} 
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Business Email</div>
                    <input name="company_email" value={form.company_email} onChange={handleChange} className={inputStyle} />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Business Phone</div>
                    <input name="company_phone" value={form.company_phone} onChange={handleChange} className={inputStyle} />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Website</div>
                    <input name="website" placeholder="https://..." value={form.website} onChange={handleChange} className={inputStyle} />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Industry</div>
                    <input name="industry" placeholder="e.g. Construction" value={form.industry} onChange={handleChange} className={inputStyle} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="text-sm font-bold text-white bg-indigo-600 px-10 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50">
                {isLoading ? 'Saving Changes...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>



      <div className="border border-gray-300 rounded-xl bg-white p-6">
        <LegalInfo />
      </div>

      {!user?.role && (
        <div className="border border-gray-300 rounded-xl bg-white p-6">
          <div className="text-sm font-semibold mb-4">Account Security</div>

          <div
            onClick={() => Navigate('/user/update_password')}
            className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
            <div className="text-sm font-medium">Password Management</div>
            <div className="text-xs text-gray-500 mt-1">Control and change your account password.</div>
            <button className="mt-3 px-4 py-2 bg-gray-100 rounded text-sm">Change Password</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;