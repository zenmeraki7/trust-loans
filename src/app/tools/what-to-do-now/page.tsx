import WhatToDoNowWizardPage from "@/components/tools/WhatToDoNowWizardPage";
import { whatToDoNow } from "@/data/mockWhatToDoNow";

export default function Page() {
  return <WhatToDoNowWizardPage data={whatToDoNow} />;
}
