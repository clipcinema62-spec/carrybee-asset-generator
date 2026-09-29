import { CarryBeeFormData } from '../types/form';
import { defaultCompany, defaultParties, defaultSignatures, defaultStandardColumns } from './presets';
import { getCurrentDateFormatted } from '../utils/dateUtils';

/**
 * Creates a clean, blank CarryBee IT Asset Form with today's date
 * and empty rows ready for immediate user entry without sample text.
 */
export function createBlankCarryBeeForm(): CarryBeeFormData {
  return {
    id: `form-${Date.now()}`,
    presetName: 'Official Blank IT Asset Form',
    company: {
      ...defaultCompany,
      date: getCurrentDateFormatted(),
    },
    parties: {
      ...defaultParties,
      fromMobile: '01701208286',
    },
    showStandardTable: true,
    standardTableTitle: 'Hub/Attention Person/Mail/Remarks',
    standardColumns: [
      { id: 'sl', label: 'SL', key: 'sl', width: '45px', align: 'center' },
      { id: 'assetName', label: 'Asset Name', key: 'assetName', width: '140px', align: 'left' },
      { id: 'qty', label: 'Qty', key: 'qty', width: '45px', align: 'center' },
      { id: 'tagNo', label: 'Tag No', key: 'tagNo', width: '90px', align: 'center' },
      { id: 'remarks', label: 'Hub/Attention Person/Mail/Remarks', key: 'remarks', align: 'left' },
    ],
    // 10 blank rows for clean, organized data input
    standardItems: Array.from({ length: 10 }, (_, i) => ({
      id: `blank-row-${i + 1}`,
      sl: i + 1,
      assetName: '',
      qty: 1,
      tagNo: '',
      remarks: '',
    })),
    customSections: [],
    signatures: {
      preparedByLabel: 'Prepared By',
      preparedByName: '',
      authorizedByLabel: 'Authorized by',
      authorizedByName: '',
      receivedByLabel: 'Received by',
      receivedByName: '',
    },
    hasPto: false,
  };
}
