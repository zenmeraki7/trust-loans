import LegalActionGuidePage from "@/components/legal-guide/LegalActionGuidePage";
import {
  complaintTemplates,
  evidenceChecklist,
  faqItems,
  incidentTypes,
  reportingOptions,
  timelineSteps,
  whatNotToDo,
} from "@/data/mockLegalActionGuide";

export default function Page() {
  return (
    <LegalActionGuidePage
      incidentTypes={incidentTypes}
      checklistItems={evidenceChecklist}
      reportingOptions={reportingOptions}
      timelineSteps={timelineSteps}
      templates={complaintTemplates}
      whatNotToDo={whatNotToDo}
      faqItems={faqItems}
    />
  );
}
