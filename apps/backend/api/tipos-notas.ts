import { prisma } from "../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const tipos = await prisma.tipoNota.findMany();
      res.status(200).json(tipos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
