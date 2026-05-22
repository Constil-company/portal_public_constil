# CONSTIL Portal - Technical Overview & Architecture

## 1. Project Introduction
CONSTIL is a modern construction management and marketing portal designed to streamline the creation of AI-powered estimates and invoice management. The system leverages a hybrid architecture combining a high-performance React frontend with a serverless Supabase backend.

---

## 2. Core Architecture
The application follows an **API-first** approach:
*   **Frontend**: Built with **React + Vite**, utilizing **Redux Toolkit (RTK) Query** for efficient state management and data fetching.
*   **Backend**: Powered by **Supabase**, utilizing:
    *   **PostgreSQL**: Core relational database with Row Level Security (RLS).
    *   **Auth**: Secure JWT-based user authentication.
    *   **Edge Functions**: Serverless Deno functions for AI processing and credit management.
    *   **Storage**: Integrated S3-compatible storage for blueprint PDFs and document assets.

---

## 3. Key Feature Modules

### AI Estimate Engine
This is the heart of the portal. It allows users to upload blueprints and receive automated material takeoffs.
1.  **Upload**: PDFs are uploaded to storage (S3).
2.  **Job Tracking**: A record is created in `pdf_jobs` with a `pending` status.
3.  **Analysis**: An external analysis engine processes the PDF.
4.  **Results**: Once complete, the data is saved into `ai_estimate_results` as a JSON structure.

### AI Chat Assistant (Interactive Modification)
Integrated into the Estimate viewer, this feature allows users to "chat" with their data.
*   **Context-Aware**: The AI sees the current estimate data (JSON) and apply changes based on natural language commands (e.g., "Increase drywall quantity by 10%").
*   **Native Edge Function**: The logic runs in the `ai-chat` Supabase Edge Function using **Fireworks AI (gpt-oss-120b)** for high-accuracy construction estimation logic.

### Invoice & Estimate Management
*   **Manual Creation**: Support for creating invoices/estimates manually with professional templates.
*   **PDF Generation**: Uses `jsPDF` and `html2canvas` for high-quality, signature-embedded document exports.
*   **Emailing**: Integrated with SendGrid (via Edge Functions) to send documents directly to clients.

---

## 4. Supabase Integration Deep-Dive

### Database Schema Highlights
*   `ai_estimates`: Stores project metadata (Name, Address, Client).
*   `ai_estimate_results`: Stores the multi-page AI analysis output (JSON and Markdown).
*   `ai_estimate_chatbot`: Stores the history of AI conversations for each project.
*   `wallet`: Tracks user credits for AI operations.

### Edge Functions
| Function Name | Responsibility |
| :--- | :--- |
| `ai-chat` | Handles chat queries and applies modifications to estimate data. |
| `user-api` | Manages user profiles, wallet credits, and secure document operations. |
| `submit-support-query` | Handles client support tickets. |

### Row Level Security (RLS)
The portal uses strict RLS policies to ensure users can only access their own data. Policies are defined for:
*   **Select**: `auth.uid() = user_id`
*   **Insert/Update**: Automatically handled by Supabase Auth metadata.

---

## 5. Technology Stack
*   **Styling**: Tailwind CSS + Material UI (MUI).
*   **Icons**: Lucide React + Font Awesome.
*   **State Management**: Redux Toolkit (RTK).
*   **PDF Logic**: jsPDF + jspdf-autotable.
*   **API Layer**: RTK Query (via `invoiceApi.ts`).

---

## 6. How to Run Locally
1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Set up environment variables in `.env`.
4.  Run development server: `npm run dev`.
5.  Deploy Edge Functions (if needed): `npx supabase functions deploy <name>`.

---

**© 2026 CONSTIL. All rights reserved.**
