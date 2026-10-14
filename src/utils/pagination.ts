import { StandardAssetItem } from '../types/form';

export interface PagePartition {
  pageNumber: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  items: StandardAssetItem[];
}

/**
 * Calculates row capacity weight:
 * - A normal row with 1-2 lines of remarks has weight ~ 1.
 * - Rows with 3+ lines of remarks (e.g., Hub + Remarks + Mail) take ~ 1.5 - 2x vertical space.
 */
function getItemWeight(item: StandardAssetItem): number {
  if (!item.remarks) return 1;
  const lineCount = item.remarks.split('\n').filter(Boolean).length;
  if (lineCount <= 1) return 1;
  if (lineCount === 2) return 1.3;
  if (lineCount === 3) return 1.6;
  return 1.6 + (lineCount - 3) * 0.4;
}

/**
 * Automatically segments standard items into pages so that:
 * 1. Page 1 accommodates: Header, Company info, Badge, Date, From/To box, Table rows, Signatures (if 1 page) or P.T.O.
 *    -> Capacity weight for Page 1 is approx 7.5 items (with multi-line remarks) or ~8 items max.
 * 2. Subsequent pages have no From/To box and standard header, so they can hold approx 12-14 items.
 * 3. If a page gets full, items automatically spill over to Page 2, Page 3, etc.
 * 4. Signatures ALWAYS stay at the bottom of the last page.
 */
export function partitionItemsIntoPages(items: StandardAssetItem[]): PagePartition[] {
  if (!items || items.length === 0) {
    return [
      {
        pageNumber: 1,
        isFirstPage: true,
        isLastPage: true,
        items: [],
      },
    ];
  }

  const PAGE_1_CAPACITY_WEIGHT = 7.5; // fits Page 1 perfectly with Letterhead, From/To box & Signatures
  const SUBSEQUENT_PAGE_CAPACITY_WEIGHT = 12.0;

  const partitions: PagePartition[] = [];
  let currentPageItems: StandardAssetItem[] = [];
  let currentWeight = 0;
  let currentPageNumber = 1;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const weight = getItemWeight(item);
    const capacityLimit =
      currentPageNumber === 1 ? PAGE_1_CAPACITY_WEIGHT : SUBSEQUENT_PAGE_CAPACITY_WEIGHT;

    // If adding this item exceeds capacity and we already have at least 1 item on this page
    if (currentPageItems.length > 0 && currentWeight + weight > capacityLimit) {
      partitions.push({
        pageNumber: currentPageNumber,
        isFirstPage: currentPageNumber === 1,
        isLastPage: false,
        items: currentPageItems,
      });

      currentPageNumber++;
      currentPageItems = [item];
      currentWeight = weight;
    } else {
      currentPageItems.push(item);
      currentWeight += weight;
    }
  }

  // Push the last page
  if (currentPageItems.length > 0 || partitions.length === 0) {
    partitions.push({
      pageNumber: currentPageNumber,
      isFirstPage: currentPageNumber === 1,
      isLastPage: true,
      items: currentPageItems,
    });
  }

  // Mark isLastPage on the final partition
  if (partitions.length > 0) {
    partitions[partitions.length - 1].isLastPage = true;
  }

  return partitions;
}
