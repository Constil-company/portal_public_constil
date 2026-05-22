const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const fs = require('fs');

const SQLITE_PATH = '/Users/miqdadraza/Documents/contil marketing portal with supabase/bloom-marketing-co-main/db.sqlite3';
const SUPABASE_URL = 'https://avppbvsxayehguepyjkb.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHBidnN4YXllaGd1ZXB5amtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzM5NjIsImV4cCI6MjA5MjYwOTk2Mn0.9deO5EvQLpilKfIWdAFqfoWkKx5wOwRbdnX7o0N1Yek';
const NEW_USER_ID = '47f3d024-2cd0-4dc9-b2ef-3a2301618667';

const db = new sqlite3.Database(SQLITE_PATH);

async function runMigration() {
    console.log("Starting Migration...");

    const headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };

    // 1. Get ALL Invoices
    const invoices = await new Promise((resolve) => {
        db.all("SELECT * FROM invoices_invoice", [], (err, rows) => resolve(rows || []));
    });
    console.log(`Found ${invoices.length} invoices to migrate.`);

    for (const inv of invoices) {
        try {
            // Adjust invoice object for Supabase
            const newInv = {
                invoice_number: inv.invoice_number,
                date: inv.date,
                due_date: inv.due_date,
                status: inv.status,
                user_id: NEW_USER_ID,
                total_amount: inv.total_amount,
                // Add other fields as per schema...
            };

            const res = await axios.post(`${SUPABASE_URL}/invoices`, newInv, { headers });
            const createdInvId = res.data[0].id;
            console.log(`Migrated Invoice: ${inv.invoice_number}`);

            // Get items for this invoice
            const items = await new Promise((resolve) => {
                db.all("SELECT * FROM invoices_invoiceitem WHERE invoice_id = ?", [inv.id], (err, rows) => resolve(rows || []));
            });

            for (const item of items) {
                const newItem = {
                    invoice_id: createdInvId,
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total: item.total
                };
                await axios.post(`${SUPABASE_URL}/invoice_items`, newItem, { headers });
            }
        } catch (e) {
            console.error(`Failed to migrate invoice ${inv.invoice_number}:`, e.response?.data || e.message);
        }
    }

    // 2. Get ALL Estimates
    const estimates = await new Promise((resolve) => {
        db.all("SELECT * FROM estimates_estimates", [], (err, rows) => resolve(rows || []));
    });
    console.log(`Found ${estimates.length} estimates to migrate.`);

    for (const est of estimates) {
        try {
            const newEst = {
                estimate_number: est.estimate_number,
                date: est.date,
                status: est.status,
                user_id: NEW_USER_ID,
                total_amount: est.total_amount
            };
            const res = await axios.post(`${SUPABASE_URL}/estimates`, newEst, { headers });
            const createdEstId = res.data[0].id;

            const items = await new Promise((resolve) => {
                db.all("SELECT * FROM estimates_estimatesitem WHERE estimate_id = ?", [est.id], (err, rows) => resolve(rows || []));
            });

            for (const item of items) {
                await axios.post(`${SUPABASE_URL}/estimate_items`, {
                    estimate_id: createdEstId,
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total: item.total
                }, { headers });
            }
            console.log(`Migrated Estimate: ${est.estimate_number}`);
        } catch (e) {
            console.error(`Failed to migrate estimate:`, e.response?.data || e.message);
        }
    }

    // 3. Get ALL AI Estimates
    const aiEstimates = await new Promise((resolve) => {
        db.all("SELECT * FROM estimates_aiestimate", [], (err, rows) => resolve(rows || []));
    });
    console.log(`Found ${aiEstimates.length} AI estimates to migrate.`);

    for (const ai of aiEstimates) {
        try {
            const newAi = {
                user_id: NEW_USER_ID,
                project_name: ai.project_name,
                status: ai.status,
                created_at: ai.created_at
            };
            const res = await axios.post(`${SUPABASE_URL}/ai_estimates`, newAi, { headers });
            const createdAiId = res.data[0].id;

            const results = await new Promise((resolve) => {
                db.all("SELECT * FROM estimates_aiestimateresult WHERE ai_estimate_id = ?", [ai.id], (err, rows) => resolve(rows || []));
            });

            for (const resItem of results) {
                await axios.post(`${SUPABASE_URL}/ai_estimate_results`, {
                    ai_estimate_id: createdAiId,
                    result_data: resItem.result_data,
                    created_at: resItem.created_at
                }, { headers });
            }
            console.log(`Migrated AI Estimate: ${ai.project_name}`);
        } catch (e) {
            console.error(`Failed to migrate AI estimate:`, e.response?.data || e.message);
        }
    }

    console.log("Migration Complete!");
    db.close();
}

runMigration();
