# Supabase REST API Optimization Plan

To address the request for a better REST API experience regarding client names, we have implemented the most advanced techniques available in Supabase/PostgREST.

## 1. Immediate Client Data on Creation
We updated the `createInvoice` and `createEstimate` mutations in `invoiceApi.ts` to return joined client data immediately upon successful creation.

**Frontend Change:**
```ts
// From:
url: '/invoices'
// To:
url: '/invoices?select=*,clients(name)'
```
This ensures the dashboard shows the client name instantly without requiring a page refresh or a background re-fetch.

## 2. Recommendation: Database VIEW (The "Flat" API Solution)
If you want the Supabase REST API to behave as IF there is a first-class `client_name` column on every invoice/estimate, you can run the following SQL in your **Supabase SQL Editor**:

```sql
-- Create a view for Invoices with Client Names
CREATE OR REPLACE VIEW invoices_with_clients AS
SELECT 
    i.*,
    c.name AS client_name
FROM 
    invoices i
LEFT JOIN 
    clients c ON i.client_id = c.id;

-- Create a view for Estimates with Client Names
CREATE OR REPLACE VIEW estimates_with_clients AS
SELECT 
    e.*,
    c.name AS client_name
FROM 
    estimates e
LEFT JOIN 
    clients c ON e.client_id = c.id;
```

**Benefits of using a View:**
- **Cleaner Search**: You can search directly using `?client_name=ilike.*Name*`.
- **Consistency**: All client-side models will receive a flat `client_name` field.
- **REST Compliance**: It creates dedicated REST endpoints: `GET /invoices_with_clients`.

## 3. Profile Stats (Django-style Dashboard Metrics)
To get summary statistics (Total Invoices, Total Estimates, Blueprints, etc.) directly in your Profile REST API, we recommend creating a unified View. This eliminates the need for expensive Edge Function calls for simple stats.

**SQL to run in Supabase:**
CREATE OR REPLACE VIEW profiles_with_stats AS
SELECT 
    p.id,
    p.user_id,
    jsonb_build_object(
        'name', p.first_name,
        'last_name', p.last_name,
        'email', p.email,
        'company_name', p.company_name
    ) AS register,
    p.phone,
    p.address,
    p.city,
    p.state,
    p.country,
    jsonb_build_object(
        'name', p.country -- Django models often have name in country object
    ) AS country_detail,
    p.zip_code,
    p.profile_image,
    p.avatar_url,
    (SELECT COUNT(*) FROM invoices i WHERE i.user_id = p.user_id) AS invoice_count,
    (SELECT COUNT(*) FROM estimates e WHERE e.user_id = p.user_id) AS estimate_count,
    (SELECT COUNT(*) FROM ai_estimates ae WHERE ae.user_id = p.user_id) AS blue_print_count,
    (SELECT COUNT(*) FROM invoices i WHERE i.user_id = p.user_id AND i.created_at >= date_trunc('month', now())) AS invoice_in_this_month,
    (SELECT COUNT(*) FROM estimates e WHERE e.user_id = p.user_id AND e.created_at >= date_trunc('month', now())) AS estimates_in_this_month
FROM 
    profiles p;

**Frontend Change in `invoiceApi.ts`:**
You can now update your `getUserProfile` to fetch from this view:
```ts
getUserProfile: build.query<any, void>({
  query: () => "/profiles_with_stats?select=*",
  transformResponse: (response: any[]) => response[0],
})
```

## 4. FastAPI Fix: AI Estimation 404
I identified a critical error in your FastAPI `server.log`. The AI estimation was failing because it used a dynamic model name that the current SDK was rejecting.

**Fixed in `common/utils.py`:**
- Changed `claude-3-5-sonnet-latest` → `claude-3-5-sonnet-20241022`

This will resolve the `404 Not Found` errors when processing blueprints.
