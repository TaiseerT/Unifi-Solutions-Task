import { Request, Response } from "express";
import { MagicMover } from "../models/MagicMover.model";
import { MagicItem } from "../models/MagicItem.model";
import { LoadingLog } from "../models/LoadingLog.model";
import { Schema } from "mongoose";
import { OnAMissionLog } from "../models/onAMissionLog.model";

export async function addMagicMover(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { weight_limit, energy } = req.body as {
      weight_limit: number;
      energy: number;
    };

    const mover = new MagicMover({
      weight_limit: weight_limit,
      energy: energy,
      quest_state: "resting",
      items: [],
    });

    await mover.save();
    return res
      .status(201)
      .json({ message: "Magic Mover Created Successfully", mover });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
}

export async function loadMagicMover(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { moverId, itemIds } = req.body as {
      moverId: string;
      itemIds: string[];
    };

    const mover = await MagicMover.findById(moverId);
    if (!mover) {
      return res.status(404).json({ message: "Magic Mover not found" });
    }
    const items = (await MagicItem.find({ _id: { $in: itemIds } })) as Array<{
      _id: Schema.Types.ObjectId;
      weight: number;
    }>;
    const existingItemIds = new Set(mover.items.map((item) => item.toString()));
    const duplicateItems = items.filter((item) =>
      existingItemIds.has(item._id.toString())
    );
    if (duplicateItems.length > 0) {
      return res
        .status(400)
        .json({ message: "Some items are already loaded in the mover" });
    }
    const existingItems = await MagicItem.find({ _id: { $in: mover.items } });
    const existingWeight = existingItems.reduce(
      (sum, item) => sum + item.weight,
      0
    );

    const newItemsWeight = items.reduce((sum, item) => sum + item.weight, 0);

    const totalWeight = existingWeight + newItemsWeight;
    if (totalWeight > mover.weight_limit) {
      return res
        .status(400)
        .json({ message: "Items exceed the mover's weight limit" });
    }
    const totalEnergyRequired = items.reduce(
      (sum, item) => sum + item.weight,
      0
    );
    if (totalEnergyRequired > mover.energy) {
      return res.status(400).json({
        message: "Mover does not have enough energy to load these items",
      });
    }

    mover.energy -= totalEnergyRequired;

    mover.items = [
      ...mover.items,
      ...items.map((item) => item._id as Schema.Types.ObjectId),
    ];
    mover.quest_state = "loading";
    await mover.save();

    const loadingLog = new LoadingLog({
      mover: mover._id,
      items: mover.items,
    });
    await loadingLog.save();

    return res
      .status(200)
      .json({ message: "Magic Mover loaded successfully", mover });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
}

export async function startMission(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { moverId } = req.body as {
      moverId: string;
    };

    const mover = await MagicMover.findById(moverId);
    console.log("mover: ", mover);
    if (!mover)
      return res.status(404).json({ message: "Magic Mover not found" });
    mover.quest_state = "on a mission";
    await mover.save();
    const missionLog = new OnAMissionLog({
      mover: mover._id,
      activity: "on a mission",
      timestamp: new Date(),
    });
    await missionLog.save();

    return res
      .status(200)
      .json({ message: "Magic Mover is now on a mission", mover });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
}

export async function endMission(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { moverId } = req.body as {
      moverId: string;
    };

    const mover = await MagicMover.findById(moverId);
    if (!mover) {
      return res.status(404).json({ message: "Magic Mover not found" });
    }

    if (mover.quest_state !== "on a mission") {
      return res
        .status(400)
        .json({ message: "Mover is not currently on a mission" });
    }

    mover.items = [];
    mover.quest_state = "done";
    await mover.save();

    const missionLog = new OnAMissionLog({
      mover: mover._id,
      activity: "mission complete",
      timestamp: new Date(),
    });
    await missionLog.save();

    return res
      .status(200)
      .json({ message: "Magic Mover has completed the mission and unloaded all items", mover });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
}

export async function getTopMovers(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const moversWithMissionCount = await OnAMissionLog.aggregate([
      { $match: { activity: "mission complete" } },
      {
        $group: {
          _id: "$mover",
          missionCount: { $sum: 1 }
        }
      },
      { $sort: { missionCount: -1 } },
      { $limit: 10 }
    ]);

    const topMovers = await MagicMover.populate(moversWithMissionCount, { path: "_id" });

    return res.status(200).json(topMovers);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
}