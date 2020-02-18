/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, KeyValueDiffers } from '@angular/core';
import { MouseEvent } from '../../events';
var DataTableRowWrapperComponent = /** @class */ (function () {
    function DataTableRowWrapperComponent(cd, differs) {
        this.cd = cd;
        this.differs = differs;
        this.rowContextmenu = new EventEmitter(false);
        this.groupContext = {
            group: this.row,
            expanded: this.expanded,
            rowIndex: this.rowIndex
        };
        this.rowContext = {
            row: this.row,
            expanded: this.expanded,
            rowIndex: this.rowIndex
        };
        this._expanded = false;
        this.rowDiffer = differs.find({}).create();
    }
    Object.defineProperty(DataTableRowWrapperComponent.prototype, "rowIndex", {
        get: /**
         * @return {?}
         */
        function () {
            return this._rowIndex;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._rowIndex = val;
            this.rowContext.rowIndex = val;
            this.groupContext.rowIndex = val;
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableRowWrapperComponent.prototype, "expanded", {
        get: /**
         * @return {?}
         */
        function () {
            return this._expanded;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._expanded = val;
            this.groupContext.expanded = val;
            this.rowContext.expanded = val;
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    DataTableRowWrapperComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this.rowDiffer.diff(this.row)) {
            this.rowContext.row = this.row;
            this.groupContext.group = this.row;
            this.cd.markForCheck();
        }
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    DataTableRowWrapperComponent.prototype.onContextmenu = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        this.rowContextmenu.emit({ event: $event, row: this.row });
    };
    /**
     * @return {?}
     */
    DataTableRowWrapperComponent.prototype.getGroupHeaderStyle = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var styles = {};
        styles['transform'] = 'translate3d(' + this.offsetX + 'px, 0px, 0px)';
        styles['backface-visibility'] = 'hidden';
        styles['width'] = this.innerWidth;
        return styles;
    };
    DataTableRowWrapperComponent.decorators = [
        { type: Component, args: [{
                    selector: 'datatable-row-wrapper',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "\n    <div *ngIf=\"groupHeader && groupHeader.template\" class=\"datatable-group-header\" [ngStyle]=\"getGroupHeaderStyle()\">\n      <ng-template\n        *ngIf=\"groupHeader && groupHeader.template\"\n        [ngTemplateOutlet]=\"groupHeader.template\"\n        [ngTemplateOutletContext]=\"groupContext\"\n      >\n      </ng-template>\n    </div>\n    <ng-content *ngIf=\"(groupHeader && groupHeader.template && expanded) || (!groupHeader || !groupHeader.template)\">\n    </ng-content>\n    <div\n      *ngIf=\"rowDetail && rowDetail.template && expanded\"\n      [style.height.px]=\"detailRowHeight\"\n      class=\"datatable-row-detail\"\n    >\n      <ng-template\n        *ngIf=\"rowDetail && rowDetail.template\"\n        [ngTemplateOutlet]=\"rowDetail.template\"\n        [ngTemplateOutletContext]=\"rowContext\"\n      >\n      </ng-template>\n    </div>\n  ",
                    host: {
                        class: 'datatable-row-wrapper'
                    }
                }] }
    ];
    /** @nocollapse */
    DataTableRowWrapperComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: KeyValueDiffers }
    ]; };
    DataTableRowWrapperComponent.propDecorators = {
        innerWidth: [{ type: Input }],
        rowDetail: [{ type: Input }],
        groupHeader: [{ type: Input }],
        offsetX: [{ type: Input }],
        detailRowHeight: [{ type: Input }],
        row: [{ type: Input }],
        groupedRows: [{ type: Input }],
        rowContextmenu: [{ type: Output }],
        rowIndex: [{ type: Input }],
        expanded: [{ type: Input }],
        onContextmenu: [{ type: HostListener, args: ['contextmenu', ['$event'],] }]
    };
    return DataTableRowWrapperComponent;
}());
export { DataTableRowWrapperComponent };
if (false) {
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.innerWidth;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.rowDetail;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.groupHeader;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.offsetX;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.detailRowHeight;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.row;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.groupedRows;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.rowContextmenu;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.groupContext;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.rowContext;
    /**
     * @type {?}
     * @private
     */
    DataTableRowWrapperComponent.prototype.rowDiffer;
    /**
     * @type {?}
     * @private
     */
    DataTableRowWrapperComponent.prototype._expanded;
    /**
     * @type {?}
     * @private
     */
    DataTableRowWrapperComponent.prototype._rowIndex;
    /**
     * @type {?}
     * @private
     */
    DataTableRowWrapperComponent.prototype.cd;
    /**
     * @type {?}
     * @private
     */
    DataTableRowWrapperComponent.prototype.differs;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1yb3ctd3JhcHBlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2JvZHkvYm9keS1yb3ctd3JhcHBlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osWUFBWSxFQUVaLHVCQUF1QixFQUV2QixpQkFBaUIsRUFDakIsZUFBZSxFQUNoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTFDO0lBK0VFLHNDQUFvQixFQUFxQixFQUFVLE9BQXdCO1FBQXZELE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUF4Q2pFLG1CQUFjLEdBQUcsSUFBSSxZQUFZLENBQWtDLEtBQUssQ0FBQyxDQUFDO1FBd0JwRixpQkFBWSxHQUFRO1lBQ2xCLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRztZQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDeEIsQ0FBQztRQUVGLGVBQVUsR0FBUTtZQUNoQixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQ3hCLENBQUM7UUFHTSxjQUFTLEdBQVksS0FBSyxDQUFDO1FBSWpDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBeENELHNCQUFhLGtEQUFROzs7O1FBT3JCO1lBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hCLENBQUM7Ozs7O1FBVEQsVUFBc0IsR0FBVztZQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztZQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7WUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekIsQ0FBQzs7O09BQUE7SUFNRCxzQkFBYSxrREFBUTs7OztRQU9yQjtZQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDOzs7OztRQVRELFVBQXNCLEdBQVk7WUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztZQUMvQixJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pCLENBQUM7OztPQUFBOzs7O0lBMEJELGdEQUFTOzs7SUFBVDtRQUNFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNuQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQzs7Ozs7SUFHRCxvREFBYTs7OztJQURiLFVBQ2MsTUFBa0I7UUFDOUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM3RCxDQUFDOzs7O0lBRUQsMERBQW1COzs7SUFBbkI7O1lBQ1EsTUFBTSxHQUFHLEVBQUU7UUFFakIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQztRQUN0RSxNQUFNLENBQUMscUJBQXFCLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDekMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFFbEMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7Z0JBeEdGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsdUJBQXVCO29CQUNqQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsUUFBUSxFQUFFLHUyQkF1QlQ7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLEtBQUssRUFBRSx1QkFBdUI7cUJBQy9CO2lCQUNGOzs7O2dCQW5DQyxpQkFBaUI7Z0JBQ2pCLGVBQWU7Ozs2QkFvQ2QsS0FBSzs0QkFDTCxLQUFLOzhCQUNMLEtBQUs7MEJBQ0wsS0FBSztrQ0FDTCxLQUFLO3NCQUNMLEtBQUs7OEJBQ0wsS0FBSztpQ0FDTCxNQUFNOzJCQUVOLEtBQUs7MkJBV0wsS0FBSztnQ0F1Q0wsWUFBWSxTQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7SUFjekMsbUNBQUM7Q0FBQSxBQXpHRCxJQXlHQztTQTFFWSw0QkFBNEI7OztJQUN2QyxrREFBNEI7O0lBQzVCLGlEQUF3Qjs7SUFDeEIsbURBQTBCOztJQUMxQiwrQ0FBeUI7O0lBQ3pCLHVEQUE4Qjs7SUFDOUIsMkNBQWtCOztJQUNsQixtREFBMEI7O0lBQzFCLHNEQUFvRjs7SUF3QnBGLG9EQUlFOztJQUVGLGtEQUlFOzs7OztJQUVGLGlEQUEwQzs7Ozs7SUFDMUMsaURBQW1DOzs7OztJQUNuQyxpREFBMEI7Ozs7O0lBRWQsMENBQTZCOzs7OztJQUFFLCtDQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIERvQ2hlY2ssXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgS2V5VmFsdWVEaWZmZXIsXHJcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgS2V5VmFsdWVEaWZmZXJzXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1vdXNlRXZlbnQgfSBmcm9tICcuLi8uLi9ldmVudHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdkYXRhdGFibGUtcm93LXdyYXBwZXInLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2ICpuZ0lmPVwiZ3JvdXBIZWFkZXIgJiYgZ3JvdXBIZWFkZXIudGVtcGxhdGVcIiBjbGFzcz1cImRhdGF0YWJsZS1ncm91cC1oZWFkZXJcIiBbbmdTdHlsZV09XCJnZXRHcm91cEhlYWRlclN0eWxlKClcIj5cclxuICAgICAgPG5nLXRlbXBsYXRlXHJcbiAgICAgICAgKm5nSWY9XCJncm91cEhlYWRlciAmJiBncm91cEhlYWRlci50ZW1wbGF0ZVwiXHJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZ3JvdXBIZWFkZXIudGVtcGxhdGVcIlxyXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJncm91cENvbnRleHRcIlxyXG4gICAgICA+XHJcbiAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxuZy1jb250ZW50ICpuZ0lmPVwiKGdyb3VwSGVhZGVyICYmIGdyb3VwSGVhZGVyLnRlbXBsYXRlICYmIGV4cGFuZGVkKSB8fCAoIWdyb3VwSGVhZGVyIHx8ICFncm91cEhlYWRlci50ZW1wbGF0ZSlcIj5cclxuICAgIDwvbmctY29udGVudD5cclxuICAgIDxkaXZcclxuICAgICAgKm5nSWY9XCJyb3dEZXRhaWwgJiYgcm93RGV0YWlsLnRlbXBsYXRlICYmIGV4cGFuZGVkXCJcclxuICAgICAgW3N0eWxlLmhlaWdodC5weF09XCJkZXRhaWxSb3dIZWlnaHRcIlxyXG4gICAgICBjbGFzcz1cImRhdGF0YWJsZS1yb3ctZGV0YWlsXCJcclxuICAgID5cclxuICAgICAgPG5nLXRlbXBsYXRlXHJcbiAgICAgICAgKm5nSWY9XCJyb3dEZXRhaWwgJiYgcm93RGV0YWlsLnRlbXBsYXRlXCJcclxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJyb3dEZXRhaWwudGVtcGxhdGVcIlxyXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJyb3dDb250ZXh0XCJcclxuICAgICAgPlxyXG4gICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgYCxcclxuICBob3N0OiB7XHJcbiAgICBjbGFzczogJ2RhdGF0YWJsZS1yb3ctd3JhcHBlcidcclxuICB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVSb3dXcmFwcGVyQ29tcG9uZW50IGltcGxlbWVudHMgRG9DaGVjayB7XHJcbiAgQElucHV0KCkgaW5uZXJXaWR0aDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHJvd0RldGFpbDogYW55O1xyXG4gIEBJbnB1dCgpIGdyb3VwSGVhZGVyOiBhbnk7XHJcbiAgQElucHV0KCkgb2Zmc2V0WDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIGRldGFpbFJvd0hlaWdodDogYW55O1xyXG4gIEBJbnB1dCgpIHJvdzogYW55O1xyXG4gIEBJbnB1dCgpIGdyb3VwZWRSb3dzOiBhbnk7XHJcbiAgQE91dHB1dCgpIHJvd0NvbnRleHRtZW51ID0gbmV3IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBNb3VzZUV2ZW50OyByb3c6IGFueSB9PihmYWxzZSk7XHJcblxyXG4gIEBJbnB1dCgpIHNldCByb3dJbmRleCh2YWw6IG51bWJlcikge1xyXG4gICAgdGhpcy5fcm93SW5kZXggPSB2YWw7XHJcbiAgICB0aGlzLnJvd0NvbnRleHQucm93SW5kZXggPSB2YWw7XHJcbiAgICB0aGlzLmdyb3VwQ29udGV4dC5yb3dJbmRleCA9IHZhbDtcclxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgcm93SW5kZXgoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9yb3dJbmRleDtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpIHNldCBleHBhbmRlZCh2YWw6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuX2V4cGFuZGVkID0gdmFsO1xyXG4gICAgdGhpcy5ncm91cENvbnRleHQuZXhwYW5kZWQgPSB2YWw7XHJcbiAgICB0aGlzLnJvd0NvbnRleHQuZXhwYW5kZWQgPSB2YWw7XHJcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGV4cGFuZGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2V4cGFuZGVkO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXBDb250ZXh0OiBhbnkgPSB7XHJcbiAgICBncm91cDogdGhpcy5yb3csXHJcbiAgICBleHBhbmRlZDogdGhpcy5leHBhbmRlZCxcclxuICAgIHJvd0luZGV4OiB0aGlzLnJvd0luZGV4XHJcbiAgfTtcclxuXHJcbiAgcm93Q29udGV4dDogYW55ID0ge1xyXG4gICAgcm93OiB0aGlzLnJvdyxcclxuICAgIGV4cGFuZGVkOiB0aGlzLmV4cGFuZGVkLFxyXG4gICAgcm93SW5kZXg6IHRoaXMucm93SW5kZXhcclxuICB9O1xyXG5cclxuICBwcml2YXRlIHJvd0RpZmZlcjogS2V5VmFsdWVEaWZmZXI8e30sIHt9PjtcclxuICBwcml2YXRlIF9leHBhbmRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHByaXZhdGUgX3Jvd0luZGV4OiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycykge1xyXG4gICAgdGhpcy5yb3dEaWZmZXIgPSBkaWZmZXJzLmZpbmQoe30pLmNyZWF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMucm93RGlmZmVyLmRpZmYodGhpcy5yb3cpKSB7XHJcbiAgICAgIHRoaXMucm93Q29udGV4dC5yb3cgPSB0aGlzLnJvdztcclxuICAgICAgdGhpcy5ncm91cENvbnRleHQuZ3JvdXAgPSB0aGlzLnJvdztcclxuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgWyckZXZlbnQnXSlcclxuICBvbkNvbnRleHRtZW51KCRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5yb3dDb250ZXh0bWVudS5lbWl0KHsgZXZlbnQ6ICRldmVudCwgcm93OiB0aGlzLnJvdyB9KTtcclxuICB9XHJcblxyXG4gIGdldEdyb3VwSGVhZGVyU3R5bGUoKTogYW55IHtcclxuICAgIGNvbnN0IHN0eWxlcyA9IHt9O1xyXG5cclxuICAgIHN0eWxlc1sndHJhbnNmb3JtJ10gPSAndHJhbnNsYXRlM2QoJyArIHRoaXMub2Zmc2V0WCArICdweCwgMHB4LCAwcHgpJztcclxuICAgIHN0eWxlc1snYmFja2ZhY2UtdmlzaWJpbGl0eSddID0gJ2hpZGRlbic7XHJcbiAgICBzdHlsZXNbJ3dpZHRoJ10gPSB0aGlzLmlubmVyV2lkdGg7XHJcblxyXG4gICAgcmV0dXJuIHN0eWxlcztcclxuICB9XHJcbn1cclxuIl19