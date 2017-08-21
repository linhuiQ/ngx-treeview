import { Injectable } from '@angular/core';

@Injectable()
export class TreeviewConfig {
    hasAllCheckBox = true;
    hasFilter = false;
    hasCollapseExpand = false;
    maxHeight = 500;
    onlyLeafNode = true;

    get hasDivider(): boolean {
        return this.hasFilter || this.hasAllCheckBox || this.hasCollapseExpand;
    }

    public static create(fields?: {
        hasAllCheckBox?: boolean,
        hasFilter?: boolean,
        hasCollapseExpand?: boolean,
        maxHeight?: number,
        onlyLeafNode?:boolean
    }): TreeviewConfig {
        fields.hasFilter=false;//屏蔽掉filter,与现有逻辑冲突
        const config = new TreeviewConfig();
        Object.assign(config, fields);
        return config;
    }
}
