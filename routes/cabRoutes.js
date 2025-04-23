import express from "express";
import {
  addCab,
  getCabs,
  updateCab,
  deleteCab,
  updatePerKmRate,
  toggleCabStatus
} from "../controllers/cabController.js";

const router = express.Router();

router.post("/", addCab);
router.get("/", getCabs);
router.get("/:id", getCabs);
router.put("/:id", updateCab);
router.delete("/:id", deleteCab);
router.patch("/:id/perkm", updatePerKmRate);
router.patch("/:id/status", toggleCabStatus);

export default router;
