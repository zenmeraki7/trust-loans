export type FilterCategory =
  | "risk_level"
  | "trust_score"
  | "rating"
  | "complaint_type"
  | "verification_status"
  | "claim_status"
  | "nbfc_partner_status"
  | "company_response_status"
  | "review_status"
  | "evidence_status"
  | "date_range"
  | "platform"
  | "app_store_status"
  | "moderator_status"
  | "privacy_flag"
  | "duplicate_status"
  | "relationship_type";

export type FilterType = "multi" | "range" | "date_range" | "search";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterDefinition = {
  key: string;
  category: FilterCategory;
  type: FilterType;
  label: string;
  fieldPath?: string;
  options?: FilterOption[];
};

export type FilterValue =
  | string
  | string[]
  | {
      min?: number;
      max?: number;
    }
  | {
      from?: string;
      to?: string;
    };

export type FilterState = Record<string, FilterValue>;

export type FilterSchema = {
  context: string;
  definitions: FilterDefinition[];
  searchableFields: string[];
};
