import BeforeYouPayChecklistPage from "@/components/before-pay/BeforeYouPayChecklistPage";
import { beforeYouPay } from "@/data/mockBeforeYouPay";

export default function Page() {
  return <BeforeYouPayChecklistPage data={beforeYouPay} />;
}
