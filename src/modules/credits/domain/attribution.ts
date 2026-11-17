export type Attribution = {
  id: string;
  name: string;
  creator: string;
  files: string[];
  source: string;
  license: string;
  licenseUrl?: string;
  notice: string;
  modifications: string;
  provenance: "third-party" | "generated" | "original" | "unresolved";
  licenseStatus?: "source-details-pending" | "provider-terms-pending" | "permission-pending";
  evidence: string;
};
