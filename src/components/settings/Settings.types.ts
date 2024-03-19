export type MenuItem = 'aboutMe' | 'spaceAPI' | 'help' | 'theme' | 'review';


export interface SettingsListItemProps {
  item: MenuItem;
  isFirstElement?: boolean;
  isLastElement?: boolean;
}

export interface SettingsListProps {
    data: MenuItem[];
}
    
export interface SettingsListSectionHeaderProps{
    icon: JSX.Element;
  title: string;
}