/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Output, EventEmitter, Input, HostBinding, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ScrollerComponent } from './scroller.component';
import { SelectionType } from '../../types/selection.type';
import { columnsByPin, columnGroupWidths } from '../../utils/column';
import { RowHeightCache } from '../../utils/row-height-cache';
import { translateXY } from '../../utils/translate';
export class DataTableBodyComponent {
    /**
     * Creates an instance of DataTableBodyComponent.
     * @param {?} cd
     */
    constructor(cd) {
        this.cd = cd;
        this.selected = [];
        this.scroll = new EventEmitter();
        this.page = new EventEmitter();
        this.activate = new EventEmitter();
        this.select = new EventEmitter();
        this.detailToggle = new EventEmitter();
        this.rowContextmenu = new EventEmitter(false);
        this.treeAction = new EventEmitter();
        this.rowHeightsCache = new RowHeightCache();
        this.temp = [];
        this.offsetY = 0;
        this.indexes = {};
        this.rowIndexes = new Map();
        this.rowExpansions = [];
        /**
         * Get the height of the detail row.
         */
        this.getDetailRowHeight = (/**
         * @param {?=} row
         * @param {?=} index
         * @return {?}
         */
        (row, index) => {
            if (!this.rowDetail) {
                return 0;
            }
            /** @type {?} */
            const rowHeight = this.rowDetail.rowHeight;
            return typeof rowHeight === 'function' ? rowHeight(row, index) : ((/** @type {?} */ (rowHeight)));
        });
        // declare fn here so we can get access to the `this` property
        this.rowTrackingFn = (/**
         * @param {?} index
         * @param {?} row
         * @return {?}
         */
        (index, row) => {
            /** @type {?} */
            const idx = this.getRowIndex(row);
            if (this.trackByProp) {
                return row[this.trackByProp];
            }
            else {
                return idx;
            }
        });
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set pageSize(val) {
        this._pageSize = val;
        this.recalcLayout();
    }
    /**
     * @return {?}
     */
    get pageSize() {
        return this._pageSize;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set rows(val) {
        this._rows = val;
        this.recalcLayout();
    }
    /**
     * @return {?}
     */
    get rows() {
        return this._rows;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set columns(val) {
        this._columns = val;
        /** @type {?} */
        const colsByPin = columnsByPin(val);
        this.columnGroupWidths = columnGroupWidths(colsByPin, val);
    }
    /**
     * @return {?}
     */
    get columns() {
        return this._columns;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set offset(val) {
        this._offset = val;
        if (!this.scrollbarV || (this.scrollbarV && !this.virtualization))
            this.recalcLayout();
    }
    /**
     * @return {?}
     */
    get offset() {
        return this._offset;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set rowCount(val) {
        this._rowCount = val;
        this.recalcLayout();
    }
    /**
     * @return {?}
     */
    get rowCount() {
        return this._rowCount;
    }
    /**
     * @return {?}
     */
    get bodyWidth() {
        if (this.scrollbarH) {
            return this.innerWidth + 'px';
        }
        else {
            return '100%';
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set bodyHeight(val) {
        if (this.scrollbarV) {
            this._bodyHeight = val + 'px';
        }
        else {
            this._bodyHeight = 'auto';
        }
        this.recalcLayout();
    }
    /**
     * @return {?}
     */
    get bodyHeight() {
        return this._bodyHeight;
    }
    /**
     * Returns if selection is enabled.
     * @return {?}
     */
    get selectEnabled() {
        return !!this.selectionType;
    }
    /**
     * Property that would calculate the height of scroll bar
     * based on the row heights cache for virtual scroll and virtualization. Other scenarios
     * calculate scroll height automatically (as height will be undefined).
     * @return {?}
     */
    get scrollHeight() {
        if (this.scrollbarV && this.virtualization && this.rowCount) {
            return this.rowHeightsCache.query(this.rowCount - 1);
        }
        // avoid TS7030: Not all code paths return a value.
        return undefined;
    }
    /**
     * Called after the constructor, initializing input properties
     * @return {?}
     */
    ngOnInit() {
        if (this.rowDetail) {
            this.listener = this.rowDetail.toggle.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ type, value }) => {
                if (type === 'row') {
                    this.toggleRowExpansion(value);
                }
                if (type === 'all') {
                    this.toggleAllRows(value);
                }
                // Refresh rows after toggle
                // Fixes #883
                this.updateIndexes();
                this.updateRows();
                this.cd.markForCheck();
            }));
        }
        if (this.groupHeader) {
            this.listener = this.groupHeader.toggle.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ type, value }) => {
                if (type === 'group') {
                    this.toggleRowExpansion(value);
                }
                if (type === 'all') {
                    this.toggleAllRows(value);
                }
                // Refresh rows after toggle
                // Fixes #883
                this.updateIndexes();
                this.updateRows();
                this.cd.markForCheck();
            }));
        }
    }
    /**
     * Called once, before the instance is destroyed.
     * @return {?}
     */
    ngOnDestroy() {
        if (this.rowDetail || this.groupHeader) {
            this.listener.unsubscribe();
        }
    }
    /**
     * Updates the Y offset given a new offset.
     * @param {?=} offset
     * @return {?}
     */
    updateOffsetY(offset) {
        // scroller is missing on empty table
        if (!this.scroller) {
            return;
        }
        if (this.scrollbarV && this.virtualization && offset) {
            // First get the row Index that we need to move to.
            /** @type {?} */
            const rowIndex = this.pageSize * offset;
            offset = this.rowHeightsCache.query(rowIndex - 1);
        }
        else if (this.scrollbarV && !this.virtualization) {
            offset = 0;
        }
        this.scroller.setOffset(offset || 0);
    }
    /**
     * Body was scrolled, this is mainly useful for
     * when a user is server-side pagination via virtual scroll.
     * @param {?} event
     * @return {?}
     */
    onBodyScroll(event) {
        /** @type {?} */
        const scrollYPos = event.scrollYPos;
        /** @type {?} */
        const scrollXPos = event.scrollXPos;
        // if scroll change, trigger update
        // this is mainly used for header cell positions
        if (this.offsetY !== scrollYPos || this.offsetX !== scrollXPos) {
            this.scroll.emit({
                offsetY: scrollYPos,
                offsetX: scrollXPos
            });
        }
        this.offsetY = scrollYPos;
        this.offsetX = scrollXPos;
        this.updateIndexes();
        this.updatePage(event.direction);
        this.updateRows();
    }
    /**
     * Updates the page given a direction.
     * @param {?} direction
     * @return {?}
     */
    updatePage(direction) {
        /** @type {?} */
        let offset = this.indexes.first / this.pageSize;
        if (direction === 'up') {
            offset = Math.ceil(offset);
        }
        else if (direction === 'down') {
            offset = Math.floor(offset);
        }
        if (direction !== undefined && !isNaN(offset)) {
            this.page.emit({ offset });
        }
    }
    /**
     * Updates the rows in the view port
     * @return {?}
     */
    updateRows() {
        const { first, last } = this.indexes;
        /** @type {?} */
        let rowIndex = first;
        /** @type {?} */
        let idx = 0;
        /** @type {?} */
        const temp = [];
        this.rowIndexes.clear();
        // if grouprowsby has been specified treat row paging
        // parameters as group paging parameters ie if limit 10 has been
        // specified treat it as 10 groups rather than 10 rows
        if (this.groupedRows) {
            /** @type {?} */
            let maxRowsPerGroup = 3;
            // if there is only one group set the maximum number of
            // rows per group the same as the total number of rows
            if (this.groupedRows.length === 1) {
                maxRowsPerGroup = this.groupedRows[0].value.length;
            }
            while (rowIndex < last && rowIndex < this.groupedRows.length) {
                // Add the groups into this page
                /** @type {?} */
                const group = this.groupedRows[rowIndex];
                temp[idx] = group;
                idx++;
                // Group index in this context
                rowIndex++;
            }
        }
        else {
            while (rowIndex < last && rowIndex < this.rowCount) {
                /** @type {?} */
                const row = this.rows[rowIndex];
                if (row) {
                    this.rowIndexes.set(row, rowIndex);
                    temp[idx] = row;
                }
                idx++;
                rowIndex++;
            }
        }
        this.temp = temp;
    }
    /**
     * Get the row height
     * @param {?} row
     * @return {?}
     */
    getRowHeight(row) {
        // if its a function return it
        if (typeof this.rowHeight === 'function') {
            return this.rowHeight(row);
        }
        return (/** @type {?} */ (this.rowHeight));
    }
    /**
     * @param {?} group the group with all rows
     * @return {?}
     */
    getGroupHeight(group) {
        /** @type {?} */
        let rowHeight = 0;
        if (group.value) {
            for (let index = 0; index < group.value.length; index++) {
                rowHeight += this.getRowAndDetailHeight(group.value[index]);
            }
        }
        return rowHeight;
    }
    /**
     * Calculate row height based on the expanded state of the row.
     * @param {?} row
     * @return {?}
     */
    getRowAndDetailHeight(row) {
        /** @type {?} */
        let rowHeight = this.getRowHeight(row);
        /** @type {?} */
        const expanded = this.getRowExpanded(row);
        // Adding detail row height if its expanded.
        if (expanded) {
            rowHeight += this.getDetailRowHeight(row);
        }
        return rowHeight;
    }
    /**
     * Calculates the styles for the row so that the rows can be moved in 2D space
     * during virtual scroll inside the DOM.   In the below case the Y position is
     * manipulated.   As an example, if the height of row 0 is 30 px and row 1 is
     * 100 px then following styles are generated:
     *
     * transform: translate3d(0px, 0px, 0px);    ->  row0
     * transform: translate3d(0px, 30px, 0px);   ->  row1
     * transform: translate3d(0px, 130px, 0px);  ->  row2
     *
     * Row heights have to be calculated based on the row heights cache as we wont
     * be able to determine which row is of what height before hand.  In the above
     * case the positionY of the translate3d for row2 would be the sum of all the
     * heights of the rows before it (i.e. row0 and row1).
     *
     * \@memberOf DataTableBodyComponent
     * @param {?} rows the row that needs to be placed in the 2D space.
     * @return {?} the CSS3 style to be applied
     *
     */
    getRowsStyles(rows) {
        /** @type {?} */
        const styles = {};
        // only add styles for the group if there is a group
        if (this.groupedRows) {
            styles.width = this.columnGroupWidths.total;
        }
        if (this.scrollbarV && this.virtualization) {
            /** @type {?} */
            let idx = 0;
            if (this.groupedRows) {
                // Get the latest row rowindex in a group
                /** @type {?} */
                const row = rows[rows.length - 1];
                idx = row ? this.getRowIndex(row) : 0;
            }
            else {
                idx = this.getRowIndex(rows);
            }
            // const pos = idx * rowHeight;
            // The position of this row would be the sum of all row heights
            // until the previous row position.
            /** @type {?} */
            const pos = this.rowHeightsCache.query(idx - 1);
            translateXY(styles, 0, pos);
        }
        return styles;
    }
    /**
     * Calculate bottom summary row offset for scrollbar mode.
     * For more information about cache and offset calculation
     * see description for `getRowsStyles` method
     *
     * \@memberOf DataTableBodyComponent
     * @return {?} the CSS3 style to be applied
     *
     */
    getBottomSummaryRowStyles() {
        if (!this.scrollbarV || !this.rows || !this.rows.length) {
            return null;
        }
        /** @type {?} */
        const styles = { position: 'absolute' };
        /** @type {?} */
        const pos = this.rowHeightsCache.query(this.rows.length - 1);
        translateXY(styles, 0, pos);
        return styles;
    }
    /**
     * Hides the loading indicator
     * @return {?}
     */
    hideIndicator() {
        setTimeout((/**
         * @return {?}
         */
        () => (this.loadingIndicator = false)), 500);
    }
    /**
     * Updates the index of the rows in the viewport
     * @return {?}
     */
    updateIndexes() {
        /** @type {?} */
        let first = 0;
        /** @type {?} */
        let last = 0;
        if (this.scrollbarV) {
            if (this.virtualization) {
                // Calculation of the first and last indexes will be based on where the
                // scrollY position would be at.  The last index would be the one
                // that shows up inside the view port the last.
                /** @type {?} */
                const height = parseInt(this.bodyHeight, 0);
                first = this.rowHeightsCache.getRowIndex(this.offsetY);
                last = this.rowHeightsCache.getRowIndex(height + this.offsetY) + 1;
            }
            else {
                // If virtual rows are not needed
                // We render all in one go
                first = 0;
                last = this.rowCount;
            }
        }
        else {
            // The server is handling paging and will pass an array that begins with the
            // element at a specified offset.  first should always be 0 with external paging.
            if (!this.externalPaging) {
                first = Math.max(this.offset * this.pageSize, 0);
            }
            last = Math.min(first + this.pageSize, this.rowCount);
        }
        this.indexes = { first, last };
    }
    /**
     * Refreshes the full Row Height cache.  Should be used
     * when the entire row array state has changed.
     * @return {?}
     */
    refreshRowHeightCache() {
        if (!this.scrollbarV || (this.scrollbarV && !this.virtualization)) {
            return;
        }
        // clear the previous row height cache if already present.
        // this is useful during sorts, filters where the state of the
        // rows array is changed.
        this.rowHeightsCache.clearCache();
        // Initialize the tree only if there are rows inside the tree.
        if (this.rows && this.rows.length) {
            /** @type {?} */
            const rowExpansions = new Set();
            for (const row of this.rows) {
                if (this.getRowExpanded(row)) {
                    rowExpansions.add(row);
                }
            }
            this.rowHeightsCache.initCache({
                rows: this.rows,
                rowHeight: this.rowHeight,
                detailRowHeight: this.getDetailRowHeight,
                externalVirtual: this.scrollbarV && this.externalPaging,
                rowCount: this.rowCount,
                rowIndexes: this.rowIndexes,
                rowExpansions
            });
        }
    }
    /**
     * Gets the index for the view port
     * @return {?}
     */
    getAdjustedViewPortIndex() {
        // Capture the row index of the first row that is visible on the viewport.
        // If the scroll bar is just below the row which is highlighted then make that as the
        // first index.
        /** @type {?} */
        const viewPortFirstRowIndex = this.indexes.first;
        if (this.scrollbarV && this.virtualization) {
            /** @type {?} */
            const offsetScroll = this.rowHeightsCache.query(viewPortFirstRowIndex - 1);
            return offsetScroll <= this.offsetY ? viewPortFirstRowIndex - 1 : viewPortFirstRowIndex;
        }
        return viewPortFirstRowIndex;
    }
    /**
     * Toggle the Expansion of the row i.e. if the row is expanded then it will
     * collapse and vice versa.   Note that the expanded status is stored as
     * a part of the row object itself as we have to preserve the expanded row
     * status in case of sorting and filtering of the row set.
     * @param {?} row
     * @return {?}
     */
    toggleRowExpansion(row) {
        // Capture the row index of the first row that is visible on the viewport.
        /** @type {?} */
        const viewPortFirstRowIndex = this.getAdjustedViewPortIndex();
        /** @type {?} */
        const rowExpandedIdx = this.getRowExpandedIdx(row, this.rowExpansions);
        /** @type {?} */
        const expanded = rowExpandedIdx > -1;
        // If the detailRowHeight is auto --> only in case of non-virtualized scroll
        if (this.scrollbarV && this.virtualization) {
            /** @type {?} */
            const detailRowHeight = this.getDetailRowHeight(row) * (expanded ? -1 : 1);
            // const idx = this.rowIndexes.get(row) || 0;
            /** @type {?} */
            const idx = this.getRowIndex(row);
            this.rowHeightsCache.update(idx, detailRowHeight);
        }
        // Update the toggled row and update thive nevere heights in the cache.
        if (expanded) {
            this.rowExpansions.splice(rowExpandedIdx, 1);
        }
        else {
            this.rowExpansions.push(row);
        }
        this.detailToggle.emit({
            rows: [row],
            currentIndex: viewPortFirstRowIndex
        });
    }
    /**
     * Expand/Collapse all the rows no matter what their state is.
     * @param {?} expanded
     * @return {?}
     */
    toggleAllRows(expanded) {
        // clear prev expansions
        this.rowExpansions = [];
        // Capture the row index of the first row that is visible on the viewport.
        /** @type {?} */
        const viewPortFirstRowIndex = this.getAdjustedViewPortIndex();
        if (expanded) {
            for (const row of this.rows) {
                this.rowExpansions.push(row);
            }
        }
        if (this.scrollbarV) {
            // Refresh the full row heights cache since every row was affected.
            this.recalcLayout();
        }
        // Emit all rows that have been expanded.
        this.detailToggle.emit({
            rows: this.rows,
            currentIndex: viewPortFirstRowIndex
        });
    }
    /**
     * Recalculates the table
     * @return {?}
     */
    recalcLayout() {
        this.refreshRowHeightCache();
        this.updateIndexes();
        this.updateRows();
    }
    /**
     * Tracks the column
     * @param {?} index
     * @param {?} column
     * @return {?}
     */
    columnTrackingFn(index, column) {
        return column.$$id;
    }
    /**
     * Gets the row pinning group styles
     * @param {?} group
     * @return {?}
     */
    stylesByGroup(group) {
        /** @type {?} */
        const widths = this.columnGroupWidths;
        /** @type {?} */
        const offsetX = this.offsetX;
        /** @type {?} */
        const styles = {
            width: `${widths[group]}px`
        };
        if (group === 'left') {
            translateXY(styles, offsetX, 0);
        }
        else if (group === 'right') {
            /** @type {?} */
            const bodyWidth = parseInt(this.innerWidth + '', 0);
            /** @type {?} */
            const totalDiff = widths.total - bodyWidth;
            /** @type {?} */
            const offsetDiff = totalDiff - offsetX;
            /** @type {?} */
            const offset = (offsetDiff * -1) + 17;
            translateXY(styles, offset, 0);
        }
        return styles;
    }
    /**
     * Returns if the row was expanded and set default row expansion when row expansion is empty
     * @param {?} row
     * @return {?}
     */
    getRowExpanded(row) {
        if (this.rowExpansions.length === 0 && this.groupExpansionDefault) {
            for (const group of this.groupedRows) {
                this.rowExpansions.push(group);
            }
        }
        return this.getRowExpandedIdx(row, this.rowExpansions) > -1;
    }
    /**
     * @param {?} row
     * @param {?} expanded
     * @return {?}
     */
    getRowExpandedIdx(row, expanded) {
        if (!expanded || !expanded.length)
            return -1;
        /** @type {?} */
        const rowId = this.rowIdentity(row);
        return expanded.findIndex((/**
         * @param {?} r
         * @return {?}
         */
        (r) => {
            /** @type {?} */
            const id = this.rowIdentity(r);
            return id === rowId;
        }));
    }
    /**
     * Gets the row index given a row
     * @param {?} row
     * @return {?}
     */
    getRowIndex(row) {
        return this.rowIndexes.get(row) || 0;
    }
    /**
     * @param {?} row
     * @return {?}
     */
    onTreeAction(row) {
        this.treeAction.emit({ row });
    }
}
DataTableBodyComponent.decorators = [
    { type: Component, args: [{
                selector: 'datatable-body',
                template: `
    <datatable-selection
      #selector
      [selected]="selected"
      [rows]="rows"
      [selectCheck]="selectCheck"
      [selectEnabled]="selectEnabled"
      [selectionType]="selectionType"
      [rowIdentity]="rowIdentity"
      (select)="select.emit($event)"
      (activate)="activate.emit($event)"
    >
      <datatable-progress *ngIf="loadingIndicator"> </datatable-progress>
      <datatable-scroller
        *ngIf="rows?.length"
        [scrollbarV]="scrollbarV"
        [scrollbarH]="scrollbarH"
        [scrollHeight]="scrollHeight"
        [scrollWidth]="columnGroupWidths?.total"
        (scroll)="onBodyScroll($event)"
      >
        <datatable-summary-row
          *ngIf="summaryRow && summaryPosition === 'top'"
          [rowHeight]="summaryHeight"
          [offsetX]="offsetX"
          [innerWidth]="innerWidth"
          [rows]="rows"
          [columns]="columns"
        >
        </datatable-summary-row>
        <datatable-row-wrapper
          [groupedRows]="groupedRows"
          *ngFor="let group of temp; let i = index; trackBy: rowTrackingFn"
          [innerWidth]="innerWidth"
          [ngStyle]="getRowsStyles(group)"
          [rowDetail]="rowDetail"
          [groupHeader]="groupHeader"
          [offsetX]="offsetX"
          [detailRowHeight]="getDetailRowHeight(group[i], i)"
          [row]="group"
          [expanded]="getRowExpanded(group)"
          [rowIndex]="getRowIndex(group[i])"
          (rowContextmenu)="rowContextmenu.emit($event)"
        >
          <datatable-body-row
            *ngIf="!groupedRows; else groupedRowsTemplate"
            tabindex="-1"
            [isSelected]="selector.getRowSelected(group)"
            [innerWidth]="innerWidth"
            [offsetX]="offsetX"
            [columns]="columns"
            [rowHeight]="getRowHeight(group)"
            [row]="group"
            [rowIndex]="getRowIndex(group)"
            [expanded]="getRowExpanded(group)"
            [rowClass]="rowClass"
            [displayCheck]="displayCheck"
            [treeStatus]="group.treeStatus"
            (treeAction)="onTreeAction(group)"
            (activate)="selector.onActivate($event, indexes.first + i)"
          >
          </datatable-body-row>
          <ng-template #groupedRowsTemplate>
            <datatable-body-row
              *ngFor="let row of group.value; let i = index; trackBy: rowTrackingFn"
              tabindex="-1"
              [isSelected]="selector.getRowSelected(row)"
              [innerWidth]="innerWidth"
              [offsetX]="offsetX"
              [columns]="columns"
              [rowHeight]="getRowHeight(row)"
              [row]="row"
              [group]="group.value"
              [rowIndex]="getRowIndex(row)"
              [expanded]="getRowExpanded(row)"
              [rowClass]="rowClass"
              (activate)="selector.onActivate($event, i)"
            >
            </datatable-body-row>
          </ng-template>
        </datatable-row-wrapper>
        <datatable-summary-row
          *ngIf="summaryRow && summaryPosition === 'bottom'"
          [ngStyle]="getBottomSummaryRowStyles()"
          [rowHeight]="summaryHeight"
          [offsetX]="offsetX"
          [innerWidth]="innerWidth"
          [rows]="rows"
          [columns]="columns"
        >
        </datatable-summary-row>
      </datatable-scroller>
      <div class="empty-row" *ngIf="!rows?.length && !loadingIndicator" [innerHTML]="emptyMessage"></div>
    </datatable-selection>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    class: 'datatable-body'
                }
            }] }
];
/** @nocollapse */
DataTableBodyComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
DataTableBodyComponent.propDecorators = {
    scrollbarV: [{ type: Input }],
    scrollbarH: [{ type: Input }],
    loadingIndicator: [{ type: Input }],
    externalPaging: [{ type: Input }],
    rowHeight: [{ type: Input }],
    offsetX: [{ type: Input }],
    emptyMessage: [{ type: Input }],
    selectionType: [{ type: Input }],
    selected: [{ type: Input }],
    rowIdentity: [{ type: Input }],
    rowDetail: [{ type: Input }],
    groupHeader: [{ type: Input }],
    selectCheck: [{ type: Input }],
    displayCheck: [{ type: Input }],
    trackByProp: [{ type: Input }],
    rowClass: [{ type: Input }],
    groupedRows: [{ type: Input }],
    groupExpansionDefault: [{ type: Input }],
    innerWidth: [{ type: Input }],
    groupRowsBy: [{ type: Input }],
    virtualization: [{ type: Input }],
    summaryRow: [{ type: Input }],
    summaryPosition: [{ type: Input }],
    summaryHeight: [{ type: Input }],
    pageSize: [{ type: Input }],
    rows: [{ type: Input }],
    columns: [{ type: Input }],
    offset: [{ type: Input }],
    rowCount: [{ type: Input }],
    bodyWidth: [{ type: HostBinding, args: ['style.width',] }],
    bodyHeight: [{ type: Input }, { type: HostBinding, args: ['style.height',] }],
    scroll: [{ type: Output }],
    page: [{ type: Output }],
    activate: [{ type: Output }],
    select: [{ type: Output }],
    detailToggle: [{ type: Output }],
    rowContextmenu: [{ type: Output }],
    treeAction: [{ type: Output }],
    scroller: [{ type: ViewChild, args: [ScrollerComponent, { static: false },] }]
};
if (false) {
    /** @type {?} */
    DataTableBodyComponent.prototype.scrollbarV;
    /** @type {?} */
    DataTableBodyComponent.prototype.scrollbarH;
    /** @type {?} */
    DataTableBodyComponent.prototype.loadingIndicator;
    /** @type {?} */
    DataTableBodyComponent.prototype.externalPaging;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowHeight;
    /** @type {?} */
    DataTableBodyComponent.prototype.offsetX;
    /** @type {?} */
    DataTableBodyComponent.prototype.emptyMessage;
    /** @type {?} */
    DataTableBodyComponent.prototype.selectionType;
    /** @type {?} */
    DataTableBodyComponent.prototype.selected;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowIdentity;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowDetail;
    /** @type {?} */
    DataTableBodyComponent.prototype.groupHeader;
    /** @type {?} */
    DataTableBodyComponent.prototype.selectCheck;
    /** @type {?} */
    DataTableBodyComponent.prototype.displayCheck;
    /** @type {?} */
    DataTableBodyComponent.prototype.trackByProp;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowClass;
    /** @type {?} */
    DataTableBodyComponent.prototype.groupedRows;
    /** @type {?} */
    DataTableBodyComponent.prototype.groupExpansionDefault;
    /** @type {?} */
    DataTableBodyComponent.prototype.innerWidth;
    /** @type {?} */
    DataTableBodyComponent.prototype.groupRowsBy;
    /** @type {?} */
    DataTableBodyComponent.prototype.virtualization;
    /** @type {?} */
    DataTableBodyComponent.prototype.summaryRow;
    /** @type {?} */
    DataTableBodyComponent.prototype.summaryPosition;
    /** @type {?} */
    DataTableBodyComponent.prototype.summaryHeight;
    /** @type {?} */
    DataTableBodyComponent.prototype.scroll;
    /** @type {?} */
    DataTableBodyComponent.prototype.page;
    /** @type {?} */
    DataTableBodyComponent.prototype.activate;
    /** @type {?} */
    DataTableBodyComponent.prototype.select;
    /** @type {?} */
    DataTableBodyComponent.prototype.detailToggle;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowContextmenu;
    /** @type {?} */
    DataTableBodyComponent.prototype.treeAction;
    /** @type {?} */
    DataTableBodyComponent.prototype.scroller;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowHeightsCache;
    /** @type {?} */
    DataTableBodyComponent.prototype.temp;
    /** @type {?} */
    DataTableBodyComponent.prototype.offsetY;
    /** @type {?} */
    DataTableBodyComponent.prototype.indexes;
    /** @type {?} */
    DataTableBodyComponent.prototype.columnGroupWidths;
    /** @type {?} */
    DataTableBodyComponent.prototype.columnGroupWidthsWithoutGroup;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowTrackingFn;
    /** @type {?} */
    DataTableBodyComponent.prototype.listener;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowIndexes;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowExpansions;
    /** @type {?} */
    DataTableBodyComponent.prototype._rows;
    /** @type {?} */
    DataTableBodyComponent.prototype._bodyHeight;
    /** @type {?} */
    DataTableBodyComponent.prototype._columns;
    /** @type {?} */
    DataTableBodyComponent.prototype._rowCount;
    /** @type {?} */
    DataTableBodyComponent.prototype._offset;
    /** @type {?} */
    DataTableBodyComponent.prototype._pageSize;
    /**
     * Get the height of the detail row.
     * @type {?}
     */
    DataTableBodyComponent.prototype.getDetailRowHeight;
    /**
     * @type {?}
     * @private
     */
    DataTableBodyComponent.prototype.cd;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2JvZHkvYm9keS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDWixLQUFLLEVBQ0wsV0FBVyxFQUNYLGlCQUFpQixFQUNqQixTQUFTLEVBR1QsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXpELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQXdHcEQsTUFBTSxPQUFPLHNCQUFzQjs7Ozs7SUFxSmpDLFlBQW9CLEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBNUloQyxhQUFRLEdBQVUsRUFBRSxDQUFDO1FBeUZwQixXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDL0MsU0FBSSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzdDLGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqRCxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDL0MsaUJBQVksR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyRCxtQkFBYyxHQUFHLElBQUksWUFBWSxDQUFrQyxLQUFLLENBQUMsQ0FBQztRQUMxRSxlQUFVLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUF3QjdELG9CQUFlLEdBQW1C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QixtREFBdUI7O0lBQ3ZCLCtEQUFtQzs7SUFDbkMsK0NBQW1COztJQUNuQiwwQ0FBYzs7SUFDZCw0Q0FBNEI7O0lBQzVCLCtDQUEwQjs7SUFFMUIsdUNBQWE7O0lBQ2IsNkNBQWlCOztJQUNqQiwwQ0FBZ0I7O0lBQ2hCLDJDQUFrQjs7SUFDbEIseUNBQWdCOztJQUNoQiwyQ0FBa0I7Ozs7O0lBNE5sQixvREFNRTs7Ozs7SUE3TlUsb0NBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbnB1dCxcclxuICBIb3N0QmluZGluZyxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBWaWV3Q2hpbGQsXHJcbiAgT25Jbml0LFxyXG4gIE9uRGVzdHJveSxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTY3JvbGxlckNvbXBvbmVudCB9IGZyb20gJy4vc2Nyb2xsZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTW91c2VFdmVudCB9IGZyb20gJy4uLy4uL2V2ZW50cyc7XHJcbmltcG9ydCB7IFNlbGVjdGlvblR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9zZWxlY3Rpb24udHlwZSc7XHJcbmltcG9ydCB7IGNvbHVtbnNCeVBpbiwgY29sdW1uR3JvdXBXaWR0aHMgfSBmcm9tICcuLi8uLi91dGlscy9jb2x1bW4nO1xyXG5pbXBvcnQgeyBSb3dIZWlnaHRDYWNoZSB9IGZyb20gJy4uLy4uL3V0aWxzL3Jvdy1oZWlnaHQtY2FjaGUnO1xyXG5pbXBvcnQgeyB0cmFuc2xhdGVYWSB9IGZyb20gJy4uLy4uL3V0aWxzL3RyYW5zbGF0ZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2RhdGF0YWJsZS1ib2R5JyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRhdGF0YWJsZS1zZWxlY3Rpb25cclxuICAgICAgI3NlbGVjdG9yXHJcbiAgICAgIFtzZWxlY3RlZF09XCJzZWxlY3RlZFwiXHJcbiAgICAgIFtyb3dzXT1cInJvd3NcIlxyXG4gICAgICBbc2VsZWN0Q2hlY2tdPVwic2VsZWN0Q2hlY2tcIlxyXG4gICAgICBbc2VsZWN0RW5hYmxlZF09XCJzZWxlY3RFbmFibGVkXCJcclxuICAgICAgW3NlbGVjdGlvblR5cGVdPVwic2VsZWN0aW9uVHlwZVwiXHJcbiAgICAgIFtyb3dJZGVudGl0eV09XCJyb3dJZGVudGl0eVwiXHJcbiAgICAgIChzZWxlY3QpPVwic2VsZWN0LmVtaXQoJGV2ZW50KVwiXHJcbiAgICAgIChhY3RpdmF0ZSk9XCJhY3RpdmF0ZS5lbWl0KCRldmVudClcIlxyXG4gICAgPlxyXG4gICAgICA8ZGF0YXRhYmxlLXByb2dyZXNzICpuZ0lmPVwibG9hZGluZ0luZGljYXRvclwiPiA8L2RhdGF0YWJsZS1wcm9ncmVzcz5cclxuICAgICAgPGRhdGF0YWJsZS1zY3JvbGxlclxyXG4gICAgICAgICpuZ0lmPVwicm93cz8ubGVuZ3RoXCJcclxuICAgICAgICBbc2Nyb2xsYmFyVl09XCJzY3JvbGxiYXJWXCJcclxuICAgICAgICBbc2Nyb2xsYmFySF09XCJzY3JvbGxiYXJIXCJcclxuICAgICAgICBbc2Nyb2xsSGVpZ2h0XT1cInNjcm9sbEhlaWdodFwiXHJcbiAgICAgICAgW3Njcm9sbFdpZHRoXT1cImNvbHVtbkdyb3VwV2lkdGhzPy50b3RhbFwiXHJcbiAgICAgICAgKHNjcm9sbCk9XCJvbkJvZHlTY3JvbGwoJGV2ZW50KVwiXHJcbiAgICAgID5cclxuICAgICAgICA8ZGF0YXRhYmxlLXN1bW1hcnktcm93XHJcbiAgICAgICAgICAqbmdJZj1cInN1bW1hcnlSb3cgJiYgc3VtbWFyeVBvc2l0aW9uID09PSAndG9wJ1wiXHJcbiAgICAgICAgICBbcm93SGVpZ2h0XT1cInN1bW1hcnlIZWlnaHRcIlxyXG4gICAgICAgICAgW29mZnNldFhdPVwib2Zmc2V0WFwiXHJcbiAgICAgICAgICBbaW5uZXJXaWR0aF09XCJpbm5lcldpZHRoXCJcclxuICAgICAgICAgIFtyb3dzXT1cInJvd3NcIlxyXG4gICAgICAgICAgW2NvbHVtbnNdPVwiY29sdW1uc1wiXHJcbiAgICAgICAgPlxyXG4gICAgICAgIDwvZGF0YXRhYmxlLXN1bW1hcnktcm93PlxyXG4gICAgICAgIDxkYXRhdGFibGUtcm93LXdyYXBwZXJcclxuICAgICAgICAgIFtncm91cGVkUm93c109XCJncm91cGVkUm93c1wiXHJcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgZ3JvdXAgb2YgdGVtcDsgbGV0IGkgPSBpbmRleDsgdHJhY2tCeTogcm93VHJhY2tpbmdGblwiXHJcbiAgICAgICAgICBbaW5uZXJXaWR0aF09XCJpbm5lcldpZHRoXCJcclxuICAgICAgICAgIFtuZ1N0eWxlXT1cImdldFJvd3NTdHlsZXMoZ3JvdXApXCJcclxuICAgICAgICAgIFtyb3dEZXRhaWxdPVwicm93RGV0YWlsXCJcclxuICAgICAgICAgIFtncm91cEhlYWRlcl09XCJncm91cEhlYWRlclwiXHJcbiAgICAgICAgICBbb2Zmc2V0WF09XCJvZmZzZXRYXCJcclxuICAgICAgICAgIFtkZXRhaWxSb3dIZWlnaHRdPVwiZ2V0RGV0YWlsUm93SGVpZ2h0KGdyb3VwW2ldLCBpKVwiXHJcbiAgICAgICAgICBbcm93XT1cImdyb3VwXCJcclxuICAgICAgICAgIFtleHBhbmRlZF09XCJnZXRSb3dFeHBhbmRlZChncm91cClcIlxyXG4gICAgICAgICAgW3Jvd0luZGV4XT1cImdldFJvd0luZGV4KGdyb3VwW2ldKVwiXHJcbiAgICAgICAgICAocm93Q29udGV4dG1lbnUpPVwicm93Q29udGV4dG1lbnUuZW1pdCgkZXZlbnQpXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICA8ZGF0YXRhYmxlLWJvZHktcm93XHJcbiAgICAgICAgICAgICpuZ0lmPVwiIWdyb3VwZWRSb3dzOyBlbHNlIGdyb3VwZWRSb3dzVGVtcGxhdGVcIlxyXG4gICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcclxuICAgICAgICAgICAgW2lzU2VsZWN0ZWRdPVwic2VsZWN0b3IuZ2V0Um93U2VsZWN0ZWQoZ3JvdXApXCJcclxuICAgICAgICAgICAgW2lubmVyV2lkdGhdPVwiaW5uZXJXaWR0aFwiXHJcbiAgICAgICAgICAgIFtvZmZzZXRYXT1cIm9mZnNldFhcIlxyXG4gICAgICAgICAgICBbY29sdW1uc109XCJjb2x1bW5zXCJcclxuICAgICAgICAgICAgW3Jvd0hlaWdodF09XCJnZXRSb3dIZWlnaHQoZ3JvdXApXCJcclxuICAgICAgICAgICAgW3Jvd109XCJncm91cFwiXHJcbiAgICAgICAgICAgIFtyb3dJbmRleF09XCJnZXRSb3dJbmRleChncm91cClcIlxyXG4gICAgICAgICAgICBbZXhwYW5kZWRdPVwiZ2V0Um93RXhwYW5kZWQoZ3JvdXApXCJcclxuICAgICAgICAgICAgW3Jvd0NsYXNzXT1cInJvd0NsYXNzXCJcclxuICAgICAgICAgICAgW2Rpc3BsYXlDaGVja109XCJkaXNwbGF5Q2hlY2tcIlxyXG4gICAgICAgICAgICBbdHJlZVN0YXR1c109XCJncm91cC50cmVlU3RhdHVzXCJcclxuICAgICAgICAgICAgKHRyZWVBY3Rpb24pPVwib25UcmVlQWN0aW9uKGdyb3VwKVwiXHJcbiAgICAgICAgICAgIChhY3RpdmF0ZSk9XCJzZWxlY3Rvci5vbkFjdGl2YXRlKCRldmVudCwgaW5kZXhlcy5maXJzdCArIGkpXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgIDwvZGF0YXRhYmxlLWJvZHktcm93PlxyXG4gICAgICAgICAgPG5nLXRlbXBsYXRlICNncm91cGVkUm93c1RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8ZGF0YXRhYmxlLWJvZHktcm93XHJcbiAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IHJvdyBvZiBncm91cC52YWx1ZTsgbGV0IGkgPSBpbmRleDsgdHJhY2tCeTogcm93VHJhY2tpbmdGblwiXHJcbiAgICAgICAgICAgICAgdGFiaW5kZXg9XCItMVwiXHJcbiAgICAgICAgICAgICAgW2lzU2VsZWN0ZWRdPVwic2VsZWN0b3IuZ2V0Um93U2VsZWN0ZWQocm93KVwiXHJcbiAgICAgICAgICAgICAgW2lubmVyV2lkdGhdPVwiaW5uZXJXaWR0aFwiXHJcbiAgICAgICAgICAgICAgW29mZnNldFhdPVwib2Zmc2V0WFwiXHJcbiAgICAgICAgICAgICAgW2NvbHVtbnNdPVwiY29sdW1uc1wiXHJcbiAgICAgICAgICAgICAgW3Jvd0hlaWdodF09XCJnZXRSb3dIZWlnaHQocm93KVwiXHJcbiAgICAgICAgICAgICAgW3Jvd109XCJyb3dcIlxyXG4gICAgICAgICAgICAgIFtncm91cF09XCJncm91cC52YWx1ZVwiXHJcbiAgICAgICAgICAgICAgW3Jvd0luZGV4XT1cImdldFJvd0luZGV4KHJvdylcIlxyXG4gICAgICAgICAgICAgIFtleHBhbmRlZF09XCJnZXRSb3dFeHBhbmRlZChyb3cpXCJcclxuICAgICAgICAgICAgICBbcm93Q2xhc3NdPVwicm93Q2xhc3NcIlxyXG4gICAgICAgICAgICAgIChhY3RpdmF0ZSk9XCJzZWxlY3Rvci5vbkFjdGl2YXRlKCRldmVudCwgaSlcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgIDwvZGF0YXRhYmxlLWJvZHktcm93PlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICA8L2RhdGF0YWJsZS1yb3ctd3JhcHBlcj5cclxuICAgICAgICA8ZGF0YXRhYmxlLXN1bW1hcnktcm93XHJcbiAgICAgICAgICAqbmdJZj1cInN1bW1hcnlSb3cgJiYgc3VtbWFyeVBvc2l0aW9uID09PSAnYm90dG9tJ1wiXHJcbiAgICAgICAgICBbbmdTdHlsZV09XCJnZXRCb3R0b21TdW1tYXJ5Um93U3R5bGVzKClcIlxyXG4gICAgICAgICAgW3Jvd0hlaWdodF09XCJzdW1tYXJ5SGVpZ2h0XCJcclxuICAgICAgICAgIFtvZmZzZXRYXT1cIm9mZnNldFhcIlxyXG4gICAgICAgICAgW2lubmVyV2lkdGhdPVwiaW5uZXJXaWR0aFwiXHJcbiAgICAgICAgICBbcm93c109XCJyb3dzXCJcclxuICAgICAgICAgIFtjb2x1bW5zXT1cImNvbHVtbnNcIlxyXG4gICAgICAgID5cclxuICAgICAgICA8L2RhdGF0YWJsZS1zdW1tYXJ5LXJvdz5cclxuICAgICAgPC9kYXRhdGFibGUtc2Nyb2xsZXI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS1yb3dcIiAqbmdJZj1cIiFyb3dzPy5sZW5ndGggJiYgIWxvYWRpbmdJbmRpY2F0b3JcIiBbaW5uZXJIVE1MXT1cImVtcHR5TWVzc2FnZVwiPjwvZGl2PlxyXG4gICAgPC9kYXRhdGFibGUtc2VsZWN0aW9uPlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgaG9zdDoge1xyXG4gICAgY2xhc3M6ICdkYXRhdGFibGUtYm9keSdcclxuICB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVCb2R5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG4gIEBJbnB1dCgpIHNjcm9sbGJhclY6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgc2Nyb2xsYmFySDogYm9vbGVhbjtcclxuICBASW5wdXQoKSBsb2FkaW5nSW5kaWNhdG9yOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGV4dGVybmFsUGFnaW5nOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHJvd0hlaWdodDogbnVtYmVyIHwgJ2F1dG8nIHwgKChyb3c/OiBhbnkpID0+IG51bWJlcik7XHJcbiAgQElucHV0KCkgb2Zmc2V0WDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIGVtcHR5TWVzc2FnZTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHNlbGVjdGlvblR5cGU6IFNlbGVjdGlvblR5cGU7XHJcbiAgQElucHV0KCkgc2VsZWN0ZWQ6IGFueVtdID0gW107XHJcbiAgQElucHV0KCkgcm93SWRlbnRpdHk6IGFueTtcclxuICBASW5wdXQoKSByb3dEZXRhaWw6IGFueTtcclxuICBASW5wdXQoKSBncm91cEhlYWRlcjogYW55O1xyXG4gIEBJbnB1dCgpIHNlbGVjdENoZWNrOiBhbnk7XHJcbiAgQElucHV0KCkgZGlzcGxheUNoZWNrOiBhbnk7XHJcbiAgQElucHV0KCkgdHJhY2tCeVByb3A6IHN0cmluZztcclxuICBASW5wdXQoKSByb3dDbGFzczogYW55O1xyXG4gIEBJbnB1dCgpIGdyb3VwZWRSb3dzOiBhbnk7XHJcbiAgQElucHV0KCkgZ3JvdXBFeHBhbnNpb25EZWZhdWx0OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGlubmVyV2lkdGg6IG51bWJlcjtcclxuICBASW5wdXQoKSBncm91cFJvd3NCeTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHZpcnR1YWxpemF0aW9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHN1bW1hcnlSb3c6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgc3VtbWFyeVBvc2l0aW9uOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgc3VtbWFyeUhlaWdodDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKSBzZXQgcGFnZVNpemUodmFsOiBudW1iZXIpIHtcclxuICAgIHRoaXMuX3BhZ2VTaXplID0gdmFsO1xyXG4gICAgdGhpcy5yZWNhbGNMYXlvdXQoKTtcclxuICB9XHJcblxyXG4gIGdldCBwYWdlU2l6ZSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3BhZ2VTaXplO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KCkgc2V0IHJvd3ModmFsOiBhbnlbXSkge1xyXG4gICAgdGhpcy5fcm93cyA9IHZhbDtcclxuICAgIHRoaXMucmVjYWxjTGF5b3V0KCk7XHJcbiAgfVxyXG5cclxuICBnZXQgcm93cygpOiBhbnlbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcm93cztcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpIHNldCBjb2x1bW5zKHZhbDogYW55W10pIHtcclxuICAgIHRoaXMuX2NvbHVtbnMgPSB2YWw7XHJcbiAgICBjb25zdCBjb2xzQnlQaW4gPSBjb2x1bW5zQnlQaW4odmFsKTtcclxuICAgIHRoaXMuY29sdW1uR3JvdXBXaWR0aHMgPSBjb2x1bW5Hcm91cFdpZHRocyhjb2xzQnlQaW4sIHZhbCk7XHJcbiAgfVxyXG5cclxuICBnZXQgY29sdW1ucygpOiBhbnlbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpIHNldCBvZmZzZXQodmFsOiBudW1iZXIpIHtcclxuICAgIHRoaXMuX29mZnNldCA9IHZhbDtcclxuICAgIGlmICghdGhpcy5zY3JvbGxiYXJWIHx8ICh0aGlzLnNjcm9sbGJhclYgJiYgIXRoaXMudmlydHVhbGl6YXRpb24pKVxyXG4gICAgICB0aGlzLnJlY2FsY0xheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IG9mZnNldCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpIHNldCByb3dDb3VudCh2YWw6IG51bWJlcikge1xyXG4gICAgdGhpcy5fcm93Q291bnQgPSB2YWw7XHJcbiAgICB0aGlzLnJlY2FsY0xheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHJvd0NvdW50KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcm93Q291bnQ7XHJcbiAgfVxyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLndpZHRoJylcclxuICBnZXQgYm9keVdpZHRoKCk6IHN0cmluZyB7XHJcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJIKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlubmVyV2lkdGggKyAncHgnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuICcxMDAlJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKVxyXG4gIHNldCBib2R5SGVpZ2h0KHZhbCkge1xyXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyVikge1xyXG4gICAgICB0aGlzLl9ib2R5SGVpZ2h0ID0gdmFsICsgJ3B4JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2JvZHlIZWlnaHQgPSAnYXV0byc7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZWNhbGNMYXlvdXQoKTtcclxuICB9XHJcblxyXG4gIGdldCBib2R5SGVpZ2h0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2JvZHlIZWlnaHQ7XHJcbiAgfVxyXG5cclxuICBAT3V0cHV0KCkgc2Nyb2xsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgcGFnZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgc2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgZGV0YWlsVG9nZ2xlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgcm93Q29udGV4dG1lbnUgPSBuZXcgRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IE1vdXNlRXZlbnQ7IHJvdzogYW55IH0+KGZhbHNlKTtcclxuICBAT3V0cHV0KCkgdHJlZUFjdGlvbjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBWaWV3Q2hpbGQoU2Nyb2xsZXJDb21wb25lbnQsIHsgc3RhdGljOiBmYWxzZSB9KSBzY3JvbGxlcjogU2Nyb2xsZXJDb21wb25lbnQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgaWYgc2VsZWN0aW9uIGlzIGVuYWJsZWQuXHJcbiAgICovXHJcbiAgZ2V0IHNlbGVjdEVuYWJsZWQoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gISF0aGlzLnNlbGVjdGlvblR5cGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQcm9wZXJ0eSB0aGF0IHdvdWxkIGNhbGN1bGF0ZSB0aGUgaGVpZ2h0IG9mIHNjcm9sbCBiYXJcclxuICAgKiBiYXNlZCBvbiB0aGUgcm93IGhlaWdodHMgY2FjaGUgZm9yIHZpcnR1YWwgc2Nyb2xsIGFuZCB2aXJ0dWFsaXphdGlvbi4gT3RoZXIgc2NlbmFyaW9zXHJcbiAgICogY2FsY3VsYXRlIHNjcm9sbCBoZWlnaHQgYXV0b21hdGljYWxseSAoYXMgaGVpZ2h0IHdpbGwgYmUgdW5kZWZpbmVkKS5cclxuICAgKi9cclxuICBnZXQgc2Nyb2xsSGVpZ2h0KCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XHJcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWICYmIHRoaXMudmlydHVhbGl6YXRpb24gJiYgdGhpcy5yb3dDb3VudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3dIZWlnaHRzQ2FjaGUucXVlcnkodGhpcy5yb3dDb3VudCAtIDEpO1xyXG4gICAgfVxyXG4gICAgLy8gYXZvaWQgVFM3MDMwOiBOb3QgYWxsIGNvZGUgcGF0aHMgcmV0dXJuIGEgdmFsdWUuXHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgcm93SGVpZ2h0c0NhY2hlOiBSb3dIZWlnaHRDYWNoZSA9IG5ldyBSb3dIZWlnaHRDYWNoZSgpO1xyXG4gIHRlbXA6IGFueVtdID0gW107XHJcbiAgb2Zmc2V0WSA9IDA7XHJcbiAgaW5kZXhlczogYW55ID0ge307XHJcbiAgY29sdW1uR3JvdXBXaWR0aHM6IGFueTtcclxuICBjb2x1bW5Hcm91cFdpZHRoc1dpdGhvdXRHcm91cDogYW55O1xyXG4gIHJvd1RyYWNraW5nRm46IGFueTtcclxuICBsaXN0ZW5lcjogYW55O1xyXG4gIHJvd0luZGV4ZXM6IGFueSA9IG5ldyBNYXAoKTtcclxuICByb3dFeHBhbnNpb25zOiBhbnlbXSA9IFtdO1xyXG5cclxuICBfcm93czogYW55W107XHJcbiAgX2JvZHlIZWlnaHQ6IGFueTtcclxuICBfY29sdW1uczogYW55W107XHJcbiAgX3Jvd0NvdW50OiBudW1iZXI7XHJcbiAgX29mZnNldDogbnVtYmVyO1xyXG4gIF9wYWdlU2l6ZTogbnVtYmVyO1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIERhdGFUYWJsZUJvZHlDb21wb25lbnQuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcclxuICAgIC8vIGRlY2xhcmUgZm4gaGVyZSBzbyB3ZSBjYW4gZ2V0IGFjY2VzcyB0byB0aGUgYHRoaXNgIHByb3BlcnR5XHJcbiAgICB0aGlzLnJvd1RyYWNraW5nRm4gPSAoaW5kZXg6IG51bWJlciwgcm93OiBhbnkpOiBhbnkgPT4ge1xyXG4gICAgICBjb25zdCBpZHggPSB0aGlzLmdldFJvd0luZGV4KHJvdyk7XHJcbiAgICAgIGlmICh0aGlzLnRyYWNrQnlQcm9wKSB7XHJcbiAgICAgICAgcmV0dXJuIHJvd1t0aGlzLnRyYWNrQnlQcm9wXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gaWR4O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGFmdGVyIHRoZSBjb25zdHJ1Y3RvciwgaW5pdGlhbGl6aW5nIGlucHV0IHByb3BlcnRpZXNcclxuICAgKi9cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnJvd0RldGFpbCkge1xyXG4gICAgICB0aGlzLmxpc3RlbmVyID0gdGhpcy5yb3dEZXRhaWwudG9nZ2xlLnN1YnNjcmliZSgoeyB0eXBlLCB2YWx1ZSB9OiB7IHR5cGU6IHN0cmluZzsgdmFsdWU6IGFueSB9KSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdyb3cnKSB7XHJcbiAgICAgICAgICB0aGlzLnRvZ2dsZVJvd0V4cGFuc2lvbih2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlID09PSAnYWxsJykge1xyXG4gICAgICAgICAgdGhpcy50b2dnbGVBbGxSb3dzKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlZnJlc2ggcm93cyBhZnRlciB0b2dnbGVcclxuICAgICAgICAvLyBGaXhlcyAjODgzXHJcbiAgICAgICAgdGhpcy51cGRhdGVJbmRleGVzKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSb3dzKCk7XHJcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZ3JvdXBIZWFkZXIpIHtcclxuICAgICAgdGhpcy5saXN0ZW5lciA9IHRoaXMuZ3JvdXBIZWFkZXIudG9nZ2xlLnN1YnNjcmliZSgoeyB0eXBlLCB2YWx1ZSB9OiB7IHR5cGU6IHN0cmluZzsgdmFsdWU6IGFueSB9KSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdncm91cCcpIHtcclxuICAgICAgICAgIHRoaXMudG9nZ2xlUm93RXhwYW5zaW9uKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdhbGwnKSB7XHJcbiAgICAgICAgICB0aGlzLnRvZ2dsZUFsbFJvd3ModmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVmcmVzaCByb3dzIGFmdGVyIHRvZ2dsZVxyXG4gICAgICAgIC8vIEZpeGVzICM4ODNcclxuICAgICAgICB0aGlzLnVwZGF0ZUluZGV4ZXMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJvd3MoKTtcclxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBvbmNlLCBiZWZvcmUgdGhlIGluc3RhbmNlIGlzIGRlc3Ryb3llZC5cclxuICAgKi9cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnJvd0RldGFpbCB8fCB0aGlzLmdyb3VwSGVhZGVyKSB7XHJcbiAgICAgIHRoaXMubGlzdGVuZXIudW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZXMgdGhlIFkgb2Zmc2V0IGdpdmVuIGEgbmV3IG9mZnNldC5cclxuICAgKi9cclxuICB1cGRhdGVPZmZzZXRZKG9mZnNldD86IG51bWJlcik6IHZvaWQge1xyXG4gICAgLy8gc2Nyb2xsZXIgaXMgbWlzc2luZyBvbiBlbXB0eSB0YWJsZVxyXG4gICAgaWYgKCF0aGlzLnNjcm9sbGVyKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWICYmIHRoaXMudmlydHVhbGl6YXRpb24gJiYgb2Zmc2V0KSB7XHJcbiAgICAgIC8vIEZpcnN0IGdldCB0aGUgcm93IEluZGV4IHRoYXQgd2UgbmVlZCB0byBtb3ZlIHRvLlxyXG4gICAgICBjb25zdCByb3dJbmRleCA9IHRoaXMucGFnZVNpemUgKiBvZmZzZXQ7XHJcbiAgICAgIG9mZnNldCA9IHRoaXMucm93SGVpZ2h0c0NhY2hlLnF1ZXJ5KHJvd0luZGV4IC0gMSk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2Nyb2xsYmFyViAmJiAhdGhpcy52aXJ0dWFsaXphdGlvbikge1xyXG4gICAgICBvZmZzZXQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2Nyb2xsZXIuc2V0T2Zmc2V0KG9mZnNldCB8fCAwKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEJvZHkgd2FzIHNjcm9sbGVkLCB0aGlzIGlzIG1haW5seSB1c2VmdWwgZm9yXHJcbiAgICogd2hlbiBhIHVzZXIgaXMgc2VydmVyLXNpZGUgcGFnaW5hdGlvbiB2aWEgdmlydHVhbCBzY3JvbGwuXHJcbiAgICovXHJcbiAgb25Cb2R5U2Nyb2xsKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNjcm9sbFlQb3M6IG51bWJlciA9IGV2ZW50LnNjcm9sbFlQb3M7XHJcbiAgICBjb25zdCBzY3JvbGxYUG9zOiBudW1iZXIgPSBldmVudC5zY3JvbGxYUG9zO1xyXG5cclxuICAgIC8vIGlmIHNjcm9sbCBjaGFuZ2UsIHRyaWdnZXIgdXBkYXRlXHJcbiAgICAvLyB0aGlzIGlzIG1haW5seSB1c2VkIGZvciBoZWFkZXIgY2VsbCBwb3NpdGlvbnNcclxuICAgIGlmICh0aGlzLm9mZnNldFkgIT09IHNjcm9sbFlQb3MgfHwgdGhpcy5vZmZzZXRYICE9PSBzY3JvbGxYUG9zKSB7XHJcbiAgICAgIHRoaXMuc2Nyb2xsLmVtaXQoe1xyXG4gICAgICAgIG9mZnNldFk6IHNjcm9sbFlQb3MsXHJcbiAgICAgICAgb2Zmc2V0WDogc2Nyb2xsWFBvc1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9mZnNldFkgPSBzY3JvbGxZUG9zO1xyXG4gICAgdGhpcy5vZmZzZXRYID0gc2Nyb2xsWFBvcztcclxuXHJcbiAgICB0aGlzLnVwZGF0ZUluZGV4ZXMoKTtcclxuICAgIHRoaXMudXBkYXRlUGFnZShldmVudC5kaXJlY3Rpb24pO1xyXG4gICAgdGhpcy51cGRhdGVSb3dzKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGVzIHRoZSBwYWdlIGdpdmVuIGEgZGlyZWN0aW9uLlxyXG4gICAqL1xyXG4gIHVwZGF0ZVBhZ2UoZGlyZWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGxldCBvZmZzZXQgPSB0aGlzLmluZGV4ZXMuZmlyc3QgLyB0aGlzLnBhZ2VTaXplO1xyXG5cclxuICAgIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcclxuICAgICAgb2Zmc2V0ID0gTWF0aC5jZWlsKG9mZnNldCk7XHJcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSB7XHJcbiAgICAgIG9mZnNldCA9IE1hdGguZmxvb3Iob2Zmc2V0KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGlyZWN0aW9uICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG9mZnNldCkpIHtcclxuICAgICAgdGhpcy5wYWdlLmVtaXQoeyBvZmZzZXQgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGVzIHRoZSByb3dzIGluIHRoZSB2aWV3IHBvcnRcclxuICAgKi9cclxuICB1cGRhdGVSb3dzKCk6IHZvaWQge1xyXG4gICAgY29uc3QgeyBmaXJzdCwgbGFzdCB9ID0gdGhpcy5pbmRleGVzO1xyXG4gICAgbGV0IHJvd0luZGV4ID0gZmlyc3Q7XHJcbiAgICBsZXQgaWR4ID0gMDtcclxuICAgIGNvbnN0IHRlbXA6IGFueVtdID0gW107XHJcblxyXG4gICAgdGhpcy5yb3dJbmRleGVzLmNsZWFyKCk7XHJcblxyXG4gICAgLy8gaWYgZ3JvdXByb3dzYnkgaGFzIGJlZW4gc3BlY2lmaWVkIHRyZWF0IHJvdyBwYWdpbmdcclxuICAgIC8vIHBhcmFtZXRlcnMgYXMgZ3JvdXAgcGFnaW5nIHBhcmFtZXRlcnMgaWUgaWYgbGltaXQgMTAgaGFzIGJlZW5cclxuICAgIC8vIHNwZWNpZmllZCB0cmVhdCBpdCBhcyAxMCBncm91cHMgcmF0aGVyIHRoYW4gMTAgcm93c1xyXG4gICAgaWYgKHRoaXMuZ3JvdXBlZFJvd3MpIHtcclxuICAgICAgbGV0IG1heFJvd3NQZXJHcm91cCA9IDM7XHJcbiAgICAgIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lIGdyb3VwIHNldCB0aGUgbWF4aW11bSBudW1iZXIgb2ZcclxuICAgICAgLy8gcm93cyBwZXIgZ3JvdXAgdGhlIHNhbWUgYXMgdGhlIHRvdGFsIG51bWJlciBvZiByb3dzXHJcbiAgICAgIGlmICh0aGlzLmdyb3VwZWRSb3dzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIG1heFJvd3NQZXJHcm91cCA9IHRoaXMuZ3JvdXBlZFJvd3NbMF0udmFsdWUubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3aGlsZSAocm93SW5kZXggPCBsYXN0ICYmIHJvd0luZGV4IDwgdGhpcy5ncm91cGVkUm93cy5sZW5ndGgpIHtcclxuICAgICAgICAvLyBBZGQgdGhlIGdyb3VwcyBpbnRvIHRoaXMgcGFnZVxyXG4gICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cGVkUm93c1tyb3dJbmRleF07XHJcbiAgICAgICAgdGVtcFtpZHhdID0gZ3JvdXA7XHJcbiAgICAgICAgaWR4Kys7XHJcblxyXG4gICAgICAgIC8vIEdyb3VwIGluZGV4IGluIHRoaXMgY29udGV4dFxyXG4gICAgICAgIHJvd0luZGV4Kys7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdoaWxlIChyb3dJbmRleCA8IGxhc3QgJiYgcm93SW5kZXggPCB0aGlzLnJvd0NvdW50KSB7XHJcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5yb3dzW3Jvd0luZGV4XTtcclxuXHJcbiAgICAgICAgaWYgKHJvdykge1xyXG4gICAgICAgICAgdGhpcy5yb3dJbmRleGVzLnNldChyb3csIHJvd0luZGV4KTtcclxuICAgICAgICAgIHRlbXBbaWR4XSA9IHJvdztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlkeCsrO1xyXG4gICAgICAgIHJvd0luZGV4Kys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRlbXAgPSB0ZW1wO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSByb3cgaGVpZ2h0XHJcbiAgICovXHJcbiAgZ2V0Um93SGVpZ2h0KHJvdzogYW55KTogbnVtYmVyIHtcclxuICAgIC8vIGlmIGl0cyBhIGZ1bmN0aW9uIHJldHVybiBpdFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLnJvd0hlaWdodCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3dIZWlnaHQocm93KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5yb3dIZWlnaHQgYXMgbnVtYmVyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIGdyb3VwIHRoZSBncm91cCB3aXRoIGFsbCByb3dzXHJcbiAgICovXHJcbiAgZ2V0R3JvdXBIZWlnaHQoZ3JvdXA6IGFueSk6IG51bWJlciB7XHJcbiAgICBsZXQgcm93SGVpZ2h0ID0gMDtcclxuXHJcbiAgICBpZiAoZ3JvdXAudmFsdWUpIHtcclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGdyb3VwLnZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIHJvd0hlaWdodCArPSB0aGlzLmdldFJvd0FuZERldGFpbEhlaWdodChncm91cC52YWx1ZVtpbmRleF0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJvd0hlaWdodDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZSByb3cgaGVpZ2h0IGJhc2VkIG9uIHRoZSBleHBhbmRlZCBzdGF0ZSBvZiB0aGUgcm93LlxyXG4gICAqL1xyXG4gIGdldFJvd0FuZERldGFpbEhlaWdodChyb3c6IGFueSk6IG51bWJlciB7XHJcbiAgICBsZXQgcm93SGVpZ2h0ID0gdGhpcy5nZXRSb3dIZWlnaHQocm93KTtcclxuICAgIGNvbnN0IGV4cGFuZGVkID0gdGhpcy5nZXRSb3dFeHBhbmRlZChyb3cpO1xyXG5cclxuICAgIC8vIEFkZGluZyBkZXRhaWwgcm93IGhlaWdodCBpZiBpdHMgZXhwYW5kZWQuXHJcbiAgICBpZiAoZXhwYW5kZWQpIHtcclxuICAgICAgcm93SGVpZ2h0ICs9IHRoaXMuZ2V0RGV0YWlsUm93SGVpZ2h0KHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJvd0hlaWdodDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgaGVpZ2h0IG9mIHRoZSBkZXRhaWwgcm93LlxyXG4gICAqL1xyXG4gIGdldERldGFpbFJvd0hlaWdodCA9IChyb3c/OiBhbnksIGluZGV4PzogYW55KTogbnVtYmVyID0+IHtcclxuICAgIGlmICghdGhpcy5yb3dEZXRhaWwpIHtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICBjb25zdCByb3dIZWlnaHQgPSB0aGlzLnJvd0RldGFpbC5yb3dIZWlnaHQ7XHJcbiAgICByZXR1cm4gdHlwZW9mIHJvd0hlaWdodCA9PT0gJ2Z1bmN0aW9uJyA/IHJvd0hlaWdodChyb3csIGluZGV4KSA6IChyb3dIZWlnaHQgYXMgbnVtYmVyKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGVzIHRoZSBzdHlsZXMgZm9yIHRoZSByb3cgc28gdGhhdCB0aGUgcm93cyBjYW4gYmUgbW92ZWQgaW4gMkQgc3BhY2VcclxuICAgKiBkdXJpbmcgdmlydHVhbCBzY3JvbGwgaW5zaWRlIHRoZSBET00uICAgSW4gdGhlIGJlbG93IGNhc2UgdGhlIFkgcG9zaXRpb24gaXNcclxuICAgKiBtYW5pcHVsYXRlZC4gICBBcyBhbiBleGFtcGxlLCBpZiB0aGUgaGVpZ2h0IG9mIHJvdyAwIGlzIDMwIHB4IGFuZCByb3cgMSBpc1xyXG4gICAqIDEwMCBweCB0aGVuIGZvbGxvd2luZyBzdHlsZXMgYXJlIGdlbmVyYXRlZDpcclxuICAgKlxyXG4gICAqIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMHB4LCAwcHgsIDBweCk7ICAgIC0+ICByb3cwXHJcbiAgICogdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwcHgsIDMwcHgsIDBweCk7ICAgLT4gIHJvdzFcclxuICAgKiB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDBweCwgMTMwcHgsIDBweCk7ICAtPiAgcm93MlxyXG4gICAqXHJcbiAgICogUm93IGhlaWdodHMgaGF2ZSB0byBiZSBjYWxjdWxhdGVkIGJhc2VkIG9uIHRoZSByb3cgaGVpZ2h0cyBjYWNoZSBhcyB3ZSB3b250XHJcbiAgICogYmUgYWJsZSB0byBkZXRlcm1pbmUgd2hpY2ggcm93IGlzIG9mIHdoYXQgaGVpZ2h0IGJlZm9yZSBoYW5kLiAgSW4gdGhlIGFib3ZlXHJcbiAgICogY2FzZSB0aGUgcG9zaXRpb25ZIG9mIHRoZSB0cmFuc2xhdGUzZCBmb3Igcm93MiB3b3VsZCBiZSB0aGUgc3VtIG9mIGFsbCB0aGVcclxuICAgKiBoZWlnaHRzIG9mIHRoZSByb3dzIGJlZm9yZSBpdCAoaS5lLiByb3cwIGFuZCByb3cxKS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByb3dzIHRoZSByb3cgdGhhdCBuZWVkcyB0byBiZSBwbGFjZWQgaW4gdGhlIDJEIHNwYWNlLlxyXG4gICAqIEByZXR1cm5zIHRoZSBDU1MzIHN0eWxlIHRvIGJlIGFwcGxpZWRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBEYXRhVGFibGVCb2R5Q29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0Um93c1N0eWxlcyhyb3dzOiBhbnkpOiBhbnkge1xyXG4gICAgY29uc3Qgc3R5bGVzOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvLyBvbmx5IGFkZCBzdHlsZXMgZm9yIHRoZSBncm91cCBpZiB0aGVyZSBpcyBhIGdyb3VwXHJcbiAgICBpZiAodGhpcy5ncm91cGVkUm93cykge1xyXG4gICAgICBzdHlsZXMud2lkdGggPSB0aGlzLmNvbHVtbkdyb3VwV2lkdGhzLnRvdGFsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNjcm9sbGJhclYgJiYgdGhpcy52aXJ0dWFsaXphdGlvbikge1xyXG4gICAgICBsZXQgaWR4ID0gMDtcclxuXHJcbiAgICAgIGlmICh0aGlzLmdyb3VwZWRSb3dzKSB7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBsYXRlc3Qgcm93IHJvd2luZGV4IGluIGEgZ3JvdXBcclxuICAgICAgICBjb25zdCByb3cgPSByb3dzW3Jvd3MubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgaWR4ID0gcm93ID8gdGhpcy5nZXRSb3dJbmRleChyb3cpIDogMDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZHggPSB0aGlzLmdldFJvd0luZGV4KHJvd3MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBjb25zdCBwb3MgPSBpZHggKiByb3dIZWlnaHQ7XHJcbiAgICAgIC8vIFRoZSBwb3NpdGlvbiBvZiB0aGlzIHJvdyB3b3VsZCBiZSB0aGUgc3VtIG9mIGFsbCByb3cgaGVpZ2h0c1xyXG4gICAgICAvLyB1bnRpbCB0aGUgcHJldmlvdXMgcm93IHBvc2l0aW9uLlxyXG4gICAgICBjb25zdCBwb3MgPSB0aGlzLnJvd0hlaWdodHNDYWNoZS5xdWVyeShpZHggLSAxKTtcclxuXHJcbiAgICAgIHRyYW5zbGF0ZVhZKHN0eWxlcywgMCwgcG9zKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3R5bGVzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlIGJvdHRvbSBzdW1tYXJ5IHJvdyBvZmZzZXQgZm9yIHNjcm9sbGJhciBtb2RlLlxyXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGNhY2hlIGFuZCBvZmZzZXQgY2FsY3VsYXRpb25cclxuICAgKiBzZWUgZGVzY3JpcHRpb24gZm9yIGBnZXRSb3dzU3R5bGVzYCBtZXRob2RcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHRoZSBDU1MzIHN0eWxlIHRvIGJlIGFwcGxpZWRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBEYXRhVGFibGVCb2R5Q29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0Qm90dG9tU3VtbWFyeVJvd1N0eWxlcygpOiBhbnkge1xyXG4gICAgaWYgKCF0aGlzLnNjcm9sbGJhclYgfHwgIXRoaXMucm93cyB8fCAhdGhpcy5yb3dzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdHlsZXMgPSB7IHBvc2l0aW9uOiAnYWJzb2x1dGUnIH07XHJcbiAgICBjb25zdCBwb3MgPSB0aGlzLnJvd0hlaWdodHNDYWNoZS5xdWVyeSh0aGlzLnJvd3MubGVuZ3RoIC0gMSk7XHJcblxyXG4gICAgdHJhbnNsYXRlWFkoc3R5bGVzLCAwLCBwb3MpO1xyXG5cclxuICAgIHJldHVybiBzdHlsZXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIaWRlcyB0aGUgbG9hZGluZyBpbmRpY2F0b3JcclxuICAgKi9cclxuICBoaWRlSW5kaWNhdG9yKCk6IHZvaWQge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiAodGhpcy5sb2FkaW5nSW5kaWNhdG9yID0gZmFsc2UpLCA1MDApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlcyB0aGUgaW5kZXggb2YgdGhlIHJvd3MgaW4gdGhlIHZpZXdwb3J0XHJcbiAgICovXHJcbiAgdXBkYXRlSW5kZXhlcygpOiB2b2lkIHtcclxuICAgIGxldCBmaXJzdCA9IDA7XHJcbiAgICBsZXQgbGFzdCA9IDA7XHJcblxyXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyVikge1xyXG4gICAgICBpZiAodGhpcy52aXJ0dWFsaXphdGlvbikge1xyXG4gICAgICAgIC8vIENhbGN1bGF0aW9uIG9mIHRoZSBmaXJzdCBhbmQgbGFzdCBpbmRleGVzIHdpbGwgYmUgYmFzZWQgb24gd2hlcmUgdGhlXHJcbiAgICAgICAgLy8gc2Nyb2xsWSBwb3NpdGlvbiB3b3VsZCBiZSBhdC4gIFRoZSBsYXN0IGluZGV4IHdvdWxkIGJlIHRoZSBvbmVcclxuICAgICAgICAvLyB0aGF0IHNob3dzIHVwIGluc2lkZSB0aGUgdmlldyBwb3J0IHRoZSBsYXN0LlxyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHBhcnNlSW50KHRoaXMuYm9keUhlaWdodCwgMCk7XHJcbiAgICAgICAgZmlyc3QgPSB0aGlzLnJvd0hlaWdodHNDYWNoZS5nZXRSb3dJbmRleCh0aGlzLm9mZnNldFkpO1xyXG4gICAgICAgIGxhc3QgPSB0aGlzLnJvd0hlaWdodHNDYWNoZS5nZXRSb3dJbmRleChoZWlnaHQgKyB0aGlzLm9mZnNldFkpICsgMTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJZiB2aXJ0dWFsIHJvd3MgYXJlIG5vdCBuZWVkZWRcclxuICAgICAgICAvLyBXZSByZW5kZXIgYWxsIGluIG9uZSBnb1xyXG4gICAgICAgIGZpcnN0ID0gMDtcclxuICAgICAgICBsYXN0ID0gdGhpcy5yb3dDb3VudDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gVGhlIHNlcnZlciBpcyBoYW5kbGluZyBwYWdpbmcgYW5kIHdpbGwgcGFzcyBhbiBhcnJheSB0aGF0IGJlZ2lucyB3aXRoIHRoZVxyXG4gICAgICAvLyBlbGVtZW50IGF0IGEgc3BlY2lmaWVkIG9mZnNldC4gIGZpcnN0IHNob3VsZCBhbHdheXMgYmUgMCB3aXRoIGV4dGVybmFsIHBhZ2luZy5cclxuICAgICAgaWYgKCF0aGlzLmV4dGVybmFsUGFnaW5nKSB7XHJcbiAgICAgICAgZmlyc3QgPSBNYXRoLm1heCh0aGlzLm9mZnNldCAqIHRoaXMucGFnZVNpemUsIDApO1xyXG4gICAgICB9XHJcbiAgICAgIGxhc3QgPSBNYXRoLm1pbihmaXJzdCArIHRoaXMucGFnZVNpemUsIHRoaXMucm93Q291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5kZXhlcyA9IHsgZmlyc3QsIGxhc3QgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZnJlc2hlcyB0aGUgZnVsbCBSb3cgSGVpZ2h0IGNhY2hlLiAgU2hvdWxkIGJlIHVzZWRcclxuICAgKiB3aGVuIHRoZSBlbnRpcmUgcm93IGFycmF5IHN0YXRlIGhhcyBjaGFuZ2VkLlxyXG4gICAqL1xyXG4gIHJlZnJlc2hSb3dIZWlnaHRDYWNoZSgpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5zY3JvbGxiYXJWIHx8ICh0aGlzLnNjcm9sbGJhclYgJiYgIXRoaXMudmlydHVhbGl6YXRpb24pKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjbGVhciB0aGUgcHJldmlvdXMgcm93IGhlaWdodCBjYWNoZSBpZiBhbHJlYWR5IHByZXNlbnQuXHJcbiAgICAvLyB0aGlzIGlzIHVzZWZ1bCBkdXJpbmcgc29ydHMsIGZpbHRlcnMgd2hlcmUgdGhlIHN0YXRlIG9mIHRoZVxyXG4gICAgLy8gcm93cyBhcnJheSBpcyBjaGFuZ2VkLlxyXG4gICAgdGhpcy5yb3dIZWlnaHRzQ2FjaGUuY2xlYXJDYWNoZSgpO1xyXG5cclxuICAgIC8vIEluaXRpYWxpemUgdGhlIHRyZWUgb25seSBpZiB0aGVyZSBhcmUgcm93cyBpbnNpZGUgdGhlIHRyZWUuXHJcbiAgICBpZiAodGhpcy5yb3dzICYmIHRoaXMucm93cy5sZW5ndGgpIHtcclxuICAgICAgY29uc3Qgcm93RXhwYW5zaW9ucyA9IG5ldyBTZXQoKTtcclxuICAgICAgZm9yIChjb25zdCByb3cgb2YgdGhpcy5yb3dzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0Um93RXhwYW5kZWQocm93KSkge1xyXG4gICAgICAgICAgcm93RXhwYW5zaW9ucy5hZGQocm93KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMucm93SGVpZ2h0c0NhY2hlLmluaXRDYWNoZSh7XHJcbiAgICAgICAgcm93czogdGhpcy5yb3dzLFxyXG4gICAgICAgIHJvd0hlaWdodDogdGhpcy5yb3dIZWlnaHQsXHJcbiAgICAgICAgZGV0YWlsUm93SGVpZ2h0OiB0aGlzLmdldERldGFpbFJvd0hlaWdodCxcclxuICAgICAgICBleHRlcm5hbFZpcnR1YWw6IHRoaXMuc2Nyb2xsYmFyViAmJiB0aGlzLmV4dGVybmFsUGFnaW5nLFxyXG4gICAgICAgIHJvd0NvdW50OiB0aGlzLnJvd0NvdW50LFxyXG4gICAgICAgIHJvd0luZGV4ZXM6IHRoaXMucm93SW5kZXhlcyxcclxuICAgICAgICByb3dFeHBhbnNpb25zXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgaW5kZXggZm9yIHRoZSB2aWV3IHBvcnRcclxuICAgKi9cclxuICBnZXRBZGp1c3RlZFZpZXdQb3J0SW5kZXgoKTogbnVtYmVyIHtcclxuICAgIC8vIENhcHR1cmUgdGhlIHJvdyBpbmRleCBvZiB0aGUgZmlyc3Qgcm93IHRoYXQgaXMgdmlzaWJsZSBvbiB0aGUgdmlld3BvcnQuXHJcbiAgICAvLyBJZiB0aGUgc2Nyb2xsIGJhciBpcyBqdXN0IGJlbG93IHRoZSByb3cgd2hpY2ggaXMgaGlnaGxpZ2h0ZWQgdGhlbiBtYWtlIHRoYXQgYXMgdGhlXHJcbiAgICAvLyBmaXJzdCBpbmRleC5cclxuICAgIGNvbnN0IHZpZXdQb3J0Rmlyc3RSb3dJbmRleCA9IHRoaXMuaW5kZXhlcy5maXJzdDtcclxuXHJcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWICYmIHRoaXMudmlydHVhbGl6YXRpb24pIHtcclxuICAgICAgY29uc3Qgb2Zmc2V0U2Nyb2xsID0gdGhpcy5yb3dIZWlnaHRzQ2FjaGUucXVlcnkodmlld1BvcnRGaXJzdFJvd0luZGV4IC0gMSk7XHJcbiAgICAgIHJldHVybiBvZmZzZXRTY3JvbGwgPD0gdGhpcy5vZmZzZXRZID8gdmlld1BvcnRGaXJzdFJvd0luZGV4IC0gMSA6IHZpZXdQb3J0Rmlyc3RSb3dJbmRleDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmlld1BvcnRGaXJzdFJvd0luZGV4O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVG9nZ2xlIHRoZSBFeHBhbnNpb24gb2YgdGhlIHJvdyBpLmUuIGlmIHRoZSByb3cgaXMgZXhwYW5kZWQgdGhlbiBpdCB3aWxsXHJcbiAgICogY29sbGFwc2UgYW5kIHZpY2UgdmVyc2EuICAgTm90ZSB0aGF0IHRoZSBleHBhbmRlZCBzdGF0dXMgaXMgc3RvcmVkIGFzXHJcbiAgICogYSBwYXJ0IG9mIHRoZSByb3cgb2JqZWN0IGl0c2VsZiBhcyB3ZSBoYXZlIHRvIHByZXNlcnZlIHRoZSBleHBhbmRlZCByb3dcclxuICAgKiBzdGF0dXMgaW4gY2FzZSBvZiBzb3J0aW5nIGFuZCBmaWx0ZXJpbmcgb2YgdGhlIHJvdyBzZXQuXHJcbiAgICovXHJcbiAgdG9nZ2xlUm93RXhwYW5zaW9uKHJvdzogYW55KTogdm9pZCB7XHJcbiAgICAvLyBDYXB0dXJlIHRoZSByb3cgaW5kZXggb2YgdGhlIGZpcnN0IHJvdyB0aGF0IGlzIHZpc2libGUgb24gdGhlIHZpZXdwb3J0LlxyXG4gICAgY29uc3Qgdmlld1BvcnRGaXJzdFJvd0luZGV4ID0gdGhpcy5nZXRBZGp1c3RlZFZpZXdQb3J0SW5kZXgoKTtcclxuICAgIGNvbnN0IHJvd0V4cGFuZGVkSWR4ID0gdGhpcy5nZXRSb3dFeHBhbmRlZElkeChyb3csIHRoaXMucm93RXhwYW5zaW9ucyk7XHJcbiAgICBjb25zdCBleHBhbmRlZCA9IHJvd0V4cGFuZGVkSWR4ID4gLTE7XHJcblxyXG4gICAgLy8gSWYgdGhlIGRldGFpbFJvd0hlaWdodCBpcyBhdXRvIC0tPiBvbmx5IGluIGNhc2Ugb2Ygbm9uLXZpcnR1YWxpemVkIHNjcm9sbFxyXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyViAmJiB0aGlzLnZpcnR1YWxpemF0aW9uKSB7XHJcbiAgICAgIGNvbnN0IGRldGFpbFJvd0hlaWdodCA9IHRoaXMuZ2V0RGV0YWlsUm93SGVpZ2h0KHJvdykgKiAoZXhwYW5kZWQgPyAtMSA6IDEpO1xyXG4gICAgICAvLyBjb25zdCBpZHggPSB0aGlzLnJvd0luZGV4ZXMuZ2V0KHJvdykgfHwgMDtcclxuICAgICAgY29uc3QgaWR4ID0gdGhpcy5nZXRSb3dJbmRleChyb3cpO1xyXG4gICAgICB0aGlzLnJvd0hlaWdodHNDYWNoZS51cGRhdGUoaWR4LCBkZXRhaWxSb3dIZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFVwZGF0ZSB0aGUgdG9nZ2xlZCByb3cgYW5kIHVwZGF0ZSB0aGl2ZSBuZXZlcmUgaGVpZ2h0cyBpbiB0aGUgY2FjaGUuXHJcbiAgICBpZiAoZXhwYW5kZWQpIHtcclxuICAgICAgdGhpcy5yb3dFeHBhbnNpb25zLnNwbGljZShyb3dFeHBhbmRlZElkeCwgMSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnJvd0V4cGFuc2lvbnMucHVzaChyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGV0YWlsVG9nZ2xlLmVtaXQoe1xyXG4gICAgICByb3dzOiBbcm93XSxcclxuICAgICAgY3VycmVudEluZGV4OiB2aWV3UG9ydEZpcnN0Um93SW5kZXhcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXhwYW5kL0NvbGxhcHNlIGFsbCB0aGUgcm93cyBubyBtYXR0ZXIgd2hhdCB0aGVpciBzdGF0ZSBpcy5cclxuICAgKi9cclxuICB0b2dnbGVBbGxSb3dzKGV4cGFuZGVkOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAvLyBjbGVhciBwcmV2IGV4cGFuc2lvbnNcclxuICAgIHRoaXMucm93RXhwYW5zaW9ucyA9IFtdO1xyXG5cclxuICAgIC8vIENhcHR1cmUgdGhlIHJvdyBpbmRleCBvZiB0aGUgZmlyc3Qgcm93IHRoYXQgaXMgdmlzaWJsZSBvbiB0aGUgdmlld3BvcnQuXHJcbiAgICBjb25zdCB2aWV3UG9ydEZpcnN0Um93SW5kZXggPSB0aGlzLmdldEFkanVzdGVkVmlld1BvcnRJbmRleCgpO1xyXG5cclxuICAgIGlmIChleHBhbmRlZCkge1xyXG4gICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0aGlzLnJvd3MpIHtcclxuICAgICAgICB0aGlzLnJvd0V4cGFuc2lvbnMucHVzaChyb3cpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyVikge1xyXG4gICAgICAvLyBSZWZyZXNoIHRoZSBmdWxsIHJvdyBoZWlnaHRzIGNhY2hlIHNpbmNlIGV2ZXJ5IHJvdyB3YXMgYWZmZWN0ZWQuXHJcbiAgICAgIHRoaXMucmVjYWxjTGF5b3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRW1pdCBhbGwgcm93cyB0aGF0IGhhdmUgYmVlbiBleHBhbmRlZC5cclxuICAgIHRoaXMuZGV0YWlsVG9nZ2xlLmVtaXQoe1xyXG4gICAgICByb3dzOiB0aGlzLnJvd3MsXHJcbiAgICAgIGN1cnJlbnRJbmRleDogdmlld1BvcnRGaXJzdFJvd0luZGV4XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlY2FsY3VsYXRlcyB0aGUgdGFibGVcclxuICAgKi9cclxuICByZWNhbGNMYXlvdXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnJlZnJlc2hSb3dIZWlnaHRDYWNoZSgpO1xyXG4gICAgdGhpcy51cGRhdGVJbmRleGVzKCk7XHJcbiAgICB0aGlzLnVwZGF0ZVJvd3MoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYWNrcyB0aGUgY29sdW1uXHJcbiAgICovXHJcbiAgY29sdW1uVHJhY2tpbmdGbihpbmRleDogbnVtYmVyLCBjb2x1bW46IGFueSk6IGFueSB7XHJcbiAgICByZXR1cm4gY29sdW1uLiQkaWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSByb3cgcGlubmluZyBncm91cCBzdHlsZXNcclxuICAgKi9cclxuICBzdHlsZXNCeUdyb3VwKGdyb3VwOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHdpZHRocyA9IHRoaXMuY29sdW1uR3JvdXBXaWR0aHM7XHJcbiAgICBjb25zdCBvZmZzZXRYID0gdGhpcy5vZmZzZXRYO1xyXG5cclxuICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgd2lkdGg6IGAke3dpZHRoc1tncm91cF19cHhgXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChncm91cCA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgIHRyYW5zbGF0ZVhZKHN0eWxlcywgb2Zmc2V0WCwgMCk7XHJcbiAgICB9IGVsc2UgaWYgKGdyb3VwID09PSAncmlnaHQnKSB7XHJcbiAgICAgIGNvbnN0IGJvZHlXaWR0aCA9IHBhcnNlSW50KHRoaXMuaW5uZXJXaWR0aCArICcnLCAwKTtcclxuICAgICAgY29uc3QgdG90YWxEaWZmID0gd2lkdGhzLnRvdGFsIC0gYm9keVdpZHRoO1xyXG4gICAgICBjb25zdCBvZmZzZXREaWZmID0gdG90YWxEaWZmIC0gb2Zmc2V0WDtcclxuICAgICAgY29uc3Qgb2Zmc2V0ID0gKG9mZnNldERpZmYgKiAtMSkrMTc7XHJcbiAgICAgIHRyYW5zbGF0ZVhZKHN0eWxlcywgb2Zmc2V0LCAwKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3R5bGVzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBpZiB0aGUgcm93IHdhcyBleHBhbmRlZCBhbmQgc2V0IGRlZmF1bHQgcm93IGV4cGFuc2lvbiB3aGVuIHJvdyBleHBhbnNpb24gaXMgZW1wdHlcclxuICAgKi9cclxuICBnZXRSb3dFeHBhbmRlZChyb3c6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMucm93RXhwYW5zaW9ucy5sZW5ndGggPT09IDAgJiYgdGhpcy5ncm91cEV4cGFuc2lvbkRlZmF1bHQpIHtcclxuICAgICAgZm9yIChjb25zdCBncm91cCBvZiB0aGlzLmdyb3VwZWRSb3dzKSB7XHJcbiAgICAgICAgdGhpcy5yb3dFeHBhbnNpb25zLnB1c2goZ3JvdXApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2V0Um93RXhwYW5kZWRJZHgocm93LCB0aGlzLnJvd0V4cGFuc2lvbnMpID4gLTE7XHJcbiAgfVxyXG5cclxuICBnZXRSb3dFeHBhbmRlZElkeChyb3c6IGFueSwgZXhwYW5kZWQ6IGFueVtdKTogbnVtYmVyIHtcclxuICAgIGlmICghZXhwYW5kZWQgfHwgIWV4cGFuZGVkLmxlbmd0aCkgcmV0dXJuIC0xO1xyXG5cclxuICAgIGNvbnN0IHJvd0lkID0gdGhpcy5yb3dJZGVudGl0eShyb3cpO1xyXG4gICAgcmV0dXJuIGV4cGFuZGVkLmZpbmRJbmRleCgocikgPT4ge1xyXG4gICAgICBjb25zdCBpZCA9IHRoaXMucm93SWRlbnRpdHkocik7XHJcbiAgICAgIHJldHVybiBpZCA9PT0gcm93SWQ7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHJvdyBpbmRleCBnaXZlbiBhIHJvd1xyXG4gICAqL1xyXG4gIGdldFJvd0luZGV4KHJvdzogYW55KTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLnJvd0luZGV4ZXMuZ2V0KHJvdykgfHwgMDtcclxuICB9XHJcblxyXG4gIG9uVHJlZUFjdGlvbihyb3c6IGFueSkge1xyXG4gICAgdGhpcy50cmVlQWN0aW9uLmVtaXQoeyByb3cgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==