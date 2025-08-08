const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_S3_BUCKET || 'dashboardia-bucket';

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  if (!supabaseUrl || !supabaseServiceKey || !bucket) {
    return res.status(500).json({ error: 'Supabase env vars missing' });
  }
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const filePath = `resources/${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, req.file.buffer, { upsert: true });
    if (error) return res.status(500).json({ error: error.message });
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
    return res.json({ url: publicUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
