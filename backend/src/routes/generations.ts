import { Router } from "express";
import { createGenerationHandler, listGenerationsHandler } from "../controllers/generationController";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/", requireAuth, upload.single("image"), asyncHandler(createGenerationHandler));
router.get("/", requireAuth, asyncHandler(listGenerationsHandler));

export default router;

