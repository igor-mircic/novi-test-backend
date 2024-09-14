import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.use(requireAuth);

router.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "Authorization test: Sucess" });
});

export default router;
