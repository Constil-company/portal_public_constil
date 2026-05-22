import { useEffect, useRef } from "react";
import axios from "axios";

/**
 * usePdfJobPolling hook
 * Polls the pdf_jobs table in Supabase until the status is 'done' or 'fail'.
 *
 * @param jobId - The UUID of the job to poll
 * @param onDone - Callback when status is 'done', receives the 'detail' JSON payload
 * @param onFail - Callback when status is 'fail', receives the error message
 */
export function usePdfJobPolling(
  jobId: string | null,
  onDone: (detail: any) => void,
  onFail: (message: string) => void,
) {
  const intervalRef = useRef<number | null>(null);
  const onDoneRef = useRef(onDone);
  const onFailRef = useRef(onFail);

  // Keep refs updated to avoid re-running the effect when callbacks change
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    onFailRef.current = onFail;
  }, [onFail]);

  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/pdf_jobs?id=eq.${jobId}&select=status,detail,message`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
          }
        );

        const data = response.data?.[0];
        if (!data) {
          console.warn(`[Polling] Job ID ${jobId} not found yet...`);
          return;
        }

        console.log(`[Polling] Job ${jobId} status: ${data.status}`);

        if (data.status === "done") {
          console.log(`[Polling] Job ${jobId} finished successfully!`);
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          onDoneRef.current(data.detail);
        } else if (data.status === "fail") {
          console.error(`[Polling] Job ${jobId} failed with message: ${data.message}`);
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          onFailRef.current(data.message || "Processing failed.");
        }
      } catch (error) {
        console.error("[Polling] Network or API error:", error);
        // keep polling on transient errors
      }
    };

    poll(); // immediate first call
    intervalRef.current = window.setInterval(poll, 4000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [jobId]); 
}
