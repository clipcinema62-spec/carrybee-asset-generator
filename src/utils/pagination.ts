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
  if (lineCount === 2) return 1.25;
  if (lineCount === 3) return 1.5;
  return 1.5 + (lineCount - 3) * 0.3;
}

/**
 * Automatically segments standard items into pages so that:
 * 1. Page 1:
 *    - Full Letterhead (CarryBee Express Ltd., Address, Hotline, Form Badge, Department)
 *    - Date row
 *    - From/To box
 *    - Fits 8-9 items comfortably on A4 without causing premature page break
 * 2. Subsequent pages (Page 2, Page 3, etc.):
 *    - Identical official Letterhead (CarryBee Express Ltd., Address, Hotline, Form Badge, Department)
 *    - Date row
 *    - Compact From/To box
 *    - Table header & rows
 *    - Signatures at the bottom of the final page
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

  // Realistic A4 capacity limits:
  // Page 1: Holds ~8-9 items comfortably before needing Page 2
  const PAGE_1_CAPACITY_WEIGHT = 11.5;
  // Subsequent pages: Holds ~11-13 items
  const SUBSEQUENT_PAGE_CAPACITY_WEIGHT = 13.5;

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
