/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * This object contains the cache of the various row heights that are present inside
 * the data table.   Its based on Fenwick tree data structure that helps with
 * querying sums that have time complexity of log n.
 *
 * Fenwick Tree Credits: http://petr-mitrichev.blogspot.com/2013/05/fenwick-tree-range-updates.html
 * https://github.com/mikolalysenko/fenwick-tree
 *
 */
export class RowHeightCache {
    constructor() {
        /**
         * Tree Array stores the cumulative information of the row heights to perform efficient
         * range queries and updates.  Currently the tree is initialized to the base row
         * height instead of the detail row height.
         */
        this.treeArray = [];
    }
    /**
     * Clear the Tree array.
     * @return {?}
     */
    clearCache() {
        this.treeArray = [];
    }
    /**
     * Initialize the Fenwick tree with row Heights.
     *
     * @param {?} details
     * @return {?}
     */
    initCache(details) {
        const { rows, rowHeight, detailRowHeight, externalVirtual, rowCount, rowIndexes, rowExpansions } = details;
        /** @type {?} */
        const isFn = typeof rowHeight === 'function';
        /** @type {?} */
        const isDetailFn = typeof detailRowHeight === 'function';
        if (!isFn && isNaN(rowHeight)) {
            throw new Error(`Row Height cache initialization failed. Please ensure that 'rowHeight' is a
        valid number or function value: (${rowHeight}) when 'scrollbarV' is enabled.`);
        }
        // Add this additional guard in case detailRowHeight is set to 'auto' as it wont work.
        if (!isDetailFn && isNaN(detailRowHeight)) {
            throw new Error(`Row Height cache initialization failed. Please ensure that 'detailRowHeight' is a
        valid number or function value: (${detailRowHeight}) when 'scrollbarV' is enabled.`);
        }
        /** @type {?} */
        const n = externalVirtual ? rowCount : rows.length;
        this.treeArray = new Array(n);
        for (let i = 0; i < n; ++i) {
            this.treeArray[i] = 0;
        }
        for (let i = 0; i < n; ++i) {
            /** @type {?} */
            const row = rows[i];
            /** @type {?} */
            let currentRowHeight = rowHeight;
            if (isFn) {
                currentRowHeight = rowHeight(row);
            }
            // Add the detail row height to the already expanded rows.
            // This is useful for the table that goes through a filter or sort.
            /** @type {?} */
            const expanded = rowExpansions.has(row);
            if (row && expanded) {
                if (isDetailFn) {
                    /** @type {?} */
                    const index = rowIndexes.get(row);
                    currentRowHeight += detailRowHeight(row, index);
                }
                else {
                    currentRowHeight += detailRowHeight;
                }
            }
            this.update(i, currentRowHeight);
        }
    }
    /**
     * Given the ScrollY position i.e. sum, provide the rowIndex
     * that is present in the current view port.  Below handles edge cases.
     * @param {?} scrollY
     * @return {?}
     */
    getRowIndex(scrollY) {
        if (scrollY === 0)
            return 0;
        return this.calcRowIndex(scrollY);
    }
    /**
     * When a row is expanded or rowHeight is changed, update the height.  This can
     * be utilized in future when Angular Data table supports dynamic row heights.
     * @param {?} atRowIndex
     * @param {?} byRowHeight
     * @return {?}
     */
    update(atRowIndex, byRowHeight) {
        if (!this.treeArray.length) {
            throw new Error(`Update at index ${atRowIndex} with value ${byRowHeight} failed:
        Row Height cache not initialized.`);
        }
        /** @type {?} */
        const n = this.treeArray.length;
        atRowIndex |= 0;
        while (atRowIndex < n) {
            this.treeArray[atRowIndex] += byRowHeight;
            atRowIndex |= atRowIndex + 1;
        }
    }
    /**
     * Range Sum query from 1 to the rowIndex
     * @param {?} atIndex
     * @return {?}
     */
    query(atIndex) {
        if (!this.treeArray.length) {
            throw new Error(`query at index ${atIndex} failed: Fenwick tree array not initialized.`);
        }
        /** @type {?} */
        let sum = 0;
        atIndex |= 0;
        while (atIndex >= 0) {
            sum += this.treeArray[atIndex];
            atIndex = (atIndex & (atIndex + 1)) - 1;
        }
        return sum;
    }
    /**
     * Find the total height between 2 row indexes
     * @param {?} atIndexA
     * @param {?} atIndexB
     * @return {?}
     */
    queryBetween(atIndexA, atIndexB) {
        return this.query(atIndexB) - this.query(atIndexA - 1);
    }
    /**
     * Given the ScrollY position i.e. sum, provide the rowIndex
     * that is present in the current view port.
     * @private
     * @param {?} sum
     * @return {?}
     */
    calcRowIndex(sum) {
        if (!this.treeArray.length)
            return 0;
        /** @type {?} */
        let pos = -1;
        /** @type {?} */
        const dataLength = this.treeArray.length;
        // Get the highest bit for the block size.
        /** @type {?} */
        const highestBit = Math.pow(2, dataLength.toString(2).length - 1);
        for (let blockSize = highestBit; blockSize !== 0; blockSize >>= 1) {
            /** @type {?} */
            const nextPos = pos + blockSize;
            if (nextPos < dataLength && sum >= this.treeArray[nextPos]) {
                sum -= this.treeArray[nextPos];
                pos = nextPos;
            }
        }
        return pos + 1;
    }
}
if (false) {
    /**
     * Tree Array stores the cumulative information of the row heights to perform efficient
     * range queries and updates.  Currently the tree is initialized to the base row
     * height instead of the detail row height.
     * @type {?}
     * @private
     */
    RowHeightCache.prototype.treeArray;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LWhlaWdodC1jYWNoZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL3Jvdy1oZWlnaHQtY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQVNBLE1BQU0sT0FBTyxjQUFjO0lBQTNCOzs7Ozs7UUFNVSxjQUFTLEdBQWEsRUFBRSxDQUFDO0lBMkluQyxDQUFDOzs7OztJQXRJQyxVQUFVO1FBQ1IsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7Ozs7OztJQVNELFNBQVMsQ0FBQyxPQUFZO2NBQ2QsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsR0FBRyxPQUFPOztjQUNwRyxJQUFJLEdBQUcsT0FBTyxTQUFTLEtBQUssVUFBVTs7Y0FDdEMsVUFBVSxHQUFHLE9BQU8sZUFBZSxLQUFLLFVBQVU7UUFFeEQsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQzsyQ0FDcUIsU0FBUyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ2xGO1FBRUQsc0ZBQXNGO1FBQ3RGLElBQUksQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQUM7MkNBQ3FCLGVBQWUsaUNBQWlDLENBQUMsQ0FBQztTQUN4Rjs7Y0FFSyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO1FBQ2xELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMs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QUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUVqRSxLQUFLLElBQUksU0FBUyxHQUFHLFVBQVUsRUFBRSxTQUFTLEtBQUssQ0FBQyxFQUFFLFNBQVMsS0FBSyxDQUFDLEVBQUU7O2tCQUMzRCxPQUFPLEdBQUcsR0FBRyxHQUFHLFNBQVM7WUFDL0IsSUFBSSxPQUFPLEdBQUcsVUFBVSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUMxRCxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDL0IsR0FBRyxHQUFHLE9BQU8sQ0FBQzthQUNmO1NBQ0Y7UUFFRCxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDakIsQ0FBQztDQUNGOzs7Ozs7Ozs7SUEzSUMsbUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFRoaXMgb2JqZWN0IGNvbnRhaW5zIHRoZSBjYWNoZSBvZiB0aGUgdmFyaW91cyByb3cgaGVpZ2h0cyB0aGF0IGFyZSBwcmVzZW50IGluc2lkZVxyXG4gKiB0aGUgZGF0YSB0YWJsZS4gICBJdHMgYmFzZWQgb24gRmVud2ljayB0cmVlIGRhdGEgc3RydWN0dXJlIHRoYXQgaGVscHMgd2l0aFxyXG4gKiBxdWVyeWluZyBzdW1zIHRoYXQgaGF2ZSB0aW1lIGNvbXBsZXhpdHkgb2YgbG9nIG4uXHJcbiAqXHJcbiAqIEZlbndpY2sgVHJlZSBDcmVkaXRzOiBodHRwOi8vcGV0ci1taXRyaWNoZXYuYmxvZ3Nwb3QuY29tLzIwMTMvMDUvZmVud2ljay10cmVlLXJhbmdlLXVwZGF0ZXMuaHRtbFxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWlrb2xhbHlzZW5rby9mZW53aWNrLXRyZWVcclxuICpcclxuICovXHJcbmV4cG9ydCBjbGFzcyBSb3dIZWlnaHRDYWNoZSB7XHJcbiAgLyoqXHJcbiAgICogVHJlZSBBcnJheSBzdG9yZXMgdGhlIGN1bXVsYXRpdmUgaW5mb3JtYXRpb24gb2YgdGhlIHJvdyBoZWlnaHRzIHRvIHBlcmZvcm0gZWZmaWNpZW50XHJcbiAgICogcmFuZ2UgcXVlcmllcyBhbmQgdXBkYXRlcy4gIEN1cnJlbnRseSB0aGUgdHJlZSBpcyBpbml0aWFsaXplZCB0byB0aGUgYmFzZSByb3dcclxuICAgKiBoZWlnaHQgaW5zdGVhZCBvZiB0aGUgZGV0YWlsIHJvdyBoZWlnaHQuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSB0cmVlQXJyYXk6IG51bWJlcltdID0gW107XHJcblxyXG4gIC8qKlxyXG4gICAqIENsZWFyIHRoZSBUcmVlIGFycmF5LlxyXG4gICAqL1xyXG4gIGNsZWFyQ2FjaGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyZWVBcnJheSA9IFtdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZSB0aGUgRmVud2ljayB0cmVlIHdpdGggcm93IEhlaWdodHMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcm93cyBUaGUgYXJyYXkgb2Ygcm93cyB3aGljaCBjb250YWluIHRoZSBleHBhbmRlZCBzdGF0dXMuXHJcbiAgICogQHBhcmFtIHJvd0hlaWdodCBUaGUgcm93IGhlaWdodC5cclxuICAgKiBAcGFyYW0gZGV0YWlsUm93SGVpZ2h0IFRoZSBkZXRhaWwgcm93IGhlaWdodC5cclxuICAgKi9cclxuICBpbml0Q2FjaGUoZGV0YWlsczogYW55KTogdm9pZCB7XHJcbiAgICBjb25zdCB7IHJvd3MsIHJvd0hlaWdodCwgZGV0YWlsUm93SGVpZ2h0LCBleHRlcm5hbFZpcnR1YWwsIHJvd0NvdW50LCByb3dJbmRleGVzLCByb3dFeHBhbnNpb25zIH0gPSBkZXRhaWxzO1xyXG4gICAgY29uc3QgaXNGbiA9IHR5cGVvZiByb3dIZWlnaHQgPT09ICdmdW5jdGlvbic7XHJcbiAgICBjb25zdCBpc0RldGFpbEZuID0gdHlwZW9mIGRldGFpbFJvd0hlaWdodCA9PT0gJ2Z1bmN0aW9uJztcclxuXHJcbiAgICBpZiAoIWlzRm4gJiYgaXNOYU4ocm93SGVpZ2h0KSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFJvdyBIZWlnaHQgY2FjaGUgaW5pdGlhbGl6YXRpb24gZmFpbGVkLiBQbGVhc2UgZW5zdXJlIHRoYXQgJ3Jvd0hlaWdodCcgaXMgYVxyXG4gICAgICAgIHZhbGlkIG51bWJlciBvciBmdW5jdGlvbiB2YWx1ZTogKCR7cm93SGVpZ2h0fSkgd2hlbiAnc2Nyb2xsYmFyVicgaXMgZW5hYmxlZC5gKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgdGhpcyBhZGRpdGlvbmFsIGd1YXJkIGluIGNhc2UgZGV0YWlsUm93SGVpZ2h0IGlzIHNldCB0byAnYXV0bycgYXMgaXQgd29udCB3b3JrLlxyXG4gICAgaWYgKCFpc0RldGFpbEZuICYmIGlzTmFOKGRldGFpbFJvd0hlaWdodCkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBSb3cgSGVpZ2h0IGNhY2hlIGluaXRpYWxpemF0aW9uIGZhaWxlZC4gUGxlYXNlIGVuc3VyZSB0aGF0ICdkZXRhaWxSb3dIZWlnaHQnIGlzIGFcclxuICAgICAgICB2YWxpZCBudW1iZXIgb3IgZnVuY3Rpb24gdmFsdWU6ICgke2RldGFpbFJvd0hlaWdodH0pIHdoZW4gJ3Njcm9sbGJhclYnIGlzIGVuYWJsZWQuYCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbiA9IGV4dGVybmFsVmlydHVhbCA/IHJvd0NvdW50IDogcm93cy5sZW5ndGg7XHJcbiAgICB0aGlzLnRyZWVBcnJheSA9IG5ldyBBcnJheShuKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47ICsraSkge1xyXG4gICAgICB0aGlzLnRyZWVBcnJheVtpXSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuICAgICAgY29uc3Qgcm93ID0gcm93c1tpXTtcclxuICAgICAgbGV0IGN1cnJlbnRSb3dIZWlnaHQgPSByb3dIZWlnaHQ7XHJcbiAgICAgIGlmIChpc0ZuKSB7XHJcbiAgICAgICAgY3VycmVudFJvd0hlaWdodCA9IHJvd0hlaWdodChyb3cpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBBZGQgdGhlIGRldGFpbCByb3cgaGVpZ2h0IHRvIHRoZSBhbHJlYWR5IGV4cGFuZGVkIHJvd3MuXHJcbiAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIGZvciB0aGUgdGFibGUgdGhhdCBnb2VzIHRocm91Z2ggYSBmaWx0ZXIgb3Igc29ydC5cclxuICAgICAgY29uc3QgZXhwYW5kZWQgPSByb3dFeHBhbnNpb25zLmhhcyhyb3cpO1xyXG4gICAgICBpZiAocm93ICYmIGV4cGFuZGVkKSB7XHJcbiAgICAgICAgaWYgKGlzRGV0YWlsRm4pIHtcclxuICAgICAgICAgIGNvbnN0IGluZGV4ID0gcm93SW5kZXhlcy5nZXQocm93KTtcclxuICAgICAgICAgIGN1cnJlbnRSb3dIZWlnaHQgKz0gZGV0YWlsUm93SGVpZ2h0KHJvdywgaW5kZXgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjdXJyZW50Um93SGVpZ2h0ICs9IGRldGFpbFJvd0hlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMudXBkYXRlKGksIGN1cnJlbnRSb3dIZWlnaHQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2l2ZW4gdGhlIFNjcm9sbFkgcG9zaXRpb24gaS5lLiBzdW0sIHByb3ZpZGUgdGhlIHJvd0luZGV4XHJcbiAgICogdGhhdCBpcyBwcmVzZW50IGluIHRoZSBjdXJyZW50IHZpZXcgcG9ydC4gIEJlbG93IGhhbmRsZXMgZWRnZSBjYXNlcy5cclxuICAgKi9cclxuICBnZXRSb3dJbmRleChzY3JvbGxZOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgaWYgKHNjcm9sbFkgPT09IDApIHJldHVybiAwO1xyXG4gICAgcmV0dXJuIHRoaXMuY2FsY1Jvd0luZGV4KHNjcm9sbFkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogV2hlbiBhIHJvdyBpcyBleHBhbmRlZCBvciByb3dIZWlnaHQgaXMgY2hhbmdlZCwgdXBkYXRlIHRoZSBoZWlnaHQuICBUaGlzIGNhblxyXG4gICAqIGJlIHV0aWxpemVkIGluIGZ1dHVyZSB3aGVuIEFuZ3VsYXIgRGF0YSB0YWJsZSBzdXBwb3J0cyBkeW5hbWljIHJvdyBoZWlnaHRzLlxyXG4gICAqL1xyXG4gIHVwZGF0ZShhdFJvd0luZGV4OiBudW1iZXIsIGJ5Um93SGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy50cmVlQXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVXBkYXRlIGF0IGluZGV4ICR7YXRSb3dJbmRleH0gd2l0aCB2YWx1ZSAke2J5Um93SGVpZ2h0fSBmYWlsZWQ6XHJcbiAgICAgICAgUm93IEhlaWdodCBjYWNoZSBub3QgaW5pdGlhbGl6ZWQuYCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbiA9IHRoaXMudHJlZUFycmF5Lmxlbmd0aDtcclxuICAgIGF0Um93SW5kZXggfD0gMDtcclxuXHJcbiAgICB3aGlsZSAoYXRSb3dJbmRleCA8IG4pIHtcclxuICAgICAgdGhpcy50cmVlQXJyYXlbYXRSb3dJbmRleF0gKz0gYnlSb3dIZWlnaHQ7XHJcbiAgICAgIGF0Um93SW5kZXggfD0gYXRSb3dJbmRleCArIDE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSYW5nZSBTdW0gcXVlcnkgZnJvbSAxIHRvIHRoZSByb3dJbmRleFxyXG4gICAqL1xyXG4gIHF1ZXJ5KGF0SW5kZXg6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBpZiAoIXRoaXMudHJlZUFycmF5Lmxlbmd0aCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHF1ZXJ5IGF0IGluZGV4ICR7YXRJbmRleH0gZmFpbGVkOiBGZW53aWNrIHRyZWUgYXJyYXkgbm90IGluaXRpYWxpemVkLmApO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzdW0gPSAwO1xyXG4gICAgYXRJbmRleCB8PSAwO1xyXG5cclxuICAgIHdoaWxlIChhdEluZGV4ID49IDApIHtcclxuICAgICAgc3VtICs9IHRoaXMudHJlZUFycmF5W2F0SW5kZXhdO1xyXG4gICAgICBhdEluZGV4ID0gKGF0SW5kZXggJiAoYXRJbmRleCArIDEpKSAtIDE7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN1bTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbmQgdGhlIHRvdGFsIGhlaWdodCBiZXR3ZWVuIDIgcm93IGluZGV4ZXNcclxuICAgKi9cclxuICBxdWVyeUJldHdlZW4oYXRJbmRleEE6IG51bWJlciwgYXRJbmRleEI6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5xdWVyeShhdEluZGV4QikgLSB0aGlzLnF1ZXJ5KGF0SW5kZXhBIC0gMSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHaXZlbiB0aGUgU2Nyb2xsWSBwb3NpdGlvbiBpLmUuIHN1bSwgcHJvdmlkZSB0aGUgcm93SW5kZXhcclxuICAgKiB0aGF0IGlzIHByZXNlbnQgaW4gdGhlIGN1cnJlbnQgdmlldyBwb3J0LlxyXG4gICAqL1xyXG4gIHByaXZhdGUgY2FsY1Jvd0luZGV4KHN1bTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGlmICghdGhpcy50cmVlQXJyYXkubGVuZ3RoKSByZXR1cm4gMDtcclxuXHJcbiAgICBsZXQgcG9zID0gLTE7XHJcbiAgICBjb25zdCBkYXRhTGVuZ3RoID0gdGhpcy50cmVlQXJyYXkubGVuZ3RoO1xyXG5cclxuICAgIC8vIEdldCB0aGUgaGlnaGVzdCBiaXQgZm9yIHRoZSBibG9jayBzaXplLlxyXG4gICAgY29uc3QgaGlnaGVzdEJpdCA9IE1hdGgucG93KDIsIGRhdGFMZW5ndGgudG9TdHJpbmcoMikubGVuZ3RoIC0gMSk7XHJcblxyXG4gICAgZm9yIChsZXQgYmxvY2tTaXplID0gaGlnaGVzdEJpdDsgYmxvY2tTaXplICE9PSAwOyBibG9ja1NpemUgPj49IDEpIHtcclxuICAgICAgY29uc3QgbmV4dFBvcyA9IHBvcyArIGJsb2NrU2l6ZTtcclxuICAgICAgaWYgKG5leHRQb3MgPCBkYXRhTGVuZ3RoICYmIHN1bSA+PSB0aGlzLnRyZWVBcnJheVtuZXh0UG9zXSkge1xyXG4gICAgICAgIHN1bSAtPSB0aGlzLnRyZWVBcnJheVtuZXh0UG9zXTtcclxuICAgICAgICBwb3MgPSBuZXh0UG9zO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBvcyArIDE7XHJcbiAgfVxyXG59XHJcbiJdfQ==