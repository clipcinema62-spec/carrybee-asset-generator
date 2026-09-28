export interface CompanyInfo {
  name: string;
  address: string;
  hotline: string;
  formTitle: string;
  department: string;
  date: string;
}

export interface SenderRecipientInfo {
  fromBranch: string;
  fromName: string;
  fromMobile: string;
  toBranch: string;
  toName: string;
  toMobile: string;
}

export interface StandardColumn {
  id: string;
  label: string;
  key: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface StandardAssetItem {
  id: string;
  sl: string | number;
  date?: string;
  assetName: string;
  qty: string | number;
  tagNo: string;
  remarks: string;
  customValues?: Record<string, string>;
}

export interface CustomTableColumn {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

export interface CustomTableRow {
  id: string;
  cells: Record<string, string>;
}

export interface CustomSection {
  id: string;
  mailSubject?: string;
  sectionTitle?: string;
  headerTheme: 'yellow' | 'green' | 'blue' | 'gray' | 'white';
  columns: CustomTableColumn[];
  rows: CustomTableRow[];
}

export interface Signatures {
  preparedByLabel: string;
  preparedByName?: string;
  authorizedByLabel: string;
  authorizedByName?: string;
  receivedByLabel: string;
  receivedByName?: string;
}

export interface CarryBeeFormData {
  id: string;
  presetName: string;
  company: CompanyInfo;
  parties: SenderRecipientInfo;
  standardTableTitle?: string;
  showStandardTable: boolean;
  standardColumns: StandardColumn[];
  standardItems: StandardAssetItem[];
  customSections: CustomSection[];
  signatures: Signatures;
  hasPto: boolean;
}
