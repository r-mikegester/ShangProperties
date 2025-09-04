export interface Project {
  id: string;
  title: string;
  formalName?: string;
  description?: string;
  description2?: string;
  image?: string;
  iframeSrc?: string;
  address?: string;
  developer?: string;
  sm?: string;
  gallery?: string[];
  project_type?: string;
  productmix?: string;
  noofunits?: string;
  design_team?: string;
  tours360?: string[];
}

export type ProjectDetailMode = "add" | "edit" | "preview";
