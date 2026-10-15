// ==========================================
// Backend - Submit, List, Stats (ek hi file)
// ==========================================
const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Sirf POST' });

  try {
    const { action } = req.body || {};

    // Check env variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: 'Supabase keys missing hain' });
    }

    const supabase = getSupabase();

    // ============ SUBMIT ============
    if (action === 'submit') {
      const b = req.body;

      if (!b.business_idea || !b.missing_thing || !b.rating) {
        return res.status(400).json({ error: 'Zaroori sawalat bharein' });
      }
      if (b.rating < 1 || b.rating > 5) {
        return res.status(400).json({ error: 'Rating 1-5 honi chahiye' });
      }

      const { error } = await supabase.from('responses').insert([{
        business_idea: String(b.business_idea).trim(),
        missing_thing: String(b.missing_thing).trim(),
        improve_thing: b.improve_thing ? String(b.improve_thing).trim() : null,
        rating: parseInt(b.rating),
        phone: b.phone ? String(b.phone).trim() : null,
        extra_note: b.extra_note ? String(b.extra_note).trim() : null
      }]);

      if (error) {
        console.error('Insert error:', error);
        return res.status(500).json({ error: 'Save nahi ho saka: ' + error.message });
      }
      return res.status(200).json({ success: true });
    }

    // ============ LIST ============
    if (action === 'list') {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ responses: data || [] });
    }

    // ============ STATS ============
    if (action === 'stats') {
      const { data, error } = await supabase
        .from('responses')
        .select('rating');

      if (error) return res.status(500).json({ error: error.message });

      const total = data.length;
      const avg = total > 0
        ? data.reduce((s, r) => s + r.rating, 0) / total
        : 0;

      return res.status(200).json({ total, averageRating: avg });
    }

    return res.status(400).json({ error: 'Ghalat action' });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server masla: ' + err.message });
  }
};