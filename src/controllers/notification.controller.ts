import { Router } from "express";

import * as notificationService from "~/services/notification.service";

const router = Router();

router
    .route("/:id")
    .get(notificationService.getNotificationById)
    .put(notificationService.updateNotification)
    .delete(notificationService.deleteNotification);

router.get("/user/:id", notificationService.getNotificationByUserId);

export default router;
