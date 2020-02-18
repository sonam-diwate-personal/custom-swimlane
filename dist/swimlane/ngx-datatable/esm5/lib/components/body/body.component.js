/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Output, EventEmitter, Input, HostBinding, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ScrollerComponent } from './scroller.component';
import { SelectionType } from '../../types/selection.type';
import { columnsByPin, columnGroupWidths } from '../../utils/column';
import { RowHeightCache } from '../../utils/row-height-cache';
import { translateXY } from '../../utils/translate';
var DataTableBodyComponent = /** @class */ (function () {
    /**
     * Creates an instance of DataTableBodyComponent.
     */
    function DataTableBodyComponent(cd) {
        var _this = this;
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
        function (row, index) {
            if (!_this.rowDetail) {
                return 0;
            }
            /** @type {?} */
            var rowHeight = _this.rowDetail.rowHeight;
            return typeof rowHeight === 'function' ? rowHeight(row, index) : ((/** @type {?} */ (rowHeight)));
        });
        // declare fn here so we can get access to the `this` property
        this.rowTrackingFn = (/**
         * @param {?} index
         * @param {?} row
         * @return {?}
         */
        function (index, row) {
            /** @type {?} */
            var idx = _this.getRowIndex(row);
            if (_this.trackByProp) {
                return row[_this.trackByProp];
            }
            else {
                return idx;
            }
        });
    }
    Object.defineProperty(DataTableBodyComponent.prototype, "pageSize", {
        get: /**
         * @return {?}
         */
        function () {
            return this._pageSize;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._pageSize = val;
            this.recalcLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "rows", {
        get: /**
         * @return {?}
         */
        function () {
            return this._rows;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._rows = val;
            this.recalcLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "columns", {
        get: /**
         * @return {?}
         */
        function () {
            return this._columns;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._columns = val;
            /** @type {?} */
            var colsByPin = columnsByPin(val);
            this.columnGroupWidths = columnGroupWidths(colsByPin, val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "offset", {
        get: /**
         * @return {?}
         */
        function () {
            return this._offset;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._offset = val;
            if (!this.scrollbarV || (this.scrollbarV && !this.virtualization))
                this.recalcLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "rowCount", {
        get: /**
         * @return {?}
         */
        function () {
            return this._rowCount;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._rowCount = val;
            this.recalcLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "bodyWidth", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.scrollbarH) {
                return this.innerWidth + 'px';
            }
            else {
                return '100%';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "bodyHeight", {
        get: /**
         * @return {?}
         */
        function () {
            return this._bodyHeight;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            if (this.scrollbarV) {
                this._bodyHeight = val + 'px';
            }
            else {
                this._bodyHeight = 'auto';
            }
            this.recalcLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "selectEnabled", {
        /**
         * Returns if selection is enabled.
         */
        get: /**
         * Returns if selection is enabled.
         * @return {?}
         */
        function () {
            return !!this.selectionType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyComponent.prototype, "scrollHeight", {
        /**
         * Property that would calculate the height of scroll bar
         * based on the row heights cache for virtual scroll and virtualization. Other scenarios
         * calculate scroll height automatically (as height will be undefined).
         */
        get: /**
         * Property that would calculate the height of scroll bar
         * based on the row heights cache for virtual scroll and virtualization. Other scenarios
         * calculate scroll height automatically (as height will be undefined).
         * @return {?}
         */
        function () {
            if (this.scrollbarV && this.virtualization && this.rowCount) {
                return this.rowHeightsCache.query(this.rowCount - 1);
            }
            // avoid TS7030: Not all code paths return a value.
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Called after the constructor, initializing input properties
     */
    /**
     * Called after the constructor, initializing input properties
     * @return {?}
     */
    DataTableBodyComponent.prototype.ngOnInit = /**
     * Called after the constructor, initializing input properties
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.rowDetail) {
            this.listener = this.rowDetail.toggle.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var type = _a.type, value = _a.value;
                if (type === 'row') {
                    _this.toggleRowExpansion(value);
                }
                if (type === 'all') {
                    _this.toggleAllRows(value);
                }
                // Refresh rows after toggle
                // Fixes #883
                _this.updateIndexes();
                _this.updateRows();
                _this.cd.markForCheck();
            }));
        }
        if (this.groupHeader) {
            this.listener = this.groupHeader.toggle.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var type = _a.type, value = _a.value;
                if (type === 'group') {
                    _this.toggleRowExpansion(value);
                }
                if (type === 'all') {
                    _this.toggleAllRows(value);
                }
                // Refresh rows after toggle
                // Fixes #883
                _this.updateIndexes();
                _this.updateRows();
                _this.cd.markForCheck();
            }));
        }
    };
    /**
     * Called once, before the instance is destroyed.
     */
    /**
     * Called once, before the instance is destroyed.
     * @return {?}
     */
    DataTableBodyComponent.prototype.ngOnDestroy = /**
     * Called once, before the instance is destroyed.
     * @return {?}
     */
    function () {
        if (this.rowDetail || this.groupHeader) {
            this.listener.unsubscribe();
        }
    };
    /**
     * Updates the Y offset given a new offset.
     */
    /**
     * Updates the Y offset given a new offset.
     * @param {?=} offset
     * @return {?}
     */
    DataTableBodyComponent.prototype.updateOffsetY = /**
     * Updates the Y offset given a new offset.
     * @param {?=} offset
     * @return {?}
     */
    function (offset) {
        // scroller is missing on empty table
        if (!this.scroller) {
            return;
        }
        if (this.scrollbarV && this.virtualization && offset) {
            // First get the row Index that we need to move to.
            /** @type {?} */
            var rowIndex = this.pageSize * offset;
            offset = this.rowHeightsCache.query(rowIndex - 1);
        }
        else if (this.scrollbarV && !this.virtualization) {
            offset = 0;
        }
        this.scroller.setOffset(offset || 0);
    };
    /**
     * Body was scrolled, this is mainly useful for
     * when a user is server-side pagination via virtual scroll.
     */
    /**
     * Body was scrolled, this is mainly useful for
     * when a user is server-side pagination via virtual scroll.
     * @param {?} event
     * @return {?}
     */
    DataTableBodyComponent.prototype.onBodyScroll = /**
     * Body was scrolled, this is mainly useful for
     * when a user is server-side pagination via virtual scroll.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var scrollYPos = event.scrollYPos;
        /** @type {?} */
        var scrollXPos = event.scrollXPos;
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
    };
    /**
     * Updates the page given a direction.
     */
    /**
     * Updates the page given a direction.
     * @param {?} direction
     * @return {?}
     */
    DataTableBodyComponent.prototype.updatePage = /**
     * Updates the page given a direction.
     * @param {?} direction
     * @return {?}
     */
    function (direction) {
        /** @type {?} */
        var offset = this.indexes.first / this.pageSize;
        if (direction === 'up') {
            offset = Math.ceil(offset);
        }
        else if (direction === 'down') {
            offset = Math.floor(offset);
        }
        if (direction !== undefined && !isNaN(offset)) {
            this.page.emit({ offset: offset });
        }
    };
    /**
     * Updates the rows in the view port
     */
    /**
     * Updates the rows in the view port
     * @return {?}
     */
    DataTableBodyComponent.prototype.updateRows = /**
     * Updates the rows in the view port
     * @return {?}
     */
    function () {
        var _a = this.indexes, first = _a.first, last = _a.last;
        /** @type {?} */
        var rowIndex = first;
        /** @type {?} */
        var idx = 0;
        /** @type {?} */
        var temp = [];
        this.rowIndexes.clear();
        // if grouprowsby has been specified treat row paging
        // parameters as group paging parameters ie if limit 10 has been
        // specified treat it as 10 groups rather than 10 rows
        if (this.groupedRows) {
            /** @type {?} */
            var maxRowsPerGroup = 3;
            // if there is only one group set the maximum number of
            // rows per group the same as the total number of rows
            if (this.groupedRows.length === 1) {
                maxRowsPerGroup = this.groupedRows[0].value.length;
            }
            while (rowIndex < last && rowIndex < this.groupedRows.length) {
                // Add the groups into this page
                /** @type {?} */
                var group = this.groupedRows[rowIndex];
                temp[idx] = group;
                idx++;
                // Group index in this context
                rowIndex++;
            }
        }
        else {
            while (rowIndex < last && rowIndex < this.rowCount) {
                /** @type {?} */
                var row = this.rows[rowIndex];
                if (row) {
                    this.rowIndexes.set(row, rowIndex);
                    temp[idx] = row;
                }
                idx++;
                rowIndex++;
            }
        }
        this.temp = temp;
    };
    /**
     * Get the row height
     */
    /**
     * Get the row height
     * @param {?} row
     * @return {?}
     */
    DataTableBodyComponent.prototype.getRowHeight = /**
     * Get the row height
     * @param {?} row
     * @return {?}
     */
    function (row) {
        // if its a function return it
        if (typeof this.rowHeight === 'function') {
            return this.rowHeight(row);
        }
        return (/** @type {?} */ (this.rowHeight));
    };
    /**
     * @param group the group with all rows
     */
    /**
     * @param {?} group the group with all rows
     * @return {?}
     */
    DataTableBodyComponent.prototype.getGroupHeight = /**
     * @param {?} group the group with all rows
     * @return {?}
     */
    function (group) {
        /** @type {?} */
        var rowHeight = 0;
        if (group.value) {
            for (var index = 0; index < group.value.length; index++) {
                rowHeight += this.getRowAndDetailHeight(group.value[index]);
            }
        }
        return rowHeight;
    };
    /**
     * Calculate row height based on the expanded state of the row.
     */
    /**
     * Calculate row height based on the expanded state of the row.
     * @param {?} row
     * @return {?}
     */
    DataTableBodyComponent.prototype.getRowAndDetailHeight = /**
     * Calculate row height based on the expanded state of the row.
     * @param {?} row
     * @return {?}
     */
    function (row) {
        /** @type {?} */
        var rowHeight = this.getRowHeight(row);
        /** @type {?} */
        var expanded = this.getRowExpanded(row);
        // Adding detail row height if its expanded.
        if (expanded) {
            rowHeight += this.getDetailRowHeight(row);
        }
        return rowHeight;
    };
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
     * @param rows the row that needs to be placed in the 2D space.
     * @returns the CSS3 style to be applied
     *
     * @memberOf DataTableBodyComponent
     */
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
    DataTableBodyComponent.prototype.getRowsStyles = /**
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
    function (rows) {
        /** @type {?} */
        var styles = {};
        // only add styles for the group if there is a group
        if (this.groupedRows) {
            styles.width = this.columnGroupWidths.total;
        }
        if (this.scrollbarV && this.virtualization) {
            /** @type {?} */
            var idx = 0;
            if (this.groupedRows) {
                // Get the latest row rowindex in a group
                /** @type {?} */
                var row = rows[rows.length - 1];
                idx = row ? this.getRowIndex(row) : 0;
            }
            else {
                idx = this.getRowIndex(rows);
            }
            // const pos = idx * rowHeight;
            // The position of this row would be the sum of all row heights
            // until the previous row position.
            /** @type {?} */
            var pos = this.rowHeightsCache.query(idx - 1);
            translateXY(styles, 0, pos);
        }
        return styles;
    };
    /**
     * Calculate bottom summary row offset for scrollbar mode.
     * For more information about cache and offset calculation
     * see description for `getRowsStyles` method
     *
     * @returns the CSS3 style to be applied
     *
     * @memberOf DataTableBodyComponent
     */
    /**
     * Calculate bottom summary row offset for scrollbar mode.
     * For more information about cache and offset calculation
     * see description for `getRowsStyles` method
     *
     * \@memberOf DataTableBodyComponent
     * @return {?} the CSS3 style to be applied
     *
     */
    DataTableBodyComponent.prototype.getBottomSummaryRowStyles = /**
     * Calculate bottom summary row offset for scrollbar mode.
     * For more information about cache and offset calculation
     * see description for `getRowsStyles` method
     *
     * \@memberOf DataTableBodyComponent
     * @return {?} the CSS3 style to be applied
     *
     */
    function () {
        if (!this.scrollbarV || !this.rows || !this.rows.length) {
            return null;
        }
        /** @type {?} */
        var styles = { position: 'absolute' };
        /** @type {?} */
        var pos = this.rowHeightsCache.query(this.rows.length - 1);
        translateXY(styles, 0, pos);
        return styles;
    };
    /**
     * Hides the loading indicator
     */
    /**
     * Hides the loading indicator
     * @return {?}
     */
    DataTableBodyComponent.prototype.hideIndicator = /**
     * Hides the loading indicator
     * @return {?}
     */
    function () {
        var _this = this;
        setTimeout((/**
         * @return {?}
         */
        function () { return (_this.loadingIndicator = false); }), 500);
    };
    /**
     * Updates the index of the rows in the viewport
     */
    /**
     * Updates the index of the rows in the viewport
     * @return {?}
     */
    DataTableBodyComponent.prototype.updateIndexes = /**
     * Updates the index of the rows in the viewport
     * @return {?}
     */
    function () {
        /** @type {?} */
        var first = 0;
        /** @type {?} */
        var last = 0;
        if (this.scrollbarV) {
            if (this.virtualization) {
                // Calculation of the first and last indexes will be based on where the
                // scrollY position would be at.  The last index would be the one
                // that shows up inside the view port the last.
                /** @type {?} */
                var height = parseInt(this.bodyHeight, 0);
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
        this.indexes = { first: first, last: last };
    };
    /**
     * Refreshes the full Row Height cache.  Should be used
     * when the entire row array state has changed.
     */
    /**
     * Refreshes the full Row Height cache.  Should be used
     * when the entire row array state has changed.
     * @return {?}
     */
    DataTableBodyComponent.prototype.refreshRowHeightCache = /**
     * Refreshes the full Row Height cache.  Should be used
     * when the entire row array state has changed.
     * @return {?}
     */
    function () {
        var e_1, _a;
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
            var rowExpansions = new Set();
            try {
                for (var _b = tslib_1.__values(this.rows), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var row = _c.value;
                    if (this.getRowExpanded(row)) {
                        rowExpansions.add(row);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.rowHeightsCache.initCache({
                rows: this.rows,
                rowHeight: this.rowHeight,
                detailRowHeight: this.getDetailRowHeight,
                externalVirtual: this.scrollbarV && this.externalPaging,
                rowCount: this.rowCount,
                rowIndexes: this.rowIndexes,
                rowExpansions: rowExpansions
            });
        }
    };
    /**
     * Gets the index for the view port
     */
    /**
     * Gets the index for the view port
     * @return {?}
     */
    DataTableBodyComponent.prototype.getAdjustedViewPortIndex = /**
     * Gets the index for the view port
     * @return {?}
     */
    function () {
        // Capture the row index of the first row that is visible on the viewport.
        // If the scroll bar is just below the row which is highlighted then make that as the
        // first index.
        /** @type {?} */
        var viewPortFirstRowIndex = this.indexes.first;
        if (this.scrollbarV && this.virtualization) {
            /** @type {?} */
            var offsetScroll = this.rowHeightsCache.query(viewPortFirstRowIndex - 1);
            return offsetScroll <= this.offsetY ? viewPortFirstRowIndex - 1 : viewPortFirstRowIndex;
        }
        return viewPortFirstRowIndex;
    };
    /**
     * Toggle the Expansion of the row i.e. if the row is expanded then it will
     * collapse and vice versa.   Note that the expanded status is stored as
     * a part of the row object itself as we have to preserve the expanded row
     * status in case of sorting and filtering of the row set.
     */
    /**
     * Toggle the Expansion of the row i.e. if the row is expanded then it will
     * collapse and vice versa.   Note that the expanded status is stored as
     * a part of the row object itself as we have to preserve the expanded row
     * status in case of sorting and filtering of the row set.
     * @param {?} row
     * @return {?}
     */
    DataTableBodyComponent.prototype.toggleRowExpansion = /**
     * Toggle the Expansion of the row i.e. if the row is expanded then it will
     * collapse and vice versa.   Note that the expanded status is stored as
     * a part of the row object itself as we have to preserve the expanded row
     * status in case of sorting and filtering of the row set.
     * @param {?} row
     * @return {?}
     */
    function (row) {
        // Capture the row index of the first row that is visible on the viewport.
        /** @type {?} */
        var viewPortFirstRowIndex = this.getAdjustedViewPortIndex();
        /** @type {?} */
        var rowExpandedIdx = this.getRowExpandedIdx(row, this.rowExpansions);
        /** @type {?} */
        var expanded = rowExpandedIdx > -1;
        // If the detailRowHeight is auto --> only in case of non-virtualized scroll
        if (this.scrollbarV && this.virtualization) {
            /** @type {?} */
            var detailRowHeight = this.getDetailRowHeight(row) * (expanded ? -1 : 1);
            // const idx = this.rowIndexes.get(row) || 0;
            /** @type {?} */
            var idx = this.getRowIndex(row);
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
    };
    /**
     * Expand/Collapse all the rows no matter what their state is.
     */
    /**
     * Expand/Collapse all the rows no matter what their state is.
     * @param {?} expanded
     * @return {?}
     */
    DataTableBodyComponent.prototype.toggleAllRows = /**
     * Expand/Collapse all the rows no matter what their state is.
     * @param {?} expanded
     * @return {?}
     */
    function (expanded) {
        var e_2, _a;
        // clear prev expansions
        this.rowExpansions = [];
        // Capture the row index of the first row that is visible on the viewport.
        /** @type {?} */
        var viewPortFirstRowIndex = this.getAdjustedViewPortIndex();
        if (expanded) {
            try {
                for (var _b = tslib_1.__values(this.rows), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var row = _c.value;
                    this.rowExpansions.push(row);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
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
    };
    /**
     * Recalculates the table
     */
    /**
     * Recalculates the table
     * @return {?}
     */
    DataTableBodyComponent.prototype.recalcLayout = /**
     * Recalculates the table
     * @return {?}
     */
    function () {
        this.refreshRowHeightCache();
        this.updateIndexes();
        this.updateRows();
    };
    /**
     * Tracks the column
     */
    /**
     * Tracks the column
     * @param {?} index
     * @param {?} column
     * @return {?}
     */
    DataTableBodyComponent.prototype.columnTrackingFn = /**
     * Tracks the column
     * @param {?} index
     * @param {?} column
     * @return {?}
     */
    function (index, column) {
        return column.$$id;
    };
    /**
     * Gets the row pinning group styles
     */
    /**
     * Gets the row pinning group styles
     * @param {?} group
     * @return {?}
     */
    DataTableBodyComponent.prototype.stylesByGroup = /**
     * Gets the row pinning group styles
     * @param {?} group
     * @return {?}
     */
    function (group) {
        /** @type {?} */
        var widths = this.columnGroupWidths;
        /** @type {?} */
        var offsetX = this.offsetX;
        /** @type {?} */
        var styles = {
            width: widths[group] + "px"
        };
        if (group === 'left') {
            translateXY(styles, offsetX, 0);
        }
        else if (group === 'right') {
            /** @type {?} */
            var bodyWidth = parseInt(this.innerWidth + '', 0);
            /** @type {?} */
            var totalDiff = widths.total - bodyWidth;
            /** @type {?} */
            var offsetDiff = totalDiff - offsetX;
            /** @type {?} */
            var offset = (offsetDiff * -1) + 17;
            translateXY(styles, offset, 0);
        }
        return styles;
    };
    /**
     * Returns if the row was expanded and set default row expansion when row expansion is empty
     */
    /**
     * Returns if the row was expanded and set default row expansion when row expansion is empty
     * @param {?} row
     * @return {?}
     */
    DataTableBodyComponent.prototype.getRowExpanded = /**
     * Returns if the row was expanded and set default row expansion when row expansion is empty
     * @param {?} row
     * @return {?}
     */
    function (row) {
        var e_3, _a;
        if (this.rowExpansions.length === 0 && this.groupExpansionDefault) {
            try {
                for (var _b = tslib_1.__values(this.groupedRows), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var group = _c.value;
                    this.rowExpansions.push(group);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return this.getRowExpandedIdx(row, this.rowExpansions) > -1;
    };
    /**
     * @param {?} row
     * @param {?} expanded
     * @return {?}
     */
    DataTableBodyComponent.prototype.getRowExpandedIdx = /**
     * @param {?} row
     * @param {?} expanded
     * @return {?}
     */
    function (row, expanded) {
        var _this = this;
        if (!expanded || !expanded.length)
            return -1;
        /** @type {?} */
        var rowId = this.rowIdentity(row);
        return expanded.findIndex((/**
         * @param {?} r
         * @return {?}
         */
        function (r) {
            /** @type {?} */
            var id = _this.rowIdentity(r);
            return id === rowId;
        }));
    };
    /**
     * Gets the row index given a row
     */
    /**
     * Gets the row index given a row
     * @param {?} row
     * @return {?}
     */
    DataTableBodyComponent.prototype.getRowIndex = /**
     * Gets the row index given a row
     * @param {?} row
     * @return {?}
     */
    function (row) {
        return this.rowIndexes.get(row) || 0;
    };
    /**
     * @param {?} row
     * @return {?}
     */
    DataTableBodyComponent.prototype.onTreeAction = /**
     * @param {?} row
     * @return {?}
     */
    function (row) {
        this.treeAction.emit({ row: row });
    };
    DataTableBodyComponent.decorators = [
        { type: Component, args: [{
                    selector: 'datatable-body',
                    template: "\n    <datatable-selection\n      #selector\n      [selected]=\"selected\"\n      [rows]=\"rows\"\n      [selectCheck]=\"selectCheck\"\n      [selectEnabled]=\"selectEnabled\"\n      [selectionType]=\"selectionType\"\n      [rowIdentity]=\"rowIdentity\"\n      (select)=\"select.emit($event)\"\n      (activate)=\"activate.emit($event)\"\n    >\n      <datatable-progress *ngIf=\"loadingIndicator\"> </datatable-progress>\n      <datatable-scroller\n        *ngIf=\"rows?.length\"\n        [scrollbarV]=\"scrollbarV\"\n        [scrollbarH]=\"scrollbarH\"\n        [scrollHeight]=\"scrollHeight\"\n        [scrollWidth]=\"columnGroupWidths?.total\"\n        (scroll)=\"onBodyScroll($event)\"\n      >\n        <datatable-summary-row\n          *ngIf=\"summaryRow && summaryPosition === 'top'\"\n          [rowHeight]=\"summaryHeight\"\n          [offsetX]=\"offsetX\"\n          [innerWidth]=\"innerWidth\"\n          [rows]=\"rows\"\n          [columns]=\"columns\"\n        >\n        </datatable-summary-row>\n        <datatable-row-wrapper\n          [groupedRows]=\"groupedRows\"\n          *ngFor=\"let group of temp; let i = index; trackBy: rowTrackingFn\"\n          [innerWidth]=\"innerWidth\"\n          [ngStyle]=\"getRowsStyles(group)\"\n          [rowDetail]=\"rowDetail\"\n          [groupHeader]=\"groupHeader\"\n          [offsetX]=\"offsetX\"\n          [detailRowHeight]=\"getDetailRowHeight(group[i], i)\"\n          [row]=\"group\"\n          [expanded]=\"getRowExpanded(group)\"\n          [rowIndex]=\"getRowIndex(group[i])\"\n          (rowContextmenu)=\"rowContextmenu.emit($event)\"\n        >\n          <datatable-body-row\n            *ngIf=\"!groupedRows; else groupedRowsTemplate\"\n            tabindex=\"-1\"\n            [isSelected]=\"selector.getRowSelected(group)\"\n            [innerWidth]=\"innerWidth\"\n            [offsetX]=\"offsetX\"\n            [columns]=\"columns\"\n            [rowHeight]=\"getRowHeight(group)\"\n            [row]=\"group\"\n            [rowIndex]=\"getRowIndex(group)\"\n            [expanded]=\"getRowExpanded(group)\"\n            [rowClass]=\"rowClass\"\n            [displayCheck]=\"displayCheck\"\n            [treeStatus]=\"group.treeStatus\"\n            (treeAction)=\"onTreeAction(group)\"\n            (activate)=\"selector.onActivate($event, indexes.first + i)\"\n          >\n          </datatable-body-row>\n          <ng-template #groupedRowsTemplate>\n            <datatable-body-row\n              *ngFor=\"let row of group.value; let i = index; trackBy: rowTrackingFn\"\n              tabindex=\"-1\"\n              [isSelected]=\"selector.getRowSelected(row)\"\n              [innerWidth]=\"innerWidth\"\n              [offsetX]=\"offsetX\"\n              [columns]=\"columns\"\n              [rowHeight]=\"getRowHeight(row)\"\n              [row]=\"row\"\n              [group]=\"group.value\"\n              [rowIndex]=\"getRowIndex(row)\"\n              [expanded]=\"getRowExpanded(row)\"\n              [rowClass]=\"rowClass\"\n              (activate)=\"selector.onActivate($event, i)\"\n            >\n            </datatable-body-row>\n          </ng-template>\n        </datatable-row-wrapper>\n        <datatable-summary-row\n          *ngIf=\"summaryRow && summaryPosition === 'bottom'\"\n          [ngStyle]=\"getBottomSummaryRowStyles()\"\n          [rowHeight]=\"summaryHeight\"\n          [offsetX]=\"offsetX\"\n          [innerWidth]=\"innerWidth\"\n          [rows]=\"rows\"\n          [columns]=\"columns\"\n        >\n        </datatable-summary-row>\n      </datatable-scroller>\n      <div class=\"empty-row\" *ngIf=\"!rows?.length && !loadingIndicator\" [innerHTML]=\"emptyMessage\"></div>\n    </datatable-selection>\n  ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        class: 'datatable-body'
                    }
                }] }
    ];
    /** @nocollapse */
    DataTableBodyComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
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
    return DataTableBodyComponent;
}());
export { DataTableBodyComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2JvZHkvYm9keS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixZQUFZLEVBQ1osS0FBSyxFQUNMLFdBQVcsRUFDWCxpQkFBaUIsRUFDakIsU0FBUyxFQUdULHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV6RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFcEQ7SUF3UEU7O09BRUc7SUFDSCxnQ0FBb0IsRUFBcUI7UUFBekMsaUJBVUM7UUFWbUIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUE1SWhDLGFBQVEsR0FBVSxFQUFFLENBQUM7UUF5RnBCLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMvQyxTQUFJLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0MsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMvQyxpQkFBWSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3JELG1CQUFjLEdBQUcsSUFBSSxZQUFZLENBQWtDLEtBQUssQ0FBQyxDQUFDO1FBQzFFLGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQXdCN0Qsb0JBQWUsR0FB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QUFrQjs7Ozs7SUE0TmxCLG9EQU1FOzs7OztJQTdOVSxvQ0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIElucHV0LFxyXG4gIEhvc3RCaW5kaW5nLFxyXG4gIENoYW5nZURldGVjdG9yUmVmLFxyXG4gIFZpZXdDaGlsZCxcclxuICBPbkluaXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFNjcm9sbGVyQ29tcG9uZW50IH0gZnJvbSAnLi9zY3JvbGxlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNb3VzZUV2ZW50IH0gZnJvbSAnLi4vLi4vZXZlbnRzJztcclxuaW1wb3J0IHsgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL3NlbGVjdGlvbi50eXBlJztcclxuaW1wb3J0IHsgY29sdW1uc0J5UGluLCBjb2x1bW5Hcm91cFdpZHRocyB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbHVtbic7XHJcbmltcG9ydCB7IFJvd0hlaWdodENhY2hlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcm93LWhlaWdodC1jYWNoZSc7XHJcbmltcG9ydCB7IHRyYW5zbGF0ZVhZIH0gZnJvbSAnLi4vLi4vdXRpbHMvdHJhbnNsYXRlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZGF0YXRhYmxlLWJvZHknLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGF0YXRhYmxlLXNlbGVjdGlvblxyXG4gICAgICAjc2VsZWN0b3JcclxuICAgICAgW3NlbGVjdGVkXT1cInNlbGVjdGVkXCJcclxuICAgICAgW3Jvd3NdPVwicm93c1wiXHJcbiAgICAgIFtzZWxlY3RDaGVja109XCJzZWxlY3RDaGVja1wiXHJcbiAgICAgIFtzZWxlY3RFbmFibGVkXT1cInNlbGVjdEVuYWJsZWRcIlxyXG4gICAgICBbc2VsZWN0aW9uVHlwZV09XCJzZWxlY3Rpb25UeXBlXCJcclxuICAgICAgW3Jvd0lkZW50aXR5XT1cInJvd0lkZW50aXR5XCJcclxuICAgICAgKHNlbGVjdCk9XCJzZWxlY3QuZW1pdCgkZXZlbnQpXCJcclxuICAgICAgKGFjdGl2YXRlKT1cImFjdGl2YXRlLmVtaXQoJGV2ZW50KVwiXHJcbiAgICA+XHJcbiAgICAgIDxkYXRhdGFibGUtcHJvZ3Jlc3MgKm5nSWY9XCJsb2FkaW5nSW5kaWNhdG9yXCI+IDwvZGF0YXRhYmxlLXByb2dyZXNzPlxyXG4gICAgICA8ZGF0YXRhYmxlLXNjcm9sbGVyXHJcbiAgICAgICAgKm5nSWY9XCJyb3dzPy5sZW5ndGhcIlxyXG4gICAgICAgIFtzY3JvbGxiYXJWXT1cInNjcm9sbGJhclZcIlxyXG4gICAgICAgIFtzY3JvbGxiYXJIXT1cInNjcm9sbGJhckhcIlxyXG4gICAgICAgIFtzY3JvbGxIZWlnaHRdPVwic2Nyb2xsSGVpZ2h0XCJcclxuICAgICAgICBbc2Nyb2xsV2lkdGhdPVwiY29sdW1uR3JvdXBXaWR0aHM/LnRvdGFsXCJcclxuICAgICAgICAoc2Nyb2xsKT1cIm9uQm9keVNjcm9sbCgkZXZlbnQpXCJcclxuICAgICAgPlxyXG4gICAgICAgIDxkYXRhdGFibGUtc3VtbWFyeS1yb3dcclxuICAgICAgICAgICpuZ0lmPVwic3VtbWFyeVJvdyAmJiBzdW1tYXJ5UG9zaXRpb24gPT09ICd0b3AnXCJcclxuICAgICAgICAgIFtyb3dIZWlnaHRdPVwic3VtbWFyeUhlaWdodFwiXHJcbiAgICAgICAgICBbb2Zmc2V0WF09XCJvZmZzZXRYXCJcclxuICAgICAgICAgIFtpbm5lcldpZHRoXT1cImlubmVyV2lkdGhcIlxyXG4gICAgICAgICAgW3Jvd3NdPVwicm93c1wiXHJcbiAgICAgICAgICBbY29sdW1uc109XCJjb2x1bW5zXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgPC9kYXRhdGFibGUtc3VtbWFyeS1yb3c+XHJcbiAgICAgICAgPGRhdGF0YWJsZS1yb3ctd3JhcHBlclxyXG4gICAgICAgICAgW2dyb3VwZWRSb3dzXT1cImdyb3VwZWRSb3dzXCJcclxuICAgICAgICAgICpuZ0Zvcj1cImxldCBncm91cCBvZiB0ZW1wOyBsZXQgaSA9IGluZGV4OyB0cmFja0J5OiByb3dUcmFja2luZ0ZuXCJcclxuICAgICAgICAgIFtpbm5lcldpZHRoXT1cImlubmVyV2lkdGhcIlxyXG4gICAgICAgICAgW25nU3R5bGVdPVwiZ2V0Um93c1N0eWxlcyhncm91cClcIlxyXG4gICAgICAgICAgW3Jvd0RldGFpbF09XCJyb3dEZXRhaWxcIlxyXG4gICAgICAgICAgW2dyb3VwSGVhZGVyXT1cImdyb3VwSGVhZGVyXCJcclxuICAgICAgICAgIFtvZmZzZXRYXT1cIm9mZnNldFhcIlxyXG4gICAgICAgICAgW2RldGFpbFJvd0hlaWdodF09XCJnZXREZXRhaWxSb3dIZWlnaHQoZ3JvdXBbaV0sIGkpXCJcclxuICAgICAgICAgIFtyb3ddPVwiZ3JvdXBcIlxyXG4gICAgICAgICAgW2V4cGFuZGVkXT1cImdldFJvd0V4cGFuZGVkKGdyb3VwKVwiXHJcbiAgICAgICAgICBbcm93SW5kZXhdPVwiZ2V0Um93SW5kZXgoZ3JvdXBbaV0pXCJcclxuICAgICAgICAgIChyb3dDb250ZXh0bWVudSk9XCJyb3dDb250ZXh0bWVudS5lbWl0KCRldmVudClcIlxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxkYXRhdGFibGUtYm9keS1yb3dcclxuICAgICAgICAgICAgKm5nSWY9XCIhZ3JvdXBlZFJvd3M7IGVsc2UgZ3JvdXBlZFJvd3NUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxyXG4gICAgICAgICAgICBbaXNTZWxlY3RlZF09XCJzZWxlY3Rvci5nZXRSb3dTZWxlY3RlZChncm91cClcIlxyXG4gICAgICAgICAgICBbaW5uZXJXaWR0aF09XCJpbm5lcldpZHRoXCJcclxuICAgICAgICAgICAgW29mZnNldFhdPVwib2Zmc2V0WFwiXHJcbiAgICAgICAgICAgIFtjb2x1bW5zXT1cImNvbHVtbnNcIlxyXG4gICAgICAgICAgICBbcm93SGVpZ2h0XT1cImdldFJvd0hlaWdodChncm91cClcIlxyXG4gICAgICAgICAgICBbcm93XT1cImdyb3VwXCJcclxuICAgICAgICAgICAgW3Jvd0luZGV4XT1cImdldFJvd0luZGV4KGdyb3VwKVwiXHJcbiAgICAgICAgICAgIFtleHBhbmRlZF09XCJnZXRSb3dFeHBhbmRlZChncm91cClcIlxyXG4gICAgICAgICAgICBbcm93Q2xhc3NdPVwicm93Q2xhc3NcIlxyXG4gICAgICAgICAgICBbZGlzcGxheUNoZWNrXT1cImRpc3BsYXlDaGVja1wiXHJcbiAgICAgICAgICAgIFt0cmVlU3RhdHVzXT1cImdyb3VwLnRyZWVTdGF0dXNcIlxyXG4gICAgICAgICAgICAodHJlZUFjdGlvbik9XCJvblRyZWVBY3Rpb24oZ3JvdXApXCJcclxuICAgICAgICAgICAgKGFjdGl2YXRlKT1cInNlbGVjdG9yLm9uQWN0aXZhdGUoJGV2ZW50LCBpbmRleGVzLmZpcnN0ICsgaSlcIlxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgPC9kYXRhdGFibGUtYm9keS1yb3c+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgI2dyb3VwZWRSb3dzVGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDxkYXRhdGFibGUtYm9keS1yb3dcclxuICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgcm93IG9mIGdyb3VwLnZhbHVlOyBsZXQgaSA9IGluZGV4OyB0cmFja0J5OiByb3dUcmFja2luZ0ZuXCJcclxuICAgICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcclxuICAgICAgICAgICAgICBbaXNTZWxlY3RlZF09XCJzZWxlY3Rvci5nZXRSb3dTZWxlY3RlZChyb3cpXCJcclxuICAgICAgICAgICAgICBbaW5uZXJXaWR0aF09XCJpbm5lcldpZHRoXCJcclxuICAgICAgICAgICAgICBbb2Zmc2V0WF09XCJvZmZzZXRYXCJcclxuICAgICAgICAgICAgICBbY29sdW1uc109XCJjb2x1bW5zXCJcclxuICAgICAgICAgICAgICBbcm93SGVpZ2h0XT1cImdldFJvd0hlaWdodChyb3cpXCJcclxuICAgICAgICAgICAgICBbcm93XT1cInJvd1wiXHJcbiAgICAgICAgICAgICAgW2dyb3VwXT1cImdyb3VwLnZhbHVlXCJcclxuICAgICAgICAgICAgICBbcm93SW5kZXhdPVwiZ2V0Um93SW5kZXgocm93KVwiXHJcbiAgICAgICAgICAgICAgW2V4cGFuZGVkXT1cImdldFJvd0V4cGFuZGVkKHJvdylcIlxyXG4gICAgICAgICAgICAgIFtyb3dDbGFzc109XCJyb3dDbGFzc1wiXHJcbiAgICAgICAgICAgICAgKGFjdGl2YXRlKT1cInNlbGVjdG9yLm9uQWN0aXZhdGUoJGV2ZW50LCBpKVwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgPC9kYXRhdGFibGUtYm9keS1yb3c+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDwvZGF0YXRhYmxlLXJvdy13cmFwcGVyPlxyXG4gICAgICAgIDxkYXRhdGFibGUtc3VtbWFyeS1yb3dcclxuICAgICAgICAgICpuZ0lmPVwic3VtbWFyeVJvdyAmJiBzdW1tYXJ5UG9zaXRpb24gPT09ICdib3R0b20nXCJcclxuICAgICAgICAgIFtuZ1N0eWxlXT1cImdldEJvdHRvbVN1bW1hcnlSb3dTdHlsZXMoKVwiXHJcbiAgICAgICAgICBbcm93SGVpZ2h0XT1cInN1bW1hcnlIZWlnaHRcIlxyXG4gICAgICAgICAgW29mZnNldFhdPVwib2Zmc2V0WFwiXHJcbiAgICAgICAgICBbaW5uZXJXaWR0aF09XCJpbm5lcldpZHRoXCJcclxuICAgICAgICAgIFtyb3dzXT1cInJvd3NcIlxyXG4gICAgICAgICAgW2NvbHVtbnNdPVwiY29sdW1uc1wiXHJcbiAgICAgICAgPlxyXG4gICAgICAgIDwvZGF0YXRhYmxlLXN1bW1hcnktcm93PlxyXG4gICAgICA8L2RhdGF0YWJsZS1zY3JvbGxlcj5cclxuICAgICAgPGRpdiBjbGFzcz1cImVtcHR5LXJvd1wiICpuZ0lmPVwiIXJvd3M/Lmxlbmd0aCAmJiAhbG9hZGluZ0luZGljYXRvclwiIFtpbm5lckhUTUxdPVwiZW1wdHlNZXNzYWdlXCI+PC9kaXY+XHJcbiAgICA8L2RhdGF0YWJsZS1zZWxlY3Rpb24+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICBob3N0OiB7XHJcbiAgICBjbGFzczogJ2RhdGF0YWJsZS1ib2R5J1xyXG4gIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGFUYWJsZUJvZHlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAgQElucHV0KCkgc2Nyb2xsYmFyVjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBzY3JvbGxiYXJIOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGxvYWRpbmdJbmRpY2F0b3I6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgZXh0ZXJuYWxQYWdpbmc6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcm93SGVpZ2h0OiBudW1iZXIgfCAnYXV0bycgfCAoKHJvdz86IGFueSkgPT4gbnVtYmVyKTtcclxuICBASW5wdXQoKSBvZmZzZXRYOiBudW1iZXI7XHJcbiAgQElucHV0KCkgZW1wdHlNZXNzYWdlOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZTtcclxuICBASW5wdXQoKSBzZWxlY3RlZDogYW55W10gPSBbXTtcclxuICBASW5wdXQoKSByb3dJZGVudGl0eTogYW55O1xyXG4gIEBJbnB1dCgpIHJvd0RldGFpbDogYW55O1xyXG4gIEBJbnB1dCgpIGdyb3VwSGVhZGVyOiBhbnk7XHJcbiAgQElucHV0KCkgc2VsZWN0Q2hlY2s6IGFueTtcclxuICBASW5wdXQoKSBkaXNwbGF5Q2hlY2s6IGFueTtcclxuICBASW5wdXQoKSB0cmFja0J5UHJvcDogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHJvd0NsYXNzOiBhbnk7XHJcbiAgQElucHV0KCkgZ3JvdXBlZFJvd3M6IGFueTtcclxuICBASW5wdXQoKSBncm91cEV4cGFuc2lvbkRlZmF1bHQ6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgaW5uZXJXaWR0aDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIGdyb3VwUm93c0J5OiBzdHJpbmc7XHJcbiAgQElucHV0KCkgdmlydHVhbGl6YXRpb246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgc3VtbWFyeVJvdzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBzdW1tYXJ5UG9zaXRpb246IHN0cmluZztcclxuICBASW5wdXQoKSBzdW1tYXJ5SGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dCgpIHNldCBwYWdlU2l6ZSh2YWw6IG51bWJlcikge1xyXG4gICAgdGhpcy5fcGFnZVNpemUgPSB2YWw7XHJcbiAgICB0aGlzLnJlY2FsY0xheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHBhZ2VTaXplKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcGFnZVNpemU7XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKSBzZXQgcm93cyh2YWw6IGFueVtdKSB7XHJcbiAgICB0aGlzLl9yb3dzID0gdmFsO1xyXG4gICAgdGhpcy5yZWNhbGNMYXlvdXQoKTtcclxuICB9XHJcblxyXG4gIGdldCByb3dzKCk6IGFueVtdIHtcclxuICAgIHJldHVybiB0aGlzLl9yb3dzO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KCkgc2V0IGNvbHVtbnModmFsOiBhbnlbXSkge1xyXG4gICAgdGhpcy5fY29sdW1ucyA9IHZhbDtcclxuICAgIGNvbnN0IGNvbHNCeVBpbiA9IGNvbHVtbnNCeVBpbih2YWwpO1xyXG4gICAgdGhpcy5jb2x1bW5Hcm91cFdpZHRocyA9IGNvbHVtbkdyb3VwV2lkdGhzKGNvbHNCeVBpbiwgdmFsKTtcclxuICB9XHJcblxyXG4gIGdldCBjb2x1bW5zKCk6IGFueVtdIHtcclxuICAgIHJldHVybiB0aGlzLl9jb2x1bW5zO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KCkgc2V0IG9mZnNldCh2YWw6IG51bWJlcikge1xyXG4gICAgdGhpcy5fb2Zmc2V0ID0gdmFsO1xyXG4gICAgaWYgKCF0aGlzLnNjcm9sbGJhclYgfHwgKHRoaXMuc2Nyb2xsYmFyViAmJiAhdGhpcy52aXJ0dWFsaXphdGlvbikpXHJcbiAgICAgIHRoaXMucmVjYWxjTGF5b3V0KCk7XHJcbiAgfVxyXG5cclxuICBnZXQgb2Zmc2V0KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xyXG4gIH1cclxuXHJcbiAgQElucHV0KCkgc2V0IHJvd0NvdW50KHZhbDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLl9yb3dDb3VudCA9IHZhbDtcclxuICAgIHRoaXMucmVjYWxjTGF5b3V0KCk7XHJcbiAgfVxyXG5cclxuICBnZXQgcm93Q291bnQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9yb3dDb3VudDtcclxuICB9XHJcblxyXG4gIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgnKVxyXG4gIGdldCBib2R5V2lkdGgoKTogc3RyaW5nIHtcclxuICAgIGlmICh0aGlzLnNjcm9sbGJhckgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5uZXJXaWR0aCArICdweCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gJzEwMCUnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQElucHV0KClcclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmhlaWdodCcpXHJcbiAgc2V0IGJvZHlIZWlnaHQodmFsKSB7XHJcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWKSB7XHJcbiAgICAgIHRoaXMuX2JvZHlIZWlnaHQgPSB2YWwgKyAncHgnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fYm9keUhlaWdodCA9ICdhdXRvJztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlY2FsY0xheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGJvZHlIZWlnaHQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fYm9keUhlaWdodDtcclxuICB9XHJcblxyXG4gIEBPdXRwdXQoKSBzY3JvbGw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBwYWdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBzZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBkZXRhaWxUb2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSByb3dDb250ZXh0bWVudSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogTW91c2VFdmVudDsgcm93OiBhbnkgfT4oZmFsc2UpO1xyXG4gIEBPdXRwdXQoKSB0cmVlQWN0aW9uOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQFZpZXdDaGlsZChTY3JvbGxlckNvbXBvbmVudCwgeyBzdGF0aWM6IGZhbHNlIH0pIHNjcm9sbGVyOiBTY3JvbGxlckNvbXBvbmVudDtcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBpZiBzZWxlY3Rpb24gaXMgZW5hYmxlZC5cclxuICAgKi9cclxuICBnZXQgc2VsZWN0RW5hYmxlZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAhIXRoaXMuc2VsZWN0aW9uVHlwZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFByb3BlcnR5IHRoYXQgd291bGQgY2FsY3VsYXRlIHRoZSBoZWlnaHQgb2Ygc2Nyb2xsIGJhclxyXG4gICAqIGJhc2VkIG9uIHRoZSByb3cgaGVpZ2h0cyBjYWNoZSBmb3IgdmlydHVhbCBzY3JvbGwgYW5kIHZpcnR1YWxpemF0aW9uLiBPdGhlciBzY2VuYXJpb3NcclxuICAgKiBjYWxjdWxhdGUgc2Nyb2xsIGhlaWdodCBhdXRvbWF0aWNhbGx5IChhcyBoZWlnaHQgd2lsbCBiZSB1bmRlZmluZWQpLlxyXG4gICAqL1xyXG4gIGdldCBzY3JvbGxIZWlnaHQoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcclxuICAgIGlmICh0aGlzLnNjcm9sbGJhclYgJiYgdGhpcy52aXJ0dWFsaXphdGlvbiAmJiB0aGlzLnJvd0NvdW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJvd0hlaWdodHNDYWNoZS5xdWVyeSh0aGlzLnJvd0NvdW50IC0gMSk7XHJcbiAgICB9XHJcbiAgICAvLyBhdm9pZCBUUzcwMzA6IE5vdCBhbGwgY29kZSBwYXRocyByZXR1cm4gYSB2YWx1ZS5cclxuICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICByb3dIZWlnaHRzQ2FjaGU6IFJvd0hlaWdodENhY2hlID0gbmV3IFJvd0hlaWdodENhY2hlKCk7XHJcbiAgdGVtcDogYW55W10gPSBbXTtcclxuICBvZmZzZXRZID0gMDtcclxuICBpbmRleGVzOiBhbnkgPSB7fTtcclxuICBjb2x1bW5Hcm91cFdpZHRoczogYW55O1xyXG4gIGNvbHVtbkdyb3VwV2lkdGhzV2l0aG91dEdyb3VwOiBhbnk7XHJcbiAgcm93VHJhY2tpbmdGbjogYW55O1xyXG4gIGxpc3RlbmVyOiBhbnk7XHJcbiAgcm93SW5kZXhlczogYW55ID0gbmV3IE1hcCgpO1xyXG4gIHJvd0V4cGFuc2lvbnM6IGFueVtdID0gW107XHJcblxyXG4gIF9yb3dzOiBhbnlbXTtcclxuICBfYm9keUhlaWdodDogYW55O1xyXG4gIF9jb2x1bW5zOiBhbnlbXTtcclxuICBfcm93Q291bnQ6IG51bWJlcjtcclxuICBfb2Zmc2V0OiBudW1iZXI7XHJcbiAgX3BhZ2VTaXplOiBudW1iZXI7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgRGF0YVRhYmxlQm9keUNvbXBvbmVudC5cclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xyXG4gICAgLy8gZGVjbGFyZSBmbiBoZXJlIHNvIHdlIGNhbiBnZXQgYWNjZXNzIHRvIHRoZSBgdGhpc2AgcHJvcGVydHlcclxuICAgIHRoaXMucm93VHJhY2tpbmdGbiA9IChpbmRleDogbnVtYmVyLCByb3c6IGFueSk6IGFueSA9PiB7XHJcbiAgICAgIGNvbnN0IGlkeCA9IHRoaXMuZ2V0Um93SW5kZXgocm93KTtcclxuICAgICAgaWYgKHRoaXMudHJhY2tCeVByb3ApIHtcclxuICAgICAgICByZXR1cm4gcm93W3RoaXMudHJhY2tCeVByb3BdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBpZHg7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIGNvbnN0cnVjdG9yLCBpbml0aWFsaXppbmcgaW5wdXQgcHJvcGVydGllc1xyXG4gICAqL1xyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMucm93RGV0YWlsKSB7XHJcbiAgICAgIHRoaXMubGlzdGVuZXIgPSB0aGlzLnJvd0RldGFpbC50b2dnbGUuc3Vic2NyaWJlKCh7IHR5cGUsIHZhbHVlIH06IHsgdHlwZTogc3RyaW5nOyB2YWx1ZTogYW55IH0pID0+IHtcclxuICAgICAgICBpZiAodHlwZSA9PT0gJ3JvdycpIHtcclxuICAgICAgICAgIHRoaXMudG9nZ2xlUm93RXhwYW5zaW9uKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdhbGwnKSB7XHJcbiAgICAgICAgICB0aGlzLnRvZ2dsZUFsbFJvd3ModmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVmcmVzaCByb3dzIGFmdGVyIHRvZ2dsZVxyXG4gICAgICAgIC8vIEZpeGVzICM4ODNcclxuICAgICAgICB0aGlzLnVwZGF0ZUluZGV4ZXMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJvd3MoKTtcclxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ncm91cEhlYWRlcikge1xyXG4gICAgICB0aGlzLmxpc3RlbmVyID0gdGhpcy5ncm91cEhlYWRlci50b2dnbGUuc3Vic2NyaWJlKCh7IHR5cGUsIHZhbHVlIH06IHsgdHlwZTogc3RyaW5nOyB2YWx1ZTogYW55IH0pID0+IHtcclxuICAgICAgICBpZiAodHlwZSA9PT0gJ2dyb3VwJykge1xyXG4gICAgICAgICAgdGhpcy50b2dnbGVSb3dFeHBhbnNpb24odmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSA9PT0gJ2FsbCcpIHtcclxuICAgICAgICAgIHRoaXMudG9nZ2xlQWxsUm93cyh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZWZyZXNoIHJvd3MgYWZ0ZXIgdG9nZ2xlXHJcbiAgICAgICAgLy8gRml4ZXMgIzg4M1xyXG4gICAgICAgIHRoaXMudXBkYXRlSW5kZXhlcygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUm93cygpO1xyXG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIG9uY2UsIGJlZm9yZSB0aGUgaW5zdGFuY2UgaXMgZGVzdHJveWVkLlxyXG4gICAqL1xyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMucm93RGV0YWlsIHx8IHRoaXMuZ3JvdXBIZWFkZXIpIHtcclxuICAgICAgdGhpcy5saXN0ZW5lci51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlcyB0aGUgWSBvZmZzZXQgZ2l2ZW4gYSBuZXcgb2Zmc2V0LlxyXG4gICAqL1xyXG4gIHVwZGF0ZU9mZnNldFkob2Zmc2V0PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAvLyBzY3JvbGxlciBpcyBtaXNzaW5nIG9uIGVtcHR5IHRhYmxlXHJcbiAgICBpZiAoIXRoaXMuc2Nyb2xsZXIpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNjcm9sbGJhclYgJiYgdGhpcy52aXJ0dWFsaXphdGlvbiAmJiBvZmZzZXQpIHtcclxuICAgICAgLy8gRmlyc3QgZ2V0IHRoZSByb3cgSW5kZXggdGhhdCB3ZSBuZWVkIHRvIG1vdmUgdG8uXHJcbiAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5wYWdlU2l6ZSAqIG9mZnNldDtcclxuICAgICAgb2Zmc2V0ID0gdGhpcy5yb3dIZWlnaHRzQ2FjaGUucXVlcnkocm93SW5kZXggLSAxKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zY3JvbGxiYXJWICYmICF0aGlzLnZpcnR1YWxpemF0aW9uKSB7XHJcbiAgICAgIG9mZnNldCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zY3JvbGxlci5zZXRPZmZzZXQob2Zmc2V0IHx8IDApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQm9keSB3YXMgc2Nyb2xsZWQsIHRoaXMgaXMgbWFpbmx5IHVzZWZ1bCBmb3JcclxuICAgKiB3aGVuIGEgdXNlciBpcyBzZXJ2ZXItc2lkZSBwYWdpbmF0aW9uIHZpYSB2aXJ0dWFsIHNjcm9sbC5cclxuICAgKi9cclxuICBvbkJvZHlTY3JvbGwoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgY29uc3Qgc2Nyb2xsWVBvczogbnVtYmVyID0gZXZlbnQuc2Nyb2xsWVBvcztcclxuICAgIGNvbnN0IHNjcm9sbFhQb3M6IG51bWJlciA9IGV2ZW50LnNjcm9sbFhQb3M7XHJcblxyXG4gICAgLy8gaWYgc2Nyb2xsIGNoYW5nZSwgdHJpZ2dlciB1cGRhdGVcclxuICAgIC8vIHRoaXMgaXMgbWFpbmx5IHVzZWQgZm9yIGhlYWRlciBjZWxsIHBvc2l0aW9uc1xyXG4gICAgaWYgKHRoaXMub2Zmc2V0WSAhPT0gc2Nyb2xsWVBvcyB8fCB0aGlzLm9mZnNldFggIT09IHNjcm9sbFhQb3MpIHtcclxuICAgICAgdGhpcy5zY3JvbGwuZW1pdCh7XHJcbiAgICAgICAgb2Zmc2V0WTogc2Nyb2xsWVBvcyxcclxuICAgICAgICBvZmZzZXRYOiBzY3JvbGxYUG9zXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub2Zmc2V0WSA9IHNjcm9sbFlQb3M7XHJcbiAgICB0aGlzLm9mZnNldFggPSBzY3JvbGxYUG9zO1xyXG5cclxuICAgIHRoaXMudXBkYXRlSW5kZXhlcygpO1xyXG4gICAgdGhpcy51cGRhdGVQYWdlKGV2ZW50LmRpcmVjdGlvbik7XHJcbiAgICB0aGlzLnVwZGF0ZVJvd3MoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZXMgdGhlIHBhZ2UgZ2l2ZW4gYSBkaXJlY3Rpb24uXHJcbiAgICovXHJcbiAgdXBkYXRlUGFnZShkaXJlY3Rpb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgbGV0IG9mZnNldCA9IHRoaXMuaW5kZXhlcy5maXJzdCAvIHRoaXMucGFnZVNpemU7XHJcblxyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwJykge1xyXG4gICAgICBvZmZzZXQgPSBNYXRoLmNlaWwob2Zmc2V0KTtcclxuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcclxuICAgICAgb2Zmc2V0ID0gTWF0aC5mbG9vcihvZmZzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkaXJlY3Rpb24gIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4ob2Zmc2V0KSkge1xyXG4gICAgICB0aGlzLnBhZ2UuZW1pdCh7IG9mZnNldCB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZXMgdGhlIHJvd3MgaW4gdGhlIHZpZXcgcG9ydFxyXG4gICAqL1xyXG4gIHVwZGF0ZVJvd3MoKTogdm9pZCB7XHJcbiAgICBjb25zdCB7IGZpcnN0LCBsYXN0IH0gPSB0aGlzLmluZGV4ZXM7XHJcbiAgICBsZXQgcm93SW5kZXggPSBmaXJzdDtcclxuICAgIGxldCBpZHggPSAwO1xyXG4gICAgY29uc3QgdGVtcDogYW55W10gPSBbXTtcclxuXHJcbiAgICB0aGlzLnJvd0luZGV4ZXMuY2xlYXIoKTtcclxuXHJcbiAgICAvLyBpZiBncm91cHJvd3NieSBoYXMgYmVlbiBzcGVjaWZpZWQgdHJlYXQgcm93IHBhZ2luZ1xyXG4gICAgLy8gcGFyYW1ldGVycyBhcyBncm91cCBwYWdpbmcgcGFyYW1ldGVycyBpZSBpZiBsaW1pdCAxMCBoYXMgYmVlblxyXG4gICAgLy8gc3BlY2lmaWVkIHRyZWF0IGl0IGFzIDEwIGdyb3VwcyByYXRoZXIgdGhhbiAxMCByb3dzXHJcbiAgICBpZiAodGhpcy5ncm91cGVkUm93cykge1xyXG4gICAgICBsZXQgbWF4Um93c1Blckdyb3VwID0gMztcclxuICAgICAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUgZ3JvdXAgc2V0IHRoZSBtYXhpbXVtIG51bWJlciBvZlxyXG4gICAgICAvLyByb3dzIHBlciBncm91cCB0aGUgc2FtZSBhcyB0aGUgdG90YWwgbnVtYmVyIG9mIHJvd3NcclxuICAgICAgaWYgKHRoaXMuZ3JvdXBlZFJvd3MubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgbWF4Um93c1Blckdyb3VwID0gdGhpcy5ncm91cGVkUm93c1swXS52YWx1ZS5sZW5ndGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChyb3dJbmRleCA8IGxhc3QgJiYgcm93SW5kZXggPCB0aGlzLmdyb3VwZWRSb3dzLmxlbmd0aCkge1xyXG4gICAgICAgIC8vIEFkZCB0aGUgZ3JvdXBzIGludG8gdGhpcyBwYWdlXHJcbiAgICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmdyb3VwZWRSb3dzW3Jvd0luZGV4XTtcclxuICAgICAgICB0ZW1wW2lkeF0gPSBncm91cDtcclxuICAgICAgICBpZHgrKztcclxuXHJcbiAgICAgICAgLy8gR3JvdXAgaW5kZXggaW4gdGhpcyBjb250ZXh0XHJcbiAgICAgICAgcm93SW5kZXgrKztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd2hpbGUgKHJvd0luZGV4IDwgbGFzdCAmJiByb3dJbmRleCA8IHRoaXMucm93Q291bnQpIHtcclxuICAgICAgICBjb25zdCByb3cgPSB0aGlzLnJvd3Nbcm93SW5kZXhdO1xyXG5cclxuICAgICAgICBpZiAocm93KSB7XHJcbiAgICAgICAgICB0aGlzLnJvd0luZGV4ZXMuc2V0KHJvdywgcm93SW5kZXgpO1xyXG4gICAgICAgICAgdGVtcFtpZHhdID0gcm93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWR4Kys7XHJcbiAgICAgICAgcm93SW5kZXgrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudGVtcCA9IHRlbXA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIHJvdyBoZWlnaHRcclxuICAgKi9cclxuICBnZXRSb3dIZWlnaHQocm93OiBhbnkpOiBudW1iZXIge1xyXG4gICAgLy8gaWYgaXRzIGEgZnVuY3Rpb24gcmV0dXJuIGl0XHJcbiAgICBpZiAodHlwZW9mIHRoaXMucm93SGVpZ2h0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJvd0hlaWdodChyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnJvd0hlaWdodCBhcyBudW1iZXI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0gZ3JvdXAgdGhlIGdyb3VwIHdpdGggYWxsIHJvd3NcclxuICAgKi9cclxuICBnZXRHcm91cEhlaWdodChncm91cDogYW55KTogbnVtYmVyIHtcclxuICAgIGxldCByb3dIZWlnaHQgPSAwO1xyXG5cclxuICAgIGlmIChncm91cC52YWx1ZSkge1xyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZ3JvdXAudmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgcm93SGVpZ2h0ICs9IHRoaXMuZ2V0Um93QW5kRGV0YWlsSGVpZ2h0KGdyb3VwLnZhbHVlW2luZGV4XSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcm93SGVpZ2h0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlIHJvdyBoZWlnaHQgYmFzZWQgb24gdGhlIGV4cGFuZGVkIHN0YXRlIG9mIHRoZSByb3cuXHJcbiAgICovXHJcbiAgZ2V0Um93QW5kRGV0YWlsSGVpZ2h0KHJvdzogYW55KTogbnVtYmVyIHtcclxuICAgIGxldCByb3dIZWlnaHQgPSB0aGlzLmdldFJvd0hlaWdodChyb3cpO1xyXG4gICAgY29uc3QgZXhwYW5kZWQgPSB0aGlzLmdldFJvd0V4cGFuZGVkKHJvdyk7XHJcblxyXG4gICAgLy8gQWRkaW5nIGRldGFpbCByb3cgaGVpZ2h0IGlmIGl0cyBleHBhbmRlZC5cclxuICAgIGlmIChleHBhbmRlZCkge1xyXG4gICAgICByb3dIZWlnaHQgKz0gdGhpcy5nZXREZXRhaWxSb3dIZWlnaHQocm93KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcm93SGVpZ2h0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBoZWlnaHQgb2YgdGhlIGRldGFpbCByb3cuXHJcbiAgICovXHJcbiAgZ2V0RGV0YWlsUm93SGVpZ2h0ID0gKHJvdz86IGFueSwgaW5kZXg/OiBhbnkpOiBudW1iZXIgPT4ge1xyXG4gICAgaWYgKCF0aGlzLnJvd0RldGFpbCkge1xyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuICAgIGNvbnN0IHJvd0hlaWdodCA9IHRoaXMucm93RGV0YWlsLnJvd0hlaWdodDtcclxuICAgIHJldHVybiB0eXBlb2Ygcm93SGVpZ2h0ID09PSAnZnVuY3Rpb24nID8gcm93SGVpZ2h0KHJvdywgaW5kZXgpIDogKHJvd0hlaWdodCBhcyBudW1iZXIpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZXMgdGhlIHN0eWxlcyBmb3IgdGhlIHJvdyBzbyB0aGF0IHRoZSByb3dzIGNhbiBiZSBtb3ZlZCBpbiAyRCBzcGFjZVxyXG4gICAqIGR1cmluZyB2aXJ0dWFsIHNjcm9sbCBpbnNpZGUgdGhlIERPTS4gICBJbiB0aGUgYmVsb3cgY2FzZSB0aGUgWSBwb3NpdGlvbiBpc1xyXG4gICAqIG1hbmlwdWxhdGVkLiAgIEFzIGFuIGV4YW1wbGUsIGlmIHRoZSBoZWlnaHQgb2Ygcm93IDAgaXMgMzAgcHggYW5kIHJvdyAxIGlzXHJcbiAgICogMTAwIHB4IHRoZW4gZm9sbG93aW5nIHN0eWxlcyBhcmUgZ2VuZXJhdGVkOlxyXG4gICAqXHJcbiAgICogdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwcHgsIDBweCwgMHB4KTsgICAgLT4gIHJvdzBcclxuICAgKiB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDBweCwgMzBweCwgMHB4KTsgICAtPiAgcm93MVxyXG4gICAqIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMHB4LCAxMzBweCwgMHB4KTsgIC0+ICByb3cyXHJcbiAgICpcclxuICAgKiBSb3cgaGVpZ2h0cyBoYXZlIHRvIGJlIGNhbGN1bGF0ZWQgYmFzZWQgb24gdGhlIHJvdyBoZWlnaHRzIGNhY2hlIGFzIHdlIHdvbnRcclxuICAgKiBiZSBhYmxlIHRvIGRldGVybWluZSB3aGljaCByb3cgaXMgb2Ygd2hhdCBoZWlnaHQgYmVmb3JlIGhhbmQuICBJbiB0aGUgYWJvdmVcclxuICAgKiBjYXNlIHRoZSBwb3NpdGlvblkgb2YgdGhlIHRyYW5zbGF0ZTNkIGZvciByb3cyIHdvdWxkIGJlIHRoZSBzdW0gb2YgYWxsIHRoZVxyXG4gICAqIGhlaWdodHMgb2YgdGhlIHJvd3MgYmVmb3JlIGl0IChpLmUuIHJvdzAgYW5kIHJvdzEpLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJvd3MgdGhlIHJvdyB0aGF0IG5lZWRzIHRvIGJlIHBsYWNlZCBpbiB0aGUgMkQgc3BhY2UuXHJcbiAgICogQHJldHVybnMgdGhlIENTUzMgc3R5bGUgdG8gYmUgYXBwbGllZFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIERhdGFUYWJsZUJvZHlDb21wb25lbnRcclxuICAgKi9cclxuICBnZXRSb3dzU3R5bGVzKHJvd3M6IGFueSk6IGFueSB7XHJcbiAgICBjb25zdCBzdHlsZXM6IGFueSA9IHt9O1xyXG5cclxuICAgIC8vIG9ubHkgYWRkIHN0eWxlcyBmb3IgdGhlIGdyb3VwIGlmIHRoZXJlIGlzIGEgZ3JvdXBcclxuICAgIGlmICh0aGlzLmdyb3VwZWRSb3dzKSB7XHJcbiAgICAgIHN0eWxlcy53aWR0aCA9IHRoaXMuY29sdW1uR3JvdXBXaWR0aHMudG90YWw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyViAmJiB0aGlzLnZpcnR1YWxpemF0aW9uKSB7XHJcbiAgICAgIGxldCBpZHggPSAwO1xyXG5cclxuICAgICAgaWYgKHRoaXMuZ3JvdXBlZFJvd3MpIHtcclxuICAgICAgICAvLyBHZXQgdGhlIGxhdGVzdCByb3cgcm93aW5kZXggaW4gYSBncm91cFxyXG4gICAgICAgIGNvbnN0IHJvdyA9IHJvd3Nbcm93cy5sZW5ndGggLSAxXTtcclxuICAgICAgICBpZHggPSByb3cgPyB0aGlzLmdldFJvd0luZGV4KHJvdykgOiAwO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlkeCA9IHRoaXMuZ2V0Um93SW5kZXgocm93cyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNvbnN0IHBvcyA9IGlkeCAqIHJvd0hlaWdodDtcclxuICAgICAgLy8gVGhlIHBvc2l0aW9uIG9mIHRoaXMgcm93IHdvdWxkIGJlIHRoZSBzdW0gb2YgYWxsIHJvdyBoZWlnaHRzXHJcbiAgICAgIC8vIHVudGlsIHRoZSBwcmV2aW91cyByb3cgcG9zaXRpb24uXHJcbiAgICAgIGNvbnN0IHBvcyA9IHRoaXMucm93SGVpZ2h0c0NhY2hlLnF1ZXJ5KGlkeCAtIDEpO1xyXG5cclxuICAgICAgdHJhbnNsYXRlWFkoc3R5bGVzLCAwLCBwb3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdHlsZXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGUgYm90dG9tIHN1bW1hcnkgcm93IG9mZnNldCBmb3Igc2Nyb2xsYmFyIG1vZGUuXHJcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgY2FjaGUgYW5kIG9mZnNldCBjYWxjdWxhdGlvblxyXG4gICAqIHNlZSBkZXNjcmlwdGlvbiBmb3IgYGdldFJvd3NTdHlsZXNgIG1ldGhvZFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgdGhlIENTUzMgc3R5bGUgdG8gYmUgYXBwbGllZFxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIERhdGFUYWJsZUJvZHlDb21wb25lbnRcclxuICAgKi9cclxuICBnZXRCb3R0b21TdW1tYXJ5Um93U3R5bGVzKCk6IGFueSB7XHJcbiAgICBpZiAoIXRoaXMuc2Nyb2xsYmFyViB8fCAhdGhpcy5yb3dzIHx8ICF0aGlzLnJvd3MubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHN0eWxlcyA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScgfTtcclxuICAgIGNvbnN0IHBvcyA9IHRoaXMucm93SGVpZ2h0c0NhY2hlLnF1ZXJ5KHRoaXMucm93cy5sZW5ndGggLSAxKTtcclxuXHJcbiAgICB0cmFuc2xhdGVYWShzdHlsZXMsIDAsIHBvcyk7XHJcblxyXG4gICAgcmV0dXJuIHN0eWxlcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGVzIHRoZSBsb2FkaW5nIGluZGljYXRvclxyXG4gICAqL1xyXG4gIGhpZGVJbmRpY2F0b3IoKTogdm9pZCB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+ICh0aGlzLmxvYWRpbmdJbmRpY2F0b3IgPSBmYWxzZSksIDUwMCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGVzIHRoZSBpbmRleCBvZiB0aGUgcm93cyBpbiB0aGUgdmlld3BvcnRcclxuICAgKi9cclxuICB1cGRhdGVJbmRleGVzKCk6IHZvaWQge1xyXG4gICAgbGV0IGZpcnN0ID0gMDtcclxuICAgIGxldCBsYXN0ID0gMDtcclxuXHJcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWKSB7XHJcbiAgICAgIGlmICh0aGlzLnZpcnR1YWxpemF0aW9uKSB7XHJcbiAgICAgICAgLy8gQ2FsY3VsYXRpb24gb2YgdGhlIGZpcnN0IGFuZCBsYXN0IGluZGV4ZXMgd2lsbCBiZSBiYXNlZCBvbiB3aGVyZSB0aGVcclxuICAgICAgICAvLyBzY3JvbGxZIHBvc2l0aW9uIHdvdWxkIGJlIGF0LiAgVGhlIGxhc3QgaW5kZXggd291bGQgYmUgdGhlIG9uZVxyXG4gICAgICAgIC8vIHRoYXQgc2hvd3MgdXAgaW5zaWRlIHRoZSB2aWV3IHBvcnQgdGhlIGxhc3QuXHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gcGFyc2VJbnQodGhpcy5ib2R5SGVpZ2h0LCAwKTtcclxuICAgICAgICBmaXJzdCA9IHRoaXMucm93SGVpZ2h0c0NhY2hlLmdldFJvd0luZGV4KHRoaXMub2Zmc2V0WSk7XHJcbiAgICAgICAgbGFzdCA9IHRoaXMucm93SGVpZ2h0c0NhY2hlLmdldFJvd0luZGV4KGhlaWdodCArIHRoaXMub2Zmc2V0WSkgKyAxO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIElmIHZpcnR1YWwgcm93cyBhcmUgbm90IG5lZWRlZFxyXG4gICAgICAgIC8vIFdlIHJlbmRlciBhbGwgaW4gb25lIGdvXHJcbiAgICAgICAgZmlyc3QgPSAwO1xyXG4gICAgICAgIGxhc3QgPSB0aGlzLnJvd0NvdW50O1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBUaGUgc2VydmVyIGlzIGhhbmRsaW5nIHBhZ2luZyBhbmQgd2lsbCBwYXNzIGFuIGFycmF5IHRoYXQgYmVnaW5zIHdpdGggdGhlXHJcbiAgICAgIC8vIGVsZW1lbnQgYXQgYSBzcGVjaWZpZWQgb2Zmc2V0LiAgZmlyc3Qgc2hvdWxkIGFsd2F5cyBiZSAwIHdpdGggZXh0ZXJuYWwgcGFnaW5nLlxyXG4gICAgICBpZiAoIXRoaXMuZXh0ZXJuYWxQYWdpbmcpIHtcclxuICAgICAgICBmaXJzdCA9IE1hdGgubWF4KHRoaXMub2Zmc2V0ICogdGhpcy5wYWdlU2l6ZSwgMCk7XHJcbiAgICAgIH1cclxuICAgICAgbGFzdCA9IE1hdGgubWluKGZpcnN0ICsgdGhpcy5wYWdlU2l6ZSwgdGhpcy5yb3dDb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbmRleGVzID0geyBmaXJzdCwgbGFzdCB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVmcmVzaGVzIHRoZSBmdWxsIFJvdyBIZWlnaHQgY2FjaGUuICBTaG91bGQgYmUgdXNlZFxyXG4gICAqIHdoZW4gdGhlIGVudGlyZSByb3cgYXJyYXkgc3RhdGUgaGFzIGNoYW5nZWQuXHJcbiAgICovXHJcbiAgcmVmcmVzaFJvd0hlaWdodENhY2hlKCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLnNjcm9sbGJhclYgfHwgKHRoaXMuc2Nyb2xsYmFyViAmJiAhdGhpcy52aXJ0dWFsaXphdGlvbikpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNsZWFyIHRoZSBwcmV2aW91cyByb3cgaGVpZ2h0IGNhY2hlIGlmIGFscmVhZHkgcHJlc2VudC5cclxuICAgIC8vIHRoaXMgaXMgdXNlZnVsIGR1cmluZyBzb3J0cywgZmlsdGVycyB3aGVyZSB0aGUgc3RhdGUgb2YgdGhlXHJcbiAgICAvLyByb3dzIGFycmF5IGlzIGNoYW5nZWQuXHJcbiAgICB0aGlzLnJvd0hlaWdodHNDYWNoZS5jbGVhckNhY2hlKCk7XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgdHJlZSBvbmx5IGlmIHRoZXJlIGFyZSByb3dzIGluc2lkZSB0aGUgdHJlZS5cclxuICAgIGlmICh0aGlzLnJvd3MgJiYgdGhpcy5yb3dzLmxlbmd0aCkge1xyXG4gICAgICBjb25zdCByb3dFeHBhbnNpb25zID0gbmV3IFNldCgpO1xyXG4gICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0aGlzLnJvd3MpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXRSb3dFeHBhbmRlZChyb3cpKSB7XHJcbiAgICAgICAgICByb3dFeHBhbnNpb25zLmFkZChyb3cpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5yb3dIZWlnaHRzQ2FjaGUuaW5pdENhY2hlKHtcclxuICAgICAgICByb3dzOiB0aGlzLnJvd3MsXHJcbiAgICAgICAgcm93SGVpZ2h0OiB0aGlzLnJvd0hlaWdodCxcclxuICAgICAgICBkZXRhaWxSb3dIZWlnaHQ6IHRoaXMuZ2V0RGV0YWlsUm93SGVpZ2h0LFxyXG4gICAgICAgIGV4dGVybmFsVmlydHVhbDogdGhpcy5zY3JvbGxiYXJWICYmIHRoaXMuZXh0ZXJuYWxQYWdpbmcsXHJcbiAgICAgICAgcm93Q291bnQ6IHRoaXMucm93Q291bnQsXHJcbiAgICAgICAgcm93SW5kZXhlczogdGhpcy5yb3dJbmRleGVzLFxyXG4gICAgICAgIHJvd0V4cGFuc2lvbnNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBpbmRleCBmb3IgdGhlIHZpZXcgcG9ydFxyXG4gICAqL1xyXG4gIGdldEFkanVzdGVkVmlld1BvcnRJbmRleCgpOiBudW1iZXIge1xyXG4gICAgLy8gQ2FwdHVyZSB0aGUgcm93IGluZGV4IG9mIHRoZSBmaXJzdCByb3cgdGhhdCBpcyB2aXNpYmxlIG9uIHRoZSB2aWV3cG9ydC5cclxuICAgIC8vIElmIHRoZSBzY3JvbGwgYmFyIGlzIGp1c3QgYmVsb3cgdGhlIHJvdyB3aGljaCBpcyBoaWdobGlnaHRlZCB0aGVuIG1ha2UgdGhhdCBhcyB0aGVcclxuICAgIC8vIGZpcnN0IGluZGV4LlxyXG4gICAgY29uc3Qgdmlld1BvcnRGaXJzdFJvd0luZGV4ID0gdGhpcy5pbmRleGVzLmZpcnN0O1xyXG5cclxuICAgIGlmICh0aGlzLnNjcm9sbGJhclYgJiYgdGhpcy52aXJ0dWFsaXphdGlvbikge1xyXG4gICAgICBjb25zdCBvZmZzZXRTY3JvbGwgPSB0aGlzLnJvd0hlaWdodHNDYWNoZS5xdWVyeSh2aWV3UG9ydEZpcnN0Um93SW5kZXggLSAxKTtcclxuICAgICAgcmV0dXJuIG9mZnNldFNjcm9sbCA8PSB0aGlzLm9mZnNldFkgPyB2aWV3UG9ydEZpcnN0Um93SW5kZXggLSAxIDogdmlld1BvcnRGaXJzdFJvd0luZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2aWV3UG9ydEZpcnN0Um93SW5kZXg7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUb2dnbGUgdGhlIEV4cGFuc2lvbiBvZiB0aGUgcm93IGkuZS4gaWYgdGhlIHJvdyBpcyBleHBhbmRlZCB0aGVuIGl0IHdpbGxcclxuICAgKiBjb2xsYXBzZSBhbmQgdmljZSB2ZXJzYS4gICBOb3RlIHRoYXQgdGhlIGV4cGFuZGVkIHN0YXR1cyBpcyBzdG9yZWQgYXNcclxuICAgKiBhIHBhcnQgb2YgdGhlIHJvdyBvYmplY3QgaXRzZWxmIGFzIHdlIGhhdmUgdG8gcHJlc2VydmUgdGhlIGV4cGFuZGVkIHJvd1xyXG4gICAqIHN0YXR1cyBpbiBjYXNlIG9mIHNvcnRpbmcgYW5kIGZpbHRlcmluZyBvZiB0aGUgcm93IHNldC5cclxuICAgKi9cclxuICB0b2dnbGVSb3dFeHBhbnNpb24ocm93OiBhbnkpOiB2b2lkIHtcclxuICAgIC8vIENhcHR1cmUgdGhlIHJvdyBpbmRleCBvZiB0aGUgZmlyc3Qgcm93IHRoYXQgaXMgdmlzaWJsZSBvbiB0aGUgdmlld3BvcnQuXHJcbiAgICBjb25zdCB2aWV3UG9ydEZpcnN0Um93SW5kZXggPSB0aGlzLmdldEFkanVzdGVkVmlld1BvcnRJbmRleCgpO1xyXG4gICAgY29uc3Qgcm93RXhwYW5kZWRJZHggPSB0aGlzLmdldFJvd0V4cGFuZGVkSWR4KHJvdywgdGhpcy5yb3dFeHBhbnNpb25zKTtcclxuICAgIGNvbnN0IGV4cGFuZGVkID0gcm93RXhwYW5kZWRJZHggPiAtMTtcclxuXHJcbiAgICAvLyBJZiB0aGUgZGV0YWlsUm93SGVpZ2h0IGlzIGF1dG8gLS0+IG9ubHkgaW4gY2FzZSBvZiBub24tdmlydHVhbGl6ZWQgc2Nyb2xsXHJcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWICYmIHRoaXMudmlydHVhbGl6YXRpb24pIHtcclxuICAgICAgY29uc3QgZGV0YWlsUm93SGVpZ2h0ID0gdGhpcy5nZXREZXRhaWxSb3dIZWlnaHQocm93KSAqIChleHBhbmRlZCA/IC0xIDogMSk7XHJcbiAgICAgIC8vIGNvbnN0IGlkeCA9IHRoaXMucm93SW5kZXhlcy5nZXQocm93KSB8fCAwO1xyXG4gICAgICBjb25zdCBpZHggPSB0aGlzLmdldFJvd0luZGV4KHJvdyk7XHJcbiAgICAgIHRoaXMucm93SGVpZ2h0c0NhY2hlLnVwZGF0ZShpZHgsIGRldGFpbFJvd0hlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBkYXRlIHRoZSB0b2dnbGVkIHJvdyBhbmQgdXBkYXRlIHRoaXZlIG5ldmVyZSBoZWlnaHRzIGluIHRoZSBjYWNoZS5cclxuICAgIGlmIChleHBhbmRlZCkge1xyXG4gICAgICB0aGlzLnJvd0V4cGFuc2lvbnMuc3BsaWNlKHJvd0V4cGFuZGVkSWR4LCAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucm93RXhwYW5zaW9ucy5wdXNoKHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kZXRhaWxUb2dnbGUuZW1pdCh7XHJcbiAgICAgIHJvd3M6IFtyb3ddLFxyXG4gICAgICBjdXJyZW50SW5kZXg6IHZpZXdQb3J0Rmlyc3RSb3dJbmRleFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeHBhbmQvQ29sbGFwc2UgYWxsIHRoZSByb3dzIG5vIG1hdHRlciB3aGF0IHRoZWlyIHN0YXRlIGlzLlxyXG4gICAqL1xyXG4gIHRvZ2dsZUFsbFJvd3MoZXhwYW5kZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIC8vIGNsZWFyIHByZXYgZXhwYW5zaW9uc1xyXG4gICAgdGhpcy5yb3dFeHBhbnNpb25zID0gW107XHJcblxyXG4gICAgLy8gQ2FwdHVyZSB0aGUgcm93IGluZGV4IG9mIHRoZSBmaXJzdCByb3cgdGhhdCBpcyB2aXNpYmxlIG9uIHRoZSB2aWV3cG9ydC5cclxuICAgIGNvbnN0IHZpZXdQb3J0Rmlyc3RSb3dJbmRleCA9IHRoaXMuZ2V0QWRqdXN0ZWRWaWV3UG9ydEluZGV4KCk7XHJcblxyXG4gICAgaWYgKGV4cGFuZGVkKSB7XHJcbiAgICAgIGZvciAoY29uc3Qgcm93IG9mIHRoaXMucm93cykge1xyXG4gICAgICAgIHRoaXMucm93RXhwYW5zaW9ucy5wdXNoKHJvdyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWKSB7XHJcbiAgICAgIC8vIFJlZnJlc2ggdGhlIGZ1bGwgcm93IGhlaWdodHMgY2FjaGUgc2luY2UgZXZlcnkgcm93IHdhcyBhZmZlY3RlZC5cclxuICAgICAgdGhpcy5yZWNhbGNMYXlvdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFbWl0IGFsbCByb3dzIHRoYXQgaGF2ZSBiZWVuIGV4cGFuZGVkLlxyXG4gICAgdGhpcy5kZXRhaWxUb2dnbGUuZW1pdCh7XHJcbiAgICAgIHJvd3M6IHRoaXMucm93cyxcclxuICAgICAgY3VycmVudEluZGV4OiB2aWV3UG9ydEZpcnN0Um93SW5kZXhcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVjYWxjdWxhdGVzIHRoZSB0YWJsZVxyXG4gICAqL1xyXG4gIHJlY2FsY0xheW91dCgpOiB2b2lkIHtcclxuICAgIHRoaXMucmVmcmVzaFJvd0hlaWdodENhY2hlKCk7XHJcbiAgICB0aGlzLnVwZGF0ZUluZGV4ZXMoKTtcclxuICAgIHRoaXMudXBkYXRlUm93cygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJhY2tzIHRoZSBjb2x1bW5cclxuICAgKi9cclxuICBjb2x1bW5UcmFja2luZ0ZuKGluZGV4OiBudW1iZXIsIGNvbHVtbjogYW55KTogYW55IHtcclxuICAgIHJldHVybiBjb2x1bW4uJCRpZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHJvdyBwaW5uaW5nIGdyb3VwIHN0eWxlc1xyXG4gICAqL1xyXG4gIHN0eWxlc0J5R3JvdXAoZ3JvdXA6IHN0cmluZykge1xyXG4gICAgY29uc3Qgd2lkdGhzID0gdGhpcy5jb2x1bW5Hcm91cFdpZHRocztcclxuICAgIGNvbnN0IG9mZnNldFggPSB0aGlzLm9mZnNldFg7XHJcblxyXG4gICAgY29uc3Qgc3R5bGVzID0ge1xyXG4gICAgICB3aWR0aDogYCR7d2lkdGhzW2dyb3VwXX1weGBcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGdyb3VwID09PSAnbGVmdCcpIHtcclxuICAgICAgdHJhbnNsYXRlWFkoc3R5bGVzLCBvZmZzZXRYLCAwKTtcclxuICAgIH0gZWxzZSBpZiAoZ3JvdXAgPT09ICdyaWdodCcpIHtcclxuICAgICAgY29uc3QgYm9keVdpZHRoID0gcGFyc2VJbnQodGhpcy5pbm5lcldpZHRoICsgJycsIDApO1xyXG4gICAgICBjb25zdCB0b3RhbERpZmYgPSB3aWR0aHMudG90YWwgLSBib2R5V2lkdGg7XHJcbiAgICAgIGNvbnN0IG9mZnNldERpZmYgPSB0b3RhbERpZmYgLSBvZmZzZXRYO1xyXG4gICAgICBjb25zdCBvZmZzZXQgPSAob2Zmc2V0RGlmZiAqIC0xKSsxNztcclxuICAgICAgdHJhbnNsYXRlWFkoc3R5bGVzLCBvZmZzZXQsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdHlsZXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGlmIHRoZSByb3cgd2FzIGV4cGFuZGVkIGFuZCBzZXQgZGVmYXVsdCByb3cgZXhwYW5zaW9uIHdoZW4gcm93IGV4cGFuc2lvbiBpcyBlbXB0eVxyXG4gICAqL1xyXG4gIGdldFJvd0V4cGFuZGVkKHJvdzogYW55KTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5yb3dFeHBhbnNpb25zLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmdyb3VwRXhwYW5zaW9uRGVmYXVsdCkge1xyXG4gICAgICBmb3IgKGNvbnN0IGdyb3VwIG9mIHRoaXMuZ3JvdXBlZFJvd3MpIHtcclxuICAgICAgICB0aGlzLnJvd0V4cGFuc2lvbnMucHVzaChncm91cCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5nZXRSb3dFeHBhbmRlZElkeChyb3csIHRoaXMucm93RXhwYW5zaW9ucykgPiAtMTtcclxuICB9XHJcblxyXG4gIGdldFJvd0V4cGFuZGVkSWR4KHJvdzogYW55LCBleHBhbmRlZDogYW55W10pOiBudW1iZXIge1xyXG4gICAgaWYgKCFleHBhbmRlZCB8fCAhZXhwYW5kZWQubGVuZ3RoKSByZXR1cm4gLTE7XHJcblxyXG4gICAgY29uc3Qgcm93SWQgPSB0aGlzLnJvd0lkZW50aXR5KHJvdyk7XHJcbiAgICByZXR1cm4gZXhwYW5kZWQuZmluZEluZGV4KChyKSA9PiB7XHJcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5yb3dJZGVudGl0eShyKTtcclxuICAgICAgcmV0dXJuIGlkID09PSByb3dJZDtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgcm93IGluZGV4IGdpdmVuIGEgcm93XHJcbiAgICovXHJcbiAgZ2V0Um93SW5kZXgocm93OiBhbnkpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMucm93SW5kZXhlcy5nZXQocm93KSB8fCAwO1xyXG4gIH1cclxuXHJcbiAgb25UcmVlQWN0aW9uKHJvdzogYW55KSB7XHJcbiAgICB0aGlzLnRyZWVBY3Rpb24uZW1pdCh7IHJvdyB9KTtcclxuICB9XHJcbn1cclxuIl19