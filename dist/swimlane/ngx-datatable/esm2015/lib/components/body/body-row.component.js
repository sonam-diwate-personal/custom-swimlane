/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, HostBinding, ElementRef, Output, KeyValueDiffers, EventEmitter, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, SkipSelf } from '@angular/core';
import { columnsByPin, columnGroupWidths, columnsByPinArr } from '../../utils/column';
import { Keys } from '../../utils/keys';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import { translateXY } from '../../utils/translate';
export class DataTableBodyRowComponent {
    /**
     * @param {?} differs
     * @param {?} scrollbarHelper
     * @param {?} cd
     * @param {?} element
     */
    constructor(differs, scrollbarHelper, cd, element) {
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
    /**
     * @param {?} val
     * @return {?}
     */
    set columns(val) {
        this._columns = val;
        this.recalculateColumns(val);
        this.buildStylesByGroup();
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
    set innerWidth(val) {
        if (this._columns) {
            /** @type {?} */
            const colByPin = columnsByPin(this._columns);
            this._columnGroupWidths = columnGroupWidths(colByPin, this._columns);
        }
        this._innerWidth = val;
        this.recalculateColumns();
        this.buildStylesByGroup();
    }
    /**
     * @return {?}
     */
    get innerWidth() {
        return this._innerWidth;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetX(val) {
        this._offsetX = val;
        this.buildStylesByGroup();
    }
    /**
     * @return {?}
     */
    get offsetX() {
        return this._offsetX;
    }
    /**
     * @return {?}
     */
    get cssClass() {
        /** @type {?} */
        let cls = 'datatable-body-row';
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
            const res = this.rowClass(this.row);
            if (typeof res === 'string') {
                cls += ` ${res}`;
            }
            else if (typeof res === 'object') {
                /** @type {?} */
                const keys = Object.keys(res);
                for (const k of keys) {
                    if (res[k] === true) {
                        cls += ` ${k}`;
                    }
                }
            }
        }
        return cls;
    }
    /**
     * @return {?}
     */
    get columnsTotalWidths() {
        return this._columnGroupWidths.total;
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this._rowDiffer.diff(this.row)) {
            this.cd.markForCheck();
        }
    }
    /**
     * @param {?} index
     * @param {?} colGroup
     * @return {?}
     */
    trackByGroups(index, colGroup) {
        return colGroup.type;
    }
    /**
     * @param {?} index
     * @param {?} column
     * @return {?}
     */
    columnTrackingFn(index, column) {
        return column.$$id;
    }
    /**
     * @return {?}
     */
    buildStylesByGroup() {
        this._groupStyles.left = this.calcStylesByGroup('left');
        this._groupStyles.center = this.calcStylesByGroup('center');
        this._groupStyles.right = this.calcStylesByGroup('right');
        this.cd.markForCheck();
    }
    /**
     * @param {?} group
     * @return {?}
     */
    calcStylesByGroup(group) {
        /** @type {?} */
        const widths = this._columnGroupWidths;
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
            const offset = ((offsetDiff + this.scrollbarHelper.width) * -1) + 17;
            translateXY(styles, offset, 0);
        }
        return styles;
    }
    /**
     * @param {?} event
     * @param {?} index
     * @return {?}
     */
    onActivate(event, index) {
        event.cellIndex = index;
        event.rowElement = this._element;
        this.activate.emit(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeyDown(event) {
        /** @type {?} */
        const keyCode = event.keyCode;
        /** @type {?} */
        const isTargetRow = event.target === this._element;
        /** @type {?} */
        const isAction = keyCode === Keys.return ||
            keyCode === Keys.down ||
            keyCode === Keys.up ||
            keyCode === Keys.left ||
            keyCode === Keys.right;
        if (isAction && isTargetRow) {
            event.preventDefault();
            event.stopPropagation();
            this.activate.emit({
                type: 'keydown',
                event,
                row: this.row,
                rowElement: this._element
            });
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseenter(event) {
        this.activate.emit({
            type: 'mouseenter',
            event,
            row: this.row,
            rowElement: this._element
        });
    }
    /**
     * @param {?=} val
     * @return {?}
     */
    recalculateColumns(val = this.columns) {
        this._columns = val;
        /** @type {?} */
        const colsByPin = columnsByPin(this._columns);
        this._columnsByPin = columnsByPinArr(this._columns);
        this._columnGroupWidths = columnGroupWidths(colsByPin, this._columns);
    }
    /**
     * @return {?}
     */
    onTreeAction() {
        this.treeAction.emit();
    }
}
DataTableBodyRowComponent.decorators = [
    { type: Component, args: [{
                selector: 'datatable-body-row',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `
    <div
      *ngFor="let colGroup of _columnsByPin; let i = index; trackBy: trackByGroups"
      class="datatable-row-{{ colGroup.type }} datatable-row-group"
      [ngStyle]="_groupStyles[colGroup.type]"
    >
      <datatable-body-cell
        *ngFor="let column of colGroup.columns; let ii = index; trackBy: columnTrackingFn"
        tabindex="-1"
        [row]="row"
        [group]="group"
        [expanded]="expanded"
        [isSelected]="isSelected"
        [rowIndex]="rowIndex"
        [column]="column"
        [rowHeight]="rowHeight"
        [displayCheck]="displayCheck"
        [treeStatus]="treeStatus"
        (activate)="onActivate($event, ii)"
        (treeAction)="onTreeAction()"
      >
      </datatable-body-cell>
    </div>
  `
            }] }
];
/** @nocollapse */
DataTableBodyRowComponent.ctorParameters = () => [
    { type: KeyValueDiffers },
    { type: ScrollbarHelper, decorators: [{ type: SkipSelf }] },
    { type: ChangeDetectorRef },
    { type: ElementRef }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1yb3cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ib2R5L2JvZHktcm93LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsV0FBVyxFQUNYLFVBQVUsRUFDVixNQUFNLEVBQ04sZUFBZSxFQUVmLFlBQVksRUFDWixZQUFZLEVBQ1osdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUVqQixRQUFRLEVBQ1QsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQThCcEQsTUFBTSxPQUFPLHlCQUF5Qjs7Ozs7OztJQW9HcEMsWUFDVSxPQUF3QixFQUNaLGVBQWdDLEVBQzVDLEVBQXFCLEVBQzdCLE9BQW1CO1FBSFgsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDWixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDNUMsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUF0RXRCLGVBQVUsR0FBZSxXQUFXLENBQUM7UUFrRHBDLGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqRCxlQUFVLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFRN0QsaUJBQVksR0FBMkI7WUFDckMsSUFBSSxFQUFFLEVBQUU7WUFDUixNQUFNLEVBQUUsRUFBRTtZQUNWLEtBQUssRUFBRSxFQUFFO1NBQ1YsQ0FBQztRQVVBLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFD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LFFBQVEsQ0FBQzs7OztJQTdKdEMsNkNBQTJCOztJQUMzQiw2Q0FBdUI7O0lBQ3ZCLHdDQUFrQjs7SUFDbEIsMENBQW9COztJQUNwQiwrQ0FBNkI7O0lBQzdCLDZDQUEwQjs7SUFDMUIsaURBQTJCOztJQUMzQiwrQ0FBOEM7O0lBeUM5Qyw4Q0FFa0I7O0lBT2xCLDZDQUEyRDs7SUFDM0QsK0NBQTZEOztJQUU3RCw2Q0FBYzs7SUFDZCx1REFBd0I7O0lBQ3hCLGtEQUFtQjs7SUFDbkIsNkNBQWlCOztJQUNqQiw2Q0FBZ0I7O0lBQ2hCLGdEQUFvQjs7SUFDcEIsaURBSUU7Ozs7O0lBRUYsK0NBQTJDOzs7OztJQUd6Qyw0Q0FBZ0M7Ozs7O0lBQ2hDLG9EQUFvRDs7Ozs7SUFDcEQsdUNBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgSW5wdXQsXHJcbiAgSG9zdEJpbmRpbmcsXHJcbiAgRWxlbWVudFJlZixcclxuICBPdXRwdXQsXHJcbiAgS2V5VmFsdWVEaWZmZXJzLFxyXG4gIEtleVZhbHVlRGlmZmVyLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgRG9DaGVjayxcclxuICBTa2lwU2VsZlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgVHJlZVN0YXR1cyB9IGZyb20gJy4vYm9keS1jZWxsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IGNvbHVtbnNCeVBpbiwgY29sdW1uR3JvdXBXaWR0aHMsIGNvbHVtbnNCeVBpbkFyciB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbHVtbic7XHJcbmltcG9ydCB7IEtleXMgfSBmcm9tICcuLi8uLi91dGlscy9rZXlzJztcclxuaW1wb3J0IHsgU2Nyb2xsYmFySGVscGVyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvc2Nyb2xsYmFyLWhlbHBlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgdHJhbnNsYXRlWFkgfSBmcm9tICcuLi8uLi91dGlscy90cmFuc2xhdGUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdkYXRhdGFibGUtYm9keS1yb3cnLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2XHJcbiAgICAgICpuZ0Zvcj1cImxldCBjb2xHcm91cCBvZiBfY29sdW1uc0J5UGluOyBsZXQgaSA9IGluZGV4OyB0cmFja0J5OiB0cmFja0J5R3JvdXBzXCJcclxuICAgICAgY2xhc3M9XCJkYXRhdGFibGUtcm93LXt7IGNvbEdyb3VwLnR5cGUgfX0gZGF0YXRhYmxlLXJvdy1ncm91cFwiXHJcbiAgICAgIFtuZ1N0eWxlXT1cIl9ncm91cFN0eWxlc1tjb2xHcm91cC50eXBlXVwiXHJcbiAgICA+XHJcbiAgICAgIDxkYXRhdGFibGUtYm9keS1jZWxsXHJcbiAgICAgICAgKm5nRm9yPVwibGV0IGNvbHVtbiBvZiBjb2xHcm91cC5jb2x1bW5zOyBsZXQgaWkgPSBpbmRleDsgdHJhY2tCeTogY29sdW1uVHJhY2tpbmdGblwiXHJcbiAgICAgICAgdGFiaW5kZXg9XCItMVwiXHJcbiAgICAgICAgW3Jvd109XCJyb3dcIlxyXG4gICAgICAgIFtncm91cF09XCJncm91cFwiXHJcbiAgICAgICAgW2V4cGFuZGVkXT1cImV4cGFuZGVkXCJcclxuICAgICAgICBbaXNTZWxlY3RlZF09XCJpc1NlbGVjdGVkXCJcclxuICAgICAgICBbcm93SW5kZXhdPVwicm93SW5kZXhcIlxyXG4gICAgICAgIFtjb2x1bW5dPVwiY29sdW1uXCJcclxuICAgICAgICBbcm93SGVpZ2h0XT1cInJvd0hlaWdodFwiXHJcbiAgICAgICAgW2Rpc3BsYXlDaGVja109XCJkaXNwbGF5Q2hlY2tcIlxyXG4gICAgICAgIFt0cmVlU3RhdHVzXT1cInRyZWVTdGF0dXNcIlxyXG4gICAgICAgIChhY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudCwgaWkpXCJcclxuICAgICAgICAodHJlZUFjdGlvbik9XCJvblRyZWVBY3Rpb24oKVwiXHJcbiAgICAgID5cclxuICAgICAgPC9kYXRhdGFibGUtYm9keS1jZWxsPlxyXG4gICAgPC9kaXY+XHJcbiAgYFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YVRhYmxlQm9keVJvd0NvbXBvbmVudCBpbXBsZW1lbnRzIERvQ2hlY2sge1xyXG4gIEBJbnB1dCgpIHNldCBjb2x1bW5zKHZhbDogYW55W10pIHtcclxuICAgIHRoaXMuX2NvbHVtbnMgPSB2YWw7XHJcbiAgICB0aGlzLnJlY2FsY3VsYXRlQ29sdW1ucyh2YWwpO1xyXG4gICAgdGhpcy5idWlsZFN0eWxlc0J5R3JvdXAoKTtcclxuICB9XHJcblxyXG4gIGdldCBjb2x1bW5zKCk6IGFueVtdIHtcclxuICAgIHJldHVybiB0aGlzLl9jb2x1bW5zO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KCkgc2V0IGlubmVyV2lkdGgodmFsOiBudW1iZXIpIHtcclxuICAgIGlmICh0aGlzLl9jb2x1bW5zKSB7XHJcbiAgICAgIGNvbnN0IGNvbEJ5UGluID0gY29sdW1uc0J5UGluKHRoaXMuX2NvbHVtbnMpO1xyXG4gICAgICB0aGlzLl9jb2x1bW5Hcm91cFdpZHRocyA9IGNvbHVtbkdyb3VwV2lkdGhzKGNvbEJ5UGluLCB0aGlzLl9jb2x1bW5zKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9pbm5lcldpZHRoID0gdmFsO1xyXG4gICAgdGhpcy5yZWNhbGN1bGF0ZUNvbHVtbnMoKTtcclxuICAgIHRoaXMuYnVpbGRTdHlsZXNCeUdyb3VwKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgaW5uZXJXaWR0aCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lubmVyV2lkdGg7XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKSBleHBhbmRlZDogYm9vbGVhbjtcclxuICBASW5wdXQoKSByb3dDbGFzczogYW55O1xyXG4gIEBJbnB1dCgpIHJvdzogYW55O1xyXG4gIEBJbnB1dCgpIGdyb3VwOiBhbnk7XHJcbiAgQElucHV0KCkgaXNTZWxlY3RlZDogYm9vbGVhbjtcclxuICBASW5wdXQoKSByb3dJbmRleDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIGRpc3BsYXlDaGVjazogYW55O1xyXG4gIEBJbnB1dCgpIHRyZWVTdGF0dXM6IFRyZWVTdGF0dXMgPSAnY29sbGFwc2VkJztcclxuXHJcbiAgQElucHV0KClcclxuICBzZXQgb2Zmc2V0WCh2YWw6IG51bWJlcikge1xyXG4gICAgdGhpcy5fb2Zmc2V0WCA9IHZhbDtcclxuICAgIHRoaXMuYnVpbGRTdHlsZXNCeUdyb3VwKCk7XHJcbiAgfVxyXG4gIGdldCBvZmZzZXRYKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX29mZnNldFg7XHJcbiAgfVxyXG5cclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcclxuICBnZXQgY3NzQ2xhc3MoKSB7XHJcbiAgICBsZXQgY2xzID0gJ2RhdGF0YWJsZS1ib2R5LXJvdyc7XHJcbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNscyArPSAnIGFjdGl2ZSc7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5yb3dJbmRleCAlIDIgIT09IDApIHtcclxuICAgICAgY2xzICs9ICcgZGF0YXRhYmxlLXJvdy1vZGQnO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMucm93SW5kZXggJSAyID09PSAwKSB7XHJcbiAgICAgIGNscyArPSAnIGRhdGF0YWJsZS1yb3ctZXZlbic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucm93Q2xhc3MpIHtcclxuICAgICAgY29uc3QgcmVzID0gdGhpcy5yb3dDbGFzcyh0aGlzLnJvdyk7XHJcbiAgICAgIGlmICh0eXBlb2YgcmVzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGNscyArPSBgICR7cmVzfWA7XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlcyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocmVzKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGsgb2Yga2V5cykge1xyXG4gICAgICAgICAgaWYgKHJlc1trXSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBjbHMgKz0gYCAke2t9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2xzO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQucHgnKVxyXG4gIEBJbnB1dCgpXHJcbiAgcm93SGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgucHgnKVxyXG4gIGdldCBjb2x1bW5zVG90YWxXaWR0aHMoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9jb2x1bW5Hcm91cFdpZHRocy50b3RhbDtcclxuICB9XHJcblxyXG4gIEBPdXRwdXQoKSBhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIHRyZWVBY3Rpb246IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBfZWxlbWVudDogYW55O1xyXG4gIF9jb2x1bW5Hcm91cFdpZHRoczogYW55O1xyXG4gIF9jb2x1bW5zQnlQaW46IGFueTtcclxuICBfb2Zmc2V0WDogbnVtYmVyO1xyXG4gIF9jb2x1bW5zOiBhbnlbXTtcclxuICBfaW5uZXJXaWR0aDogbnVtYmVyO1xyXG4gIF9ncm91cFN0eWxlczogeyBbcHJvcDogc3RyaW5nXToge30gfSA9IHtcclxuICAgIGxlZnQ6IHt9LFxyXG4gICAgY2VudGVyOiB7fSxcclxuICAgIHJpZ2h0OiB7fVxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgX3Jvd0RpZmZlcjogS2V5VmFsdWVEaWZmZXI8e30sIHt9PjtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcclxuICAgIEBTa2lwU2VsZigpIHByaXZhdGUgc2Nyb2xsYmFySGVscGVyOiBTY3JvbGxiYXJIZWxwZXIsXHJcbiAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcclxuICAgIGVsZW1lbnQ6IEVsZW1lbnRSZWZcclxuICApIHtcclxuICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICB0aGlzLl9yb3dEaWZmZXIgPSBkaWZmZXJzLmZpbmQoe30pLmNyZWF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuX3Jvd0RpZmZlci5kaWZmKHRoaXMucm93KSkge1xyXG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdHJhY2tCeUdyb3VwcyhpbmRleDogbnVtYmVyLCBjb2xHcm91cDogYW55KTogYW55IHtcclxuICAgIHJldHVybiBjb2xHcm91cC50eXBlO1xyXG4gIH1cclxuXHJcbiAgY29sdW1uVHJhY2tpbmdGbihpbmRleDogbnVtYmVyLCBjb2x1bW46IGFueSk6IGFueSB7XHJcbiAgICByZXR1cm4gY29sdW1uLiQkaWQ7XHJcbiAgfVxyXG5cclxuICBidWlsZFN0eWxlc0J5R3JvdXAoKSB7XHJcbiAgICB0aGlzLl9ncm91cFN0eWxlcy5sZWZ0ID0gdGhpcy5jYWxjU3R5bGVzQnlHcm91cCgnbGVmdCcpO1xyXG4gICAgdGhpcy5fZ3JvdXBTdHlsZXMuY2VudGVyID0gdGhpcy5jYWxjU3R5bGVzQnlHcm91cCgnY2VudGVyJyk7XHJcbiAgICB0aGlzLl9ncm91cFN0eWxlcy5yaWdodCA9IHRoaXMuY2FsY1N0eWxlc0J5R3JvdXAoJ3JpZ2h0Jyk7XHJcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xyXG4gIH1cclxuXHJcbiAgY2FsY1N0eWxlc0J5R3JvdXAoZ3JvdXA6IHN0cmluZykge1xyXG4gICAgY29uc3Qgd2lkdGhzID0gdGhpcy5fY29sdW1uR3JvdXBXaWR0aHM7XHJcbiAgICBjb25zdCBvZmZzZXRYID0gdGhpcy5vZmZzZXRYO1xyXG5cclxuICAgIGNvbnN0IHN0eWxlcyA9IHtcclxuICAgICAgd2lkdGg6IGAke3dpZHRoc1tncm91cF19cHhgXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChncm91cCA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgIHRyYW5zbGF0ZVhZKHN0eWxlcywgb2Zmc2V0WCwgMCk7XHJcbiAgICB9IGVsc2UgaWYgKGdyb3VwID09PSAncmlnaHQnKSB7XHJcbiAgICAgIGNvbnN0IGJvZHlXaWR0aCA9IHBhcnNlSW50KHRoaXMuaW5uZXJXaWR0aCArICcnLCAwKTtcclxuICAgICAgY29uc3QgdG90YWxEaWZmID0gd2lkdGhzLnRvdGFsIC0gYm9keVdpZHRoO1xyXG4gICAgICBjb25zdCBvZmZzZXREaWZmID0gdG90YWxEaWZmIC0gb2Zmc2V0WDtcclxuICAgICAgY29uc3Qgb2Zmc2V0ID0gKChvZmZzZXREaWZmICsgdGhpcy5zY3JvbGxiYXJIZWxwZXIud2lkdGgpICogLTEpICsxNztcclxuICAgICAgdHJhbnNsYXRlWFkoc3R5bGVzLCBvZmZzZXQsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdHlsZXM7XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2YXRlKGV2ZW50OiBhbnksIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGV2ZW50LmNlbGxJbmRleCA9IGluZGV4O1xyXG4gICAgZXZlbnQucm93RWxlbWVudCA9IHRoaXMuX2VsZW1lbnQ7XHJcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pXHJcbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuICAgIGNvbnN0IGlzVGFyZ2V0Um93ID0gZXZlbnQudGFyZ2V0ID09PSB0aGlzLl9lbGVtZW50O1xyXG5cclxuICAgIGNvbnN0IGlzQWN0aW9uID1cclxuICAgICAga2V5Q29kZSA9PT0gS2V5cy5yZXR1cm4gfHxcclxuICAgICAga2V5Q29kZSA9PT0gS2V5cy5kb3duIHx8XHJcbiAgICAgIGtleUNvZGUgPT09IEtleXMudXAgfHxcclxuICAgICAga2V5Q29kZSA9PT0gS2V5cy5sZWZ0IHx8XHJcbiAgICAgIGtleUNvZGUgPT09IEtleXMucmlnaHQ7XHJcblxyXG4gICAgaWYgKGlzQWN0aW9uICYmIGlzVGFyZ2V0Um93KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHtcclxuICAgICAgICB0eXBlOiAna2V5ZG93bicsXHJcbiAgICAgICAgZXZlbnQsXHJcbiAgICAgICAgcm93OiB0aGlzLnJvdyxcclxuICAgICAgICByb3dFbGVtZW50OiB0aGlzLl9lbGVtZW50XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicsIFsnJGV2ZW50J10pXHJcbiAgb25Nb3VzZWVudGVyKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7XHJcbiAgICAgIHR5cGU6ICdtb3VzZWVudGVyJyxcclxuICAgICAgZXZlbnQsXHJcbiAgICAgIHJvdzogdGhpcy5yb3csXHJcbiAgICAgIHJvd0VsZW1lbnQ6IHRoaXMuX2VsZW1lbnRcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVjYWxjdWxhdGVDb2x1bW5zKHZhbDogYW55W10gPSB0aGlzLmNvbHVtbnMpOiB2b2lkIHtcclxuICAgIHRoaXMuX2NvbHVtbnMgPSB2YWw7XHJcbiAgICBjb25zdCBjb2xzQnlQaW4gPSBjb2x1bW5zQnlQaW4odGhpcy5fY29sdW1ucyk7XHJcbiAgICB0aGlzLl9jb2x1bW5zQnlQaW4gPSBjb2x1bW5zQnlQaW5BcnIodGhpcy5fY29sdW1ucyk7XHJcbiAgICB0aGlzLl9jb2x1bW5Hcm91cFdpZHRocyA9IGNvbHVtbkdyb3VwV2lkdGhzKGNvbHNCeVBpbiwgdGhpcy5fY29sdW1ucyk7XHJcbiAgfVxyXG5cclxuICBvblRyZWVBY3Rpb24oKSB7XHJcbiAgICB0aGlzLnRyZWVBY3Rpb24uZW1pdCgpO1xyXG4gIH1cclxufVxyXG4iXX0=