import { prisma } from "../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { nombre, tipo, url, descripcion, categoria } = req.body;
      const recurso = await prisma.resource.create({
        data: {
          titulo: nombre,
          tipo,
          url,
          descripcion,
          categoria,
        },
      });
      return res.status(200).json(recurso);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  if (req.method === "GET") {
    try {
      const recursos = await prisma.resource.findMany();
      return res.status(200).json(recursos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  res.status(405).end();
}
