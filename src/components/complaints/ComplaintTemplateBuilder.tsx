"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from "react";
import { useState } from "react";
import {
  useComplaintTemplate,
  useCreateComplaintDraft,
  useGenerateComplaintTemplate,
} from "@/hooks/useComplaintTemplates";
import type { ComplaintOutputType } from "@/types/complaintTemplates";
import PlainText from "@/components/security/PlainText";

const defaultOutputType: ComplaintOutputType = "GRIEVANCE_EMAIL";

type AutoResizeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  minHeight?: number;
};

const AutoResizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(
  (
    { value, onChange, minHeight = 72, className = "", style, ...props },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const resizeTextarea = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(textarea.scrollHeight, minHeight)}px`;
    };

    useEffect(() => {
      resizeTextarea();
    }, [value, minHeight]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event);
      requestAnimationFrame(resizeTextarea);
    };

    return (
      <textarea
        {...props}
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        className={className}
        style={{
          ...style,
          minHeight,
          resize: "none",
          overflow: "hidden",
        }}
      />
    );
  },
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";

export default function ComplaintTemplateBuilder({
  templateKey,
}: {
  templateKey: string;
}) {
  const templateQuery = useComplaintTemplate(templateKey);
  const generateMutation = useGenerateComplaintTemplate();
  const createDraftMutation = useCreateComplaintDraft();

  const [outputType, setOutputType] =
    useState<ComplaintOutputType>(defaultOutputType);
  const [formData, setFormData] = useState({
    loanAppName: "",
    shortSummary: "",
    detailedDescription: "",
    desiredResolution: "",
    evidenceAvailable: "",
  });

  const generated = generateMutation.data;

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Complaint Draft Builder
      </h1>

      <p className="text-xs text-amber-900">
        Review the text carefully and remove private information before sending.
      </p>

      {templateQuery.data && (
        <p className="text-sm text-slate-600">
          Template: {templateQuery.data.title}
        </p>
      )}

      <div className="grid gap-3">
        <input
          className="rounded-lg border border-slate-300 p-2 text-sm"
          placeholder="Loan app name"
          value={formData.loanAppName}
          onChange={(e) =>
            setFormData({ ...formData, loanAppName: e.target.value })
          }
        />

        <AutoResizeTextarea
          className="rounded-lg border border-slate-300 p-2 text-sm"
          placeholder="Short summary"
          value={formData.shortSummary}
          onChange={(e) =>
            setFormData({ ...formData, shortSummary: e.target.value })
          }
        />

        <AutoResizeTextarea
          className="rounded-lg border border-slate-300 p-2 text-sm"
          placeholder="Detailed description"
          value={formData.detailedDescription}
          onChange={(e) =>
            setFormData({ ...formData, detailedDescription: e.target.value })
          }
        />

        <AutoResizeTextarea
          className="rounded-lg border border-slate-300 p-2 text-sm"
          placeholder="Desired resolution"
          value={formData.desiredResolution}
          onChange={(e) =>
            setFormData({ ...formData, desiredResolution: e.target.value })
          }
        />

        <select
          className="rounded-lg border border-slate-300 p-2 text-sm"
          value={outputType}
          onChange={(e) => setOutputType(e.target.value as ComplaintOutputType)}
        >
          {(templateQuery.data?.outputTypes ?? [defaultOutputType]).map(
            (type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
          onClick={() =>
            generateMutation.mutate({ templateKey, outputType, formData })
          }
        >
          Generate
        </button>

        <button
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold"
          onClick={() =>
            generated &&
            createDraftMutation.mutate({
              title: `Draft - ${formData.loanAppName || templateKey}`,
              templateKey,
              outputType,
              formData,
              generatedSubject: generated.generatedSubject,
              generatedBody: generated.generatedBody,
            })
          }
        >
          Save Draft
        </button>
      </div>

      {generated && (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <PlainText value={generated.generatedSubject} className="font-semibold" />
          <PlainText as="pre" value={generated.generatedBody} className="mt-2 text-sm text-slate-700" />
        </section>
      )}
    </main>
  );
}
