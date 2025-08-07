import { supabase } from "./supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("tipos_notas").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
