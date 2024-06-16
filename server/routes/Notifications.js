import express from "express";
import { sendNotification, getNotifications ,deleteNotification ,markAsRead } from "../controllers/Notifications.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/send", auth, sendNotification);
router.get("/:userId", auth, getNotifications);
router.delete("/delete/:id", deleteNotification);
router.patch("/read/:id", auth, markAsRead);

export default router;
