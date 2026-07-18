import type { OfficeHarassmentNoteData } from "@/types/officeHarassmentNote";

export const officeHarassmentNote: OfficeHarassmentNoteData = {
  defaults: {
    recipient: "HR Team",
    appName: "loan app",
    senderName: "",
    teamName: "",
  },
  template:
    "I am dealing with harassment from callers claiming to represent a loan app. If anyone contacts the office about me, please do not share my personal information. Kindly note the caller number, time, and message, and forward it to me for recordkeeping.",
  quickReminders: [
    "Keep the note factual and short.",
    "Do not include private financial details.",
    "Request logging of caller number and time.",
    "Ask HR/admin to avoid sharing personal data.",
  ],
};
