import { Post } from '@models/posts';

export interface ProfileProviderProps {
    isMyProfile: boolean | undefined;
    profileUsername: string;
    PrevScreenName:any[],
    children: React.ReactNode;
}

export interface ProfileContextValue {
    isMyProfile: boolean | undefined;
    username: string | undefined;
    onFetchPosts: () => Promise<void>;
    onFetchPlans: () => Promise<void>;
    posts: Post[] | []; // TODO: Define post type
    plans: any[];
    PrevScreenName:any[] | undefined;
}

export const defaultProfileContextValue: ProfileContextValue = {
    isMyProfile: undefined,
    username: undefined,
    onFetchPosts: async () => {},
    onFetchPlans: async () => {},
    posts: [],
    plans: [],
    PrevScreenName:undefined
}