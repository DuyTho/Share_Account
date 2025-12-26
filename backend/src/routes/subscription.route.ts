import { Router } from "express";
import {
  getUserSubscriptions,
  renewSubscription,
} from "../controllers/subscription.controller";

const router = Router();

router.get("/user/:user_id", getUserSubscriptions);
router.post("/renew", renewSubscription);

export default router;
