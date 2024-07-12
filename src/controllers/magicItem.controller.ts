import { Request, Response } from "express";
import { MagicItem } from "../models/MagicItem.model";
export async function addMagicItem(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { name, weight } = req.body as {
      name: string;
      weight: number;
    };

    const item = new MagicItem({
      name: name,
      weight: weight,
    });

    await item.save();
    return res
      .status(201)
      .json({ message: "Magic item created successfully.", item });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
}
