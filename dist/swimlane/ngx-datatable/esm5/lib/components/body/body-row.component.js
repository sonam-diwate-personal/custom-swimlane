/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, HostBinding, ElementRef, Output, KeyValueDiffers, EventEmitter, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, SkipSelf } from '@angular/core';
import { columnsByPin, columnGroupWidths, columnsByPinArr } from '../../utils/column';
import { Keys } from '../../utils/keys';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import { translateXY } from '../../utils/translate';
var DataTableBodyRowComponent = /** @class */ (function () {
    function DataTableBodyRowComponent(differs, scrollbarHelper, cd, element) {
        this.differs = differs;
        this.scrollbarHelper = scrollbarHelper;
        this.cd = cd;
        this.treeStatus = 'collapsed';
        this.activate = new EventEmitter();
        this.treeAction = new EventEmitter();
        this._groupStyles = {
            left: {},
            center: {},
            right: {}
        };
        this._element = element.nativeElement;
        this._rowDiffer = differs.find({}).create();
    }
    Object.defineProperty(DataTableBodyRowComponent.prototype, "columns", {
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
            this.recalculateColumns(val);
            this.buildStylesByGroup();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyRowComponent.prototype, "innerWidth", {
        get: /**
         * @return {?}
         */
        function () {
            return this._innerWidth;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            if (this._columns) {
                /** @type {?} */
                var colByPin = columnsByPin(this._columns);
                this._columnGroupWidths = columnGroupWidths(colByPin, this._columns);
            }
            this._innerWidth = val;
            this.recalculateColumns();
            this.buildStylesByGroup();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyRowComponent.prototype, "offsetX", {
        get: /**
         * @return {?}
         */
        function () {
            return this._offsetX;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._offsetX = val;
            this.buildStylesByGroup();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyRowComponent.prototype, "cssClass", {
        get: /**
         * @return {?}
         */
        function () {
            var e_1, _a;
            /** @type {?} */
            var cls = 'datatable-body-row';
            if (this.isSelected) {
                cls += ' active';
            }
            if (this.rowIndex % 2 !== 0) {
                cls += ' datatable-row-odd';
            }
            if (this.rowIndex % 2 === 0) {
                cls += ' datatable-row-even';
            }
            if (this.rowClass) {
                /** @type {?} */
                var res = this.rowClass(this.row);
                if (typeof res === 'string') {
                    cls += " " + res;
                }
                else if (typeof res === 'object') {
                    /** @type {?} */
                    var keys = Object.keys(res);
                    try {
                        for (var keys_1 = tslib_1.__values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                            var k = keys_1_1.value;
                            if (res[k] === true) {
                                cls += " " + k;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            return cls;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyRowComponent.prototype, "columnsTotalWidths", {
        get: /**
         * @return {?}
         */
        function () {
            return this._columnGroupWidths.total;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this._rowDiffer.diff(this.row)) {
            this.cd.markForCheck();
        }
    };
    /**
     * @param {?} index
     * @param {?} colGroup
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.trackByGroups = /**
     * @param {?} index
     * @param {?} colGroup
     * @return {?}
     */
    function (index, colGroup) {
        return colGroup.type;
    };
    /**
     * @param {?} index
     * @param {?} column
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.columnTrackingFn = /**
     * @param {?} index
     * @param {?} column
     * @return {?}
     */
    function (index, column) {
        return column.$$id;
    };
    /**
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.buildStylesByGroup = /**
     * @return {?}
     */
    function () {
        this._groupStyles.left = this.calcStylesByGroup('left');
        this._groupStyles.center = this.calcStylesByGroup('center');
        this._groupStyles.right = this.calcStylesByGroup('right');
        this.cd.markForCheck();
    };
    /**
     * @param {?} group
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.calcStylesByGroup = /**
     * @param {?} group
     * @return {?}
     */
    function (group) {
        /** @type {?} */
        var widths = this._columnGroupWidths;
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
            var offset = ((offsetDiff + this.scrollbarHelper.width) * -1) + 17;
            translateXY(styles, offset, 0);
        }
        return styles;
    };
    /**
     * @param {?} event
     * @param {?} index
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.onActivate = /**
     * @param {?} event
     * @param {?} index
     * @return {?}
     */
    function (event, index) {
        event.cellIndex = index;
        event.rowElement = this._element;
        this.activate.emit(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.onKeyDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var keyCode = event.keyCode;
        /** @type {?} */
        var isTargetRow = event.target === this._element;
        /** @type {?} */
        var isAction = keyCode === Keys.return ||
            keyCode === Keys.down ||
            keyCode === Keys.up ||
            keyCode === Keys.left ||
            keyCode === Keys.right;
        if (isAction && isTargetRow) {
            event.preventDefault();
            event.stopPropagation();
            this.activate.emit({
                type: 'keydown',
                event: event,
                row: this.row,
                rowElement: this._element
            });
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.onMouseenter = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.activate.emit({
            type: 'mouseenter',
            event: event,
            row: this.row,
            rowElement: this._element
        });
    };
    /**
     * @param {?=} val
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.recalculateColumns = /**
     * @param {?=} val
     * @return {?}
     */
    function (val) {
        if (val === void 0) { val = this.columns; }
        this._columns = val;
        /** @type {?} */
        var colsByPin = columnsByPin(this._columns);
        this._columnsByPin = columnsByPinArr(this._columns);
        this._columnGroupWidths = columnGroupWidths(colsByPin, this._columns);
    };
    /**
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.onTreeAction = /**
     * @return {?}
     */
    function () {
        this.treeAction.emit();
    };
    DataTableBodyRowComponent.decorators = [
        { type: Component, args: [{
                    selector: 'datatable-body-row',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "\n    <div\n      *ngFor=\"let colGroup of _columnsByPin; let i = index; trackBy: trackByGroups\"\n      class=\"datatable-row-{{ colGroup.type }} datatable-row-group\"\n      [ngStyle]=\"_groupStyles[colGroup.type]\"\n    >\n      <datatable-body-cell\n        *ngFor=\"let column of colGroup.columns; let ii = index; trackBy: columnTrackingFn\"\n        tabindex=\"-1\"\n        [row]=\"row\"\n        [group]=\"group\"\n        [expanded]=\"expanded\"\n        [isSelected]=\"isSelected\"\n        [rowIndex]=\"rowIndex\"\n        [column]=\"column\"\n        [rowHeight]=\"rowHeight\"\n        [displayCheck]=\"displayCheck\"\n        [treeStatus]=\"treeStatus\"\n        (activate)=\"onActivate($event, ii)\"\n        (treeAction)=\"onTreeAction()\"\n      >\n      </datatable-body-cell>\n    </div>\n  "
                }] }
    ];
    /** @nocollapse */
    DataTableBodyRowComponent.ctorParameters = function () { return [
        { type: KeyValueDiffers },
        { type: ScrollbarHelper, decorators: [{ type: SkipSelf }] },
        { type: ChangeDetectorRef },
        { type: ElementRef }
    ]; };
    DataTableBodyRowComponent.propDecorators = {
        columns: [{ type: Input }],
        innerWidth: [{ type: Input }],
        expanded: [{ type: Input }],
        rowClass: [{ type: Input }],
        row: [{ type: Input }],
        group: [{ type: Input }],
        isSelected: [{ type: Input }],
        rowIndex: [{ type: Input }],
        displayCheck: [{ type: Input }],
        treeStatus: [{ type: Input }],
        offsetX: [{ type: Input }],
        cssClass: [{ type: HostBinding, args: ['class',] }],
        rowHeight: [{ type: HostBinding, args: ['style.height.px',] }, { type: Input }],
        columnsTotalWidths: [{ type: HostBinding, args: ['style.width.px',] }],
        activate: [{ type: Output }],
        treeAction: [{ type: Output }],
        onKeyDown: [{ type: HostListener, args: ['keydown', ['$event'],] }],
        onMouseenter: [{ type: HostListener, args: ['mouseenter', ['$event'],] }]
    };
    return DataTableBodyRowComponent;
}());
export { DataTableBodyRowComponent };
if (false) {
    /** @type {?} */
    DataTableBodyRowComponent.prototype.expanded;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.rowClass;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.row;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.group;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.isSelected;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.rowIndex;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.displayCheck;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.treeStatus;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.rowHeight;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.activate;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.treeAction;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._element;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._columnGroupWidths;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._columnsByPin;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._offsetX;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._columns;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._innerWidth;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._groupStyles;
    /**
     * @type {?}
     * @private
     */
    DataTableBodyRowComponent.prototype._rowDiffer;
    /**
     * @type {?}
     * @private
     */
    DataTableBodyRowComponent.prototype.differs;
    /**
     * @type {?}
     * @private
     */
    DataTableBodyRowComponent.prototype.scrollbarHelper;
    /**
     * @type {?}
     * @private
     */
    DataTableBodyRowComponent.prototype.cd;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1yb3cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ib2R5L2JvZHktcm93LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLFdBQVcsRUFDWCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGVBQWUsRUFFZixZQUFZLEVBQ1osWUFBWSxFQUNaLHVCQUF1QixFQUN2QixpQkFBaUIsRUFFakIsUUFBUSxFQUNULE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDdEYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFcEQ7SUFnSUUsbUNBQ1UsT0FBd0IsRUFDWixlQUFnQyxFQUM1QyxFQUFxQixFQUM3QixPQUFtQjtRQUhYLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBQ1osb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQzVDLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBdEV0QixlQUFVLEdBQWUsV0FBVyxDQUFDO1FBa0RwQyxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakQsZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBUTdELGlCQUFZLEdBQTJCO1lBQ3JDLElBQUksRUFBRSxFQUFFO1lBQ1IsTUFBTSxFQUFFLEVBQUU7WUFDVixLQUFLLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFVQSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDdEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzlDLENBQUM7SUEzR0Qsc0JBQWEsOENBQU87Ozs7UUFNcEI7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzs7Ozs7UUFSRCxVQUFxQixHQUFVO1lBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM1QixDQUFDOzs7T0FBQTtJQU1ELHNCQUFhLGlEQUFVOzs7O1FBV3ZCO1lBQ0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzFCLENBQUM7Ozs7O1FBYkQsVUFBd0IsR0FBVztZQUNqQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7O29CQUNYLFFBQVEsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDdEU7WUFFRCxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztZQUN2QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM1QixDQUFDOzs7T0FBQTtJQWVELHNCQUNJLDhDQUFPOzs7O1FBSVg7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzs7Ozs7UUFQRCxVQUNZLEdBQVc7WUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7WUFDcEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDNUIsQ0FBQzs7O09BQUE7SUFLRCxzQkFDSSwrQ0FBUTs7OztRQURaOzs7Z0JBRU0sR0FBRyxHQUFHLG9CQUFvQjtZQUM5QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLEdBQUcsSUFBSSxTQUFTLENBQUM7YUFDbEI7WUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDM0IsR0FBRyxJQUFJLG9CQUFvQixDQUFDO2FBQzdCO1lBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzNCLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQzthQUM5QjtZQUVELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTs7b0JBQ1gsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDbkMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7b0JBQzNCLEdBQUcsSUFBSSxNQUFJLEdBQUssQ0FBQztpQkFDbEI7cUJBQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7O3dCQUM1QixJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7O3dCQUM3QixLQUFnQixJQUFBLFNBQUEsaUJBQUEsSUFBSSxDQUFBLDBCQUFBLDRDQUFFOzRCQUFqQixJQUFNLENBQUMsaUJBQUE7NEJBQ1YsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO2dDQUNuQixHQUFHLElBQUksTUFBSSxDQUFHLENBQUM7NkJBQ2hCO3lCQUNGOzs7Ozs7Ozs7aUJBQ0Y7YUFDRjtZQUVELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQzs7O09BQUE7SUFNRCxzQkFDSSx5REFBa0I7Ozs7UUFEdEI7WUFFRSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7UUFDdkMsQ0FBQzs7O09BQUE7Ozs7SUE2QkQsNkNBQVM7OztJQUFUO1FBQ0UsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7Ozs7OztJQUVELGlEQUFhOzs7OztJQUFiLFVBQWMsS0FBYSxFQUFFLFFBQWE7UUFDeEMsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7Ozs7OztJQUVELG9EQUFnQjs7Ozs7SUFBaEIsVUFBaUIsS0FBYSxFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7Ozs7SUFFRCxzREFBa0I7OztJQUFsQjtRQUNFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDekIsQ0FBQzs7Ozs7SUFFRCxxREFBaUI7Ozs7SUFBakIsVUFBa0IsS0FBYTs7WUFDdkIsTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0I7O1lBQ2hDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTzs7WUFFdEIsTUFBTSxHQUFHO1lBQ2IsS0FBSyxFQUFLLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBSTtTQUM1QjtRQUVELElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtZQUNwQixXQUFXLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNqQzthQUFNLElBQUksS0FBSyxLQUFLLE9BQU8sRUFBRTs7Z0JBQ3RCLFNBQVMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztnQkFDN0MsU0FBUyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsU0FBUzs7Z0JBQ3BDLFVBQVUsR0FBRyxTQUFTLEdBQUcsT0FBTzs7Z0JBQ2hDLE1BQU0sR0FBRyxDQUFDLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRSxFQUFFO1lBQ25FLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2hDO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7Ozs7O0lBRUQsOENBQVU7Ozs7O0lBQVYsVUFBVyxLQUFVLEVBQUUsS0FBYTtRQUNsQyxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN4QixLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7Ozs7SUFHRCw2Q0FBUzs7OztJQURULFVBQ1UsS0FBb0I7O1lBQ3RCLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTzs7WUFDdkIsV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFFBQVE7O1lBRTVDLFFBQVEsR0FDWixPQUFPLEtBQUssSUFBSSxDQUFDLE1BQU07WUFDdkIsT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJO1lBQ3JCLE9BQU8sS0FBSyxJQUFJLENBQUMsRUFBRTtZQUNuQixPQUFPLEtBQUssSUFBSSxDQUFDLElBQUk7WUFDckIsT0FBTyxLQUFLLElBQUksQ0FBQyxLQUFLO1FBRXhCLElBQUksUUFBUSxJQUFJLFdBQVcsRUFBRTtZQUMzQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBRXhCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUNqQixJQUFJLEVBQUUsU0FBUztnQkFDZixLQUFLLE9BQUE7Z0JBQ0wsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO2dCQUNiLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUTthQUMxQixDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Ozs7O0lBR0QsZ0RBQVk7Ozs7SUFEWixVQUNhLEtBQVU7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDakIsSUFBSSxFQUFFLFlBQVk7WUFDbEIsS0FBSyxPQUFBO1lBQ0wsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQzFCLENBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBRUQsc0RBQWtCOzs7O0lBQWxCLFVBQW1CLEdBQXlCO1FBQXpCLG9CQUFBLEVBQUEsTUFBYSxJQUFJLENBQUMsT0FBTztRQUMxQyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQzs7WUFDZCxTQUFTLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDN0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7Ozs7SUFFRCxnREFBWTs7O0lBQVo7UUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUM7O2dCQXRPRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLFFBQVEsRUFBRSwyeUJBdUJUO2lCQUNGOzs7O2dCQTNDQyxlQUFlO2dCQWFSLGVBQWUsdUJBcUluQixRQUFRO2dCQTdJWCxpQkFBaUI7Z0JBUGpCLFVBQVU7OzswQkErQ1QsS0FBSzs2QkFVTCxLQUFLOzJCQWVMLEtBQUs7MkJBQ0wsS0FBSztzQkFDTCxLQUFLO3dCQUNMLEtBQUs7NkJBQ0wsS0FBSzsyQkFDTCxLQUFLOytCQUNMLEtBQUs7NkJBQ0wsS0FBSzswQkFFTCxLQUFLOzJCQVNMLFdBQVcsU0FBQyxPQUFPOzRCQThCbkIsV0FBVyxTQUFDLGlCQUFpQixjQUM3QixLQUFLO3FDQUdMLFdBQVcsU0FBQyxnQkFBZ0I7MkJBSzVCLE1BQU07NkJBQ04sTUFBTTs0QkEwRU4sWUFBWSxTQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQzsrQkF5QmxDLFlBQVksU0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0lBb0J4QyxnQ0FBQztDQUFBLEFBdk9ELElBdU9DO1NBM01ZLHlCQUF5Qjs7O0lBMEJwQyw2Q0FBMkI7O0lBQzNCLDZDQUF1Qjs7SUFDdkIsd0NBQWtCOztJQUNsQiwwQ0FBb0I7O0lBQ3BCLCtDQUE2Qjs7SUFDN0IsNkNBQTBCOztJQUMxQixpREFBMkI7O0lBQzNCLCtDQUE4Qzs7SUF5QzlDLDhDQUVrQjs7SUFPbEIsNkNBQTJEOztJQUMzRCwrQ0FBNkQ7O0lBRTdELDZDQUFjOztJQUNkLHVEQUF3Qjs7SUFDeEIsa0RBQW1COztJQUNuQiw2Q0FBaUI7O0lBQ2pCLDZDQUFnQjs7SUFDaEIsZ0RBQW9COztJQUNwQixpREFJRTs7Ozs7SUFFRiwrQ0FBMkM7Ozs7O0lBR3pDLDRDQUFnQzs7Ozs7SUFDaEMsb0RBQW9EOzs7OztJQUNwRCx1Q0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBIb3N0QmluZGluZyxcclxuICBFbGVtZW50UmVmLFxyXG4gIE91dHB1dCxcclxuICBLZXlWYWx1ZURpZmZlcnMsXHJcbiAgS2V5VmFsdWVEaWZmZXIsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIEhvc3RMaXN0ZW5lcixcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBEb0NoZWNrLFxyXG4gIFNraXBTZWxmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBUcmVlU3RhdHVzIH0gZnJvbSAnLi9ib2R5LWNlbGwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgY29sdW1uc0J5UGluLCBjb2x1bW5Hcm91cFdpZHRocywgY29sdW1uc0J5UGluQXJyIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29sdW1uJztcclxuaW1wb3J0IHsgS2V5cyB9IGZyb20gJy4uLy4uL3V0aWxzL2tleXMnO1xyXG5pbXBvcnQgeyBTY3JvbGxiYXJIZWxwZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zY3JvbGxiYXItaGVscGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyB0cmFuc2xhdGVYWSB9IGZyb20gJy4uLy4uL3V0aWxzL3RyYW5zbGF0ZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2RhdGF0YWJsZS1ib2R5LXJvdycsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxkaXZcclxuICAgICAgKm5nRm9yPVwibGV0IGNvbEdyb3VwIG9mIF9jb2x1bW5zQnlQaW47IGxldCBpID0gaW5kZXg7IHRyYWNrQnk6IHRyYWNrQnlHcm91cHNcIlxyXG4gICAgICBjbGFzcz1cImRhdGF0YWJsZS1yb3cte3sgY29sR3JvdXAudHlwZSB9fSBkYXRhdGFibGUtcm93LWdyb3VwXCJcclxuICAgICAgW25nU3R5bGVdPVwiX2dyb3VwU3R5bGVzW2NvbEdyb3VwLnR5cGVdXCJcclxuICAgID5cclxuICAgICAgPGRhdGF0YWJsZS1ib2R5LWNlbGxcclxuICAgICAgICAqbmdGb3I9XCJsZXQgY29sdW1uIG9mIGNvbEdyb3VwLmNvbHVtbnM7IGxldCBpaSA9IGluZGV4OyB0cmFja0J5OiBjb2x1bW5UcmFja2luZ0ZuXCJcclxuICAgICAgICB0YWJpbmRleD1cIi0xXCJcclxuICAgICAgICBbcm93XT1cInJvd1wiXHJcbiAgICAgICAgW2dyb3VwXT1cImdyb3VwXCJcclxuICAgICAgICBbZXhwYW5kZWRdPVwiZXhwYW5kZWRcIlxyXG4gICAgICAgIFtpc1NlbGVjdGVkXT1cImlzU2VsZWN0ZWRcIlxyXG4gICAgICAgIFtyb3dJbmRleF09XCJyb3dJbmRleFwiXHJcbiAgICAgICAgW2NvbHVtbl09XCJjb2x1bW5cIlxyXG4gICAgICAgIFtyb3dIZWlnaHRdPVwicm93SGVpZ2h0XCJcclxuICAgICAgICBbZGlzcGxheUNoZWNrXT1cImRpc3BsYXlDaGVja1wiXHJcbiAgICAgICAgW3RyZWVTdGF0dXNdPVwidHJlZVN0YXR1c1wiXHJcbiAgICAgICAgKGFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50LCBpaSlcIlxyXG4gICAgICAgICh0cmVlQWN0aW9uKT1cIm9uVHJlZUFjdGlvbigpXCJcclxuICAgICAgPlxyXG4gICAgICA8L2RhdGF0YWJsZS1ib2R5LWNlbGw+XHJcbiAgICA8L2Rpdj5cclxuICBgXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVCb2R5Um93Q29tcG9uZW50IGltcGxlbWVudHMgRG9DaGVjayB7XHJcbiAgQElucHV0KCkgc2V0IGNvbHVtbnModmFsOiBhbnlbXSkge1xyXG4gICAgdGhpcy5fY29sdW1ucyA9IHZhbDtcclxuICAgIHRoaXMucmVjYWxjdWxhdGVDb2x1bW5zKHZhbCk7XHJcbiAgICB0aGlzLmJ1aWxkU3R5bGVzQnlHcm91cCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNvbHVtbnMoKTogYW55W10ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtbnM7XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKSBzZXQgaW5uZXJXaWR0aCh2YWw6IG51bWJlcikge1xyXG4gICAgaWYgKHRoaXMuX2NvbHVtbnMpIHtcclxuICAgICAgY29uc3QgY29sQnlQaW4gPSBjb2x1bW5zQnlQaW4odGhpcy5fY29sdW1ucyk7XHJcbiAgICAgIHRoaXMuX2NvbHVtbkdyb3VwV2lkdGhzID0gY29sdW1uR3JvdXBXaWR0aHMoY29sQnlQaW4sIHRoaXMuX2NvbHVtbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2lubmVyV2lkdGggPSB2YWw7XHJcbiAgICB0aGlzLnJlY2FsY3VsYXRlQ29sdW1ucygpO1xyXG4gICAgdGhpcy5idWlsZFN0eWxlc0J5R3JvdXAoKTtcclxuICB9XHJcblxyXG4gIGdldCBpbm5lcldpZHRoKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5faW5uZXJXaWR0aDtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpIGV4cGFuZGVkOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHJvd0NsYXNzOiBhbnk7XHJcbiAgQElucHV0KCkgcm93OiBhbnk7XHJcbiAgQElucHV0KCkgZ3JvdXA6IGFueTtcclxuICBASW5wdXQoKSBpc1NlbGVjdGVkOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHJvd0luZGV4OiBudW1iZXI7XHJcbiAgQElucHV0KCkgZGlzcGxheUNoZWNrOiBhbnk7XHJcbiAgQElucHV0KCkgdHJlZVN0YXR1czogVHJlZVN0YXR1cyA9ICdjb2xsYXBzZWQnO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHNldCBvZmZzZXRYKHZhbDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLl9vZmZzZXRYID0gdmFsO1xyXG4gICAgdGhpcy5idWlsZFN0eWxlc0J5R3JvdXAoKTtcclxuICB9XHJcbiAgZ2V0IG9mZnNldFgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0WDtcclxuICB9XHJcblxyXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxyXG4gIGdldCBjc3NDbGFzcygpIHtcclxuICAgIGxldCBjbHMgPSAnZGF0YXRhYmxlLWJvZHktcm93JztcclxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xzICs9ICcgYWN0aXZlJztcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnJvd0luZGV4ICUgMiAhPT0gMCkge1xyXG4gICAgICBjbHMgKz0gJyBkYXRhdGFibGUtcm93LW9kZCc7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5yb3dJbmRleCAlIDIgPT09IDApIHtcclxuICAgICAgY2xzICs9ICcgZGF0YXRhYmxlLXJvdy1ldmVuJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yb3dDbGFzcykge1xyXG4gICAgICBjb25zdCByZXMgPSB0aGlzLnJvd0NsYXNzKHRoaXMucm93KTtcclxuICAgICAgaWYgKHR5cGVvZiByZXMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgY2xzICs9IGAgJHtyZXN9YDtcclxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhyZXMpO1xyXG4gICAgICAgIGZvciAoY29uc3QgayBvZiBrZXlzKSB7XHJcbiAgICAgICAgICBpZiAocmVzW2tdID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNscyArPSBgICR7a31gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjbHM7XHJcbiAgfVxyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmhlaWdodC5weCcpXHJcbiAgQElucHV0KClcclxuICByb3dIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aC5weCcpXHJcbiAgZ2V0IGNvbHVtbnNUb3RhbFdpZHRocygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtbkdyb3VwV2lkdGhzLnRvdGFsO1xyXG4gIH1cclxuXHJcbiAgQE91dHB1dCgpIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgdHJlZUFjdGlvbjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIF9lbGVtZW50OiBhbnk7XHJcbiAgX2NvbHVtbkdyb3VwV2lkdGhzOiBhbnk7XHJcbiAgX2NvbHVtbnNCeVBpbjogYW55O1xyXG4gIF9vZmZzZXRYOiBudW1iZXI7XHJcbiAgX2NvbHVtbnM6IGFueVtdO1xyXG4gIF9pbm5lcldpZHRoOiBudW1iZXI7XHJcbiAgX2dyb3VwU3R5bGVzOiB7IFtwcm9wOiBzdHJpbmddOiB7fSB9ID0ge1xyXG4gICAgbGVmdDoge30sXHJcbiAgICBjZW50ZXI6IHt9LFxyXG4gICAgcmlnaHQ6IHt9XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBfcm93RGlmZmVyOiBLZXlWYWx1ZURpZmZlcjx7fSwge30+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxyXG4gICAgQFNraXBTZWxmKCkgcHJpdmF0ZSBzY3JvbGxiYXJIZWxwZXI6IFNjcm9sbGJhckhlbHBlcixcclxuICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgZWxlbWVudDogRWxlbWVudFJlZlxyXG4gICkge1xyXG4gICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudDtcclxuICAgIHRoaXMuX3Jvd0RpZmZlciA9IGRpZmZlcnMuZmluZCh7fSkuY3JlYXRlKCk7XHJcbiAgfVxyXG5cclxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fcm93RGlmZmVyLmRpZmYodGhpcy5yb3cpKSB7XHJcbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0cmFja0J5R3JvdXBzKGluZGV4OiBudW1iZXIsIGNvbEdyb3VwOiBhbnkpOiBhbnkge1xyXG4gICAgcmV0dXJuIGNvbEdyb3VwLnR5cGU7XHJcbiAgfVxyXG5cclxuICBjb2x1bW5UcmFja2luZ0ZuKGluZGV4OiBudW1iZXIsIGNvbHVtbjogYW55KTogYW55IHtcclxuICAgIHJldHVybiBjb2x1bW4uJCRpZDtcclxuICB9XHJcblxyXG4gIGJ1aWxkU3R5bGVzQnlHcm91cCgpIHtcclxuICAgIHRoaXMuX2dyb3VwU3R5bGVzLmxlZnQgPSB0aGlzLmNhbGNTdHlsZXNCeUdyb3VwKCdsZWZ0Jyk7XHJcbiAgICB0aGlzLl9ncm91cFN0eWxlcy5jZW50ZXIgPSB0aGlzLmNhbGNTdHlsZXNCeUdyb3VwKCdjZW50ZXInKTtcclxuICAgIHRoaXMuX2dyb3VwU3R5bGVzLnJpZ2h0ID0gdGhpcy5jYWxjU3R5bGVzQnlHcm91cCgncmlnaHQnKTtcclxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgfVxyXG5cclxuICBjYWxjU3R5bGVzQnlHcm91cChncm91cDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB3aWR0aHMgPSB0aGlzLl9jb2x1bW5Hcm91cFdpZHRocztcclxuICAgIGNvbnN0IG9mZnNldFggPSB0aGlzLm9mZnNldFg7XHJcblxyXG4gICAgY29uc3Qgc3R5bGVzID0ge1xyXG4gICAgICB3aWR0aDogYCR7d2lkdGhzW2dyb3VwXX1weGBcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGdyb3VwID09PSAnbGVmdCcpIHtcclxuICAgICAgdHJhbnNsYXRlWFkoc3R5bGVzLCBvZmZzZXRYLCAwKTtcclxuICAgIH0gZWxzZSBpZiAoZ3JvdXAgPT09ICdyaWdodCcpIHtcclxuICAgICAgY29uc3QgYm9keVdpZHRoID0gcGFyc2VJbnQodGhpcy5pbm5lcldpZHRoICsgJycsIDApO1xyXG4gICAgICBjb25zdCB0b3RhbERpZmYgPSB3aWR0aHMudG90YWwgLSBib2R5V2lkdGg7XHJcbiAgICAgIGNvbnN0IG9mZnNldERpZmYgPSB0b3RhbERpZmYgLSBvZmZzZXRYO1xyXG4gICAgICBjb25zdCBvZmZzZXQgPSAoKG9mZnNldERpZmYgKyB0aGlzLnNjcm9sbGJhckhlbHBlci53aWR0aCkgKiAtMSkgKzE3O1xyXG4gICAgICB0cmFuc2xhdGVYWShzdHlsZXMsIG9mZnNldCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0eWxlcztcclxuICB9XHJcblxyXG4gIG9uQWN0aXZhdGUoZXZlbnQ6IGFueSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgZXZlbnQuY2VsbEluZGV4ID0gaW5kZXg7XHJcbiAgICBldmVudC5yb3dFbGVtZW50ID0gdGhpcy5fZWxlbWVudDtcclxuICAgIHRoaXMuYWN0aXZhdGUuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcclxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xyXG4gICAgY29uc3QgaXNUYXJnZXRSb3cgPSBldmVudC50YXJnZXQgPT09IHRoaXMuX2VsZW1lbnQ7XHJcblxyXG4gICAgY29uc3QgaXNBY3Rpb24gPVxyXG4gICAgICBrZXlDb2RlID09PSBLZXlzLnJldHVybiB8fFxyXG4gICAgICBrZXlDb2RlID09PSBLZXlzLmRvd24gfHxcclxuICAgICAga2V5Q29kZSA9PT0gS2V5cy51cCB8fFxyXG4gICAgICBrZXlDb2RlID09PSBLZXlzLmxlZnQgfHxcclxuICAgICAga2V5Q29kZSA9PT0gS2V5cy5yaWdodDtcclxuXHJcbiAgICBpZiAoaXNBY3Rpb24gJiYgaXNUYXJnZXRSb3cpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICB0aGlzLmFjdGl2YXRlLmVtaXQoe1xyXG4gICAgICAgIHR5cGU6ICdrZXlkb3duJyxcclxuICAgICAgICBldmVudCxcclxuICAgICAgICByb3c6IHRoaXMucm93LFxyXG4gICAgICAgIHJvd0VsZW1lbnQ6IHRoaXMuX2VsZW1lbnRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlZW50ZXIoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHtcclxuICAgICAgdHlwZTogJ21vdXNlZW50ZXInLFxyXG4gICAgICBldmVudCxcclxuICAgICAgcm93OiB0aGlzLnJvdyxcclxuICAgICAgcm93RWxlbWVudDogdGhpcy5fZWxlbWVudFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZWNhbGN1bGF0ZUNvbHVtbnModmFsOiBhbnlbXSA9IHRoaXMuY29sdW1ucyk6IHZvaWQge1xyXG4gICAgdGhpcy5fY29sdW1ucyA9IHZhbDtcclxuICAgIGNvbnN0IGNvbHNCeVBpbiA9IGNvbHVtbnNCeVBpbih0aGlzLl9jb2x1bW5zKTtcclxuICAgIHRoaXMuX2NvbHVtbnNCeVBpbiA9IGNvbHVtbnNCeVBpbkFycih0aGlzLl9jb2x1bW5zKTtcclxuICAgIHRoaXMuX2NvbHVtbkdyb3VwV2lkdGhzID0gY29sdW1uR3JvdXBXaWR0aHMoY29sc0J5UGluLCB0aGlzLl9jb2x1bW5zKTtcclxuICB9XHJcblxyXG4gIG9uVHJlZUFjdGlvbigpIHtcclxuICAgIHRoaXMudHJlZUFjdGlvbi5lbWl0KCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==