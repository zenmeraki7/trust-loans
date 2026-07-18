export type OfficeHarassmentNoteData = {
  defaults: {
    recipient: string;
    appName: string;
    senderName: string;
    teamName: string;
  };
  template: string;
  quickReminders: string[];
};
