import type { Request, Response } from "express";
import { toNotificationDto, toNotificationSettingsDto } from "./notification.dto.js";
import { notificationService } from "./notification.service.js";

export const notificationController = {
  async list(req: Request, res: Response) {
    const result = await notificationService.list(req.query, req.user?.id);
    res.json({ ...result, items: result.items.map(toNotificationDto) });
  },

  async markRead(req: Request, res: Response) {
    const notification = await notificationService.markRead(req.params.id, req.user?.id);
    res.json(toNotificationDto(notification));
  },

  async markAllRead(req: Request, res: Response) {
    const result = await notificationService.markAllRead(req.user?.id);
    res.json({ message: "Notifications marked as read", count: result.count });
  },

  async getSettings(req: Request, res: Response) {
    const settings = await notificationService.getSettings(req.user?.id);
    res.json(toNotificationSettingsDto(settings));
  },

  async updateSettings(req: Request, res: Response) {
    const settings = await notificationService.updateSettings(req.body, req.user?.id);
    res.json(toNotificationSettingsDto(settings));
  },
};

