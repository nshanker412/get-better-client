
export interface DropdownItemType {
    label: string;
    value: string;
    search: string;
}
  
export interface BaseDropdownItem {
    label: string;
    value: string;
    icon?: string; // Assuming we want to allow an optional icon for each item
}


export interface DropdownProps<T extends BaseDropdownItem> {
    label: string;
    data: T[];
    onSelectionChange: (value: T) => void;
    styles?: any;
    search?: boolean;
  }