import NotificationCenterPage from "@/components/notifications/NotificationCenterPage";
import { notificationCenter } from "@/data/mockNotificationCenter";

export default function Page() {
  return <NotificationCenterPage data={notificationCenter} />;
}
