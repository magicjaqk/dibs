// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const items = async (req: NextApiRequest, res: NextApiResponse) => {
  const items = await prisma.giveawayItem.findMany();
  res.status(200).json(items);
};

export default items;
