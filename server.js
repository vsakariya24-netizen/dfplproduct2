import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors()); // ⭐ Enable CORS

const supabase = createClient(
  "https://wterhjmgsgyqgbwviomo.supabase.co",
  "YOUR_ANON_KEY"
);

app.get("/api/products", async (req, res) => {
  const { category_slug, sub_category_id } = req.query;

  // Use !inner ONLY when filtering by category to force a match
  let selectQuery = `
    *,
    categories${category_slug ? '!inner' : ''} ( id, name ),
    sub_categories ( id, name )
  `;

  let query = supabase.from("products").select(selectQuery);

  if (category_slug && category_slug !== 'undefined') {
    // 1. Convert 'fasteners-segment' to 'FASTENERS SEGMENT'
    // .replace(/-/g, ' ') makes it "fasteners segment"
    const searchName = category_slug.replace(/-/g, ' ');
    
    // 2. ilike makes it case-insensitive so it matches your UPPERCASE SQL name
    query = query.ilike('categories.name', searchName);
  }

  if (sub_category_id && sub_category_id !== 'undefined') {
    // Sub-categories are already saved as IDs (UUIDs), so we match directly
    query = query.eq("sub_category", sub_category_id);
  }

  // 3. Always sort by the position you set in Admin drag-drop
  query = query.order('position', { ascending: true });

  const { data, error } = await query;
  if (error) return res.status(500).json(error);
  res.json(data);
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});