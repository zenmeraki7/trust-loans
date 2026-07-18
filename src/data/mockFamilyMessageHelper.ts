import type { FamilyMessageHelperData } from "@/types/familyMessageHelper";

export const familyMessageHelper: FamilyMessageHelperData = {
  defaults: {
    contactName: "Family member",
    appName: "loan app",
    senderName: "",
    includeOfficialChannelsLine: true,
  },
  cautionPoints: [
    "Do not share OTP, passwords, or private IDs.",
    "Do not make payment to unknown personal UPI IDs.",
    "Note caller number, date, and time.",
    "Share screenshots/call logs only.",
  ],
  template:
    "Someone claiming to represent a loan app may contact you. Please do not share any information, OTP, documents, or payment. If they call, note the number, time, and what they say. Please send me screenshots/call logs only. I am handling this through official complaint channels.",
};
