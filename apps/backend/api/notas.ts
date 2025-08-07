import { prisma } from "../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { titulo, contenido, tipo, recursos, tags, context, keyPoints, status, date, priority, relatedResources, userId } = req.body;
      const nota = await prisma.note.create({
        data: {
          title: titulo,
          content: contenido,
          tipo,
          tags,
          context,
          keyPoints,
          status,
          date,
          priority,
          relatedResources,
          userId,
        },
      });
      return res.status(200).json(nota);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  if (req.method === "GET") {
    try {
      const notas = await prisma.note.findMany();
      return res.status(200).json(notas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  res.status(405).end();
}
