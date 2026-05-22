import axios from "axios";
import { BASED_URL } from "../redux/createAPI";

export const fetchAndCheckStatus = async (aiEstimateId: string, token: string) => {
  const res = await axios.get(
    `${BASED_URL}/estimate/ai-estimate/retrive_estimates_v2/`,
    {
      params: { ai_estimate_id: aiEstimateId },
      headers: { 
        Authorization: `Bearer ${token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
    }
  );
  return res?.data?.data || {};
};