import * as _ from 'lodash';

export interface TreeItem {
    text: string;
    value: any;
    disabled?: boolean;
    checked?: boolean;
    collapsed?: boolean;
    children?: TreeItem[];
}

export class TreeviewItem {
    private internalDisabled = false;
    private internalChecked = true;
    private internalCollapsed = false;
    private internalChildren: TreeviewItem[];
    text: string;
    value: any;

    constructor(item: TreeItem, autoCorrectChecked = false) {
        if (_.isNil(item)) {
            throw new Error('Item must be defined');
        }
        if (_.isString(item.text)) {
            this.text = item.text;
        } else {
            throw new Error('A text of item must be string object');
        }
        this.value = item.value;
        if (_.isBoolean(item.checked)) {
            this.checked = item.checked;
        }
        if (_.isBoolean(item.collapsed)) {
            this.collapsed = item.collapsed;
        }
        if (_.isBoolean(item.disabled)) {
            this.disabled = item.disabled;
        }
        if (this.disabled === true && this.checked === false) {
            throw new Error('A disabled item must be checked');
        }
        if (!_.isNil(item.children)) {
            this.children = item.children.map(child => {
                if (this.disabled === true) {
                    child.disabled = true;
                }

                return new TreeviewItem(child);
            });
        }

        if (autoCorrectChecked) {
            this.correctChecked();
        }
    }

    get checked(): boolean {
        return this.internalChecked;
    }

    set checked(value: boolean) {
        if (!this.internalDisabled) {
            if (this.internalChecked !== value) {
                this.internalChecked = value;
            }
        }
    }

    setCheckedRecursive(value: boolean) {
        if (!this.internalDisabled) {
            this.internalChecked = value;
            if (!_.isNil(this.internalChildren)) {
                this.internalChildren.forEach(child => child.setCheckedRecursive(value));
            }
        }
    }

    get disabled(): boolean {
        return this.internalDisabled;
    }

    set disabled(value: boolean) {
        if (this.internalDisabled !== value) {
            this.internalDisabled = value;
            if (!_.isNil(this.internalChildren)) {
                this.internalChildren.forEach(child => child.disabled = value);
            }
        }
    }

    get collapsed(): boolean {
        return this.internalCollapsed;
    }

    set collapsed(value: boolean) {
        if (this.internalCollapsed !== value) {
            this.internalCollapsed = value;
        }
    }

    setCollapsedRecursive(value: boolean) {
        this.internalCollapsed = value;
        if (!_.isNil(this.internalChildren)) {
            this.internalChildren.forEach(child => child.setCollapsedRecursive(value));
        }
    }

    get children(): TreeviewItem[] {
        return this.internalChildren;
    }

    set children(value: TreeviewItem[]) {
        if (this.internalChildren !== value) {
            if (!_.isNil(value) && value.length === 0) {
                throw new Error('Children must be not an empty array');
            }
            this.internalChildren = value;
            if (!_.isNil(this.internalChildren)) {
                let checked = true;
                this.internalChildren.forEach(child => {
                    if (child.checked === false) {
                        checked = false;
                    }
                });
                this.internalChecked = checked;
            }
        }
    }

    getCheckedItems(onlyLeafNode = true): TreeviewItem[] {
        let checkedItems: TreeviewItem[] = [];
        if (_.isNil(this.internalChildren)) {
            if (this.internalChecked) {
                checkedItems.push(this);
            }
        } else {
            if(!onlyLeafNode&&this.internalChecked){
                checkedItems.push(this);
            }
            for (const child of this.internalChildren) {
                    checkedItems = _.concat(checkedItems, child.getCheckedItems(onlyLeafNode));
                }
        }

        return checkedItems;
    }

    correctChecked() {
        this.internalChecked = this.getCorrectChecked();
    }

    private getCorrectChecked(): boolean {
        let checked = this.checked;
        if (!_.isNil(this.internalChildren)) {
            checked = true;
            for (const child of this.internalChildren) {
                child.internalChecked = child.getCorrectChecked();
                if (!child.internalChecked) {
                    checked = false;
                    break;
                }
            }
        }

        return checked;
    }
}
