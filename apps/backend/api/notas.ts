import { supabase } from "./supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { titulo, contenido, tipo, recursos } = req.body;
    const { error } = await supabase.from("notas").insert([
      { titulo, contenido, tipo, recursos }
    ]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }
  if (req.method === "GET") {
    const { data, error } = await supabase.from("notas").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }
  res.status(405).end();
}
