﻿import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { TreeviewItem } from './treeview-item';
import { TreeviewItemTemplateContext } from './treeview-item-template-context';

@Component({
    selector: 'ngx-treeview-item',
    templateUrl: './treeview-item.component.html',
    styleUrls: ['./treeview-item.component.scss']
})
export class TreeviewItemComponent {
    @Input() template: TemplateRef<TreeviewItemTemplateContext>;
    @Input() item: TreeviewItem;
    @Output() checkedChange = new EventEmitter<boolean>();

    onCollapseExpand = () => {
        this.item.collapsed = !this.item.collapsed;
    }

    onCheckedChange = () => {
        const checked = this.item.checked;
        if (!_.isNil(this.item.children)) {
            this.item.children.forEach(child => child.setCheckedRecursive(checked));
        }

        this.checkedChange.emit(checked);
    }

    onChildCheckedChange(child: TreeviewItem, checked: boolean) {
        if (this.item.checked !== checked) {
            let itemChecked = false;
            for (const tmpChild of this.item.children) {
                if (tmpChild.checked) {
                    itemChecked = true;
                    break;
                }
            }

             this.item.checked = itemChecked;
         }


         this.checkedChange.emit(checked);
    }
}
