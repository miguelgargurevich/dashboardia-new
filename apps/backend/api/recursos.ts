import { supabase } from "./supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { nombre, tipo, url } = req.body;
    const { error } = await supabase.from("recursos").insert([
      { nombre, tipo, url }
    ]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }
  if (req.method === "GET") {
    const { data, error } = await supabase.from("recursos").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }
  res.status(405).end();
}
