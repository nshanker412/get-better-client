interface BaseNotification {
    content: string;
    timestamp: number;
  }
  
  interface LikeNotification extends BaseNotification {
    linkUsername: string;
    postID: string;
  }
  
  interface ChallengeNotification extends BaseNotification {
    challenge: string;
  }
  
  interface CommentNotification extends LikeNotification {
    // This could include additional properties specific to comments if needed
  }
  
  // This could be a union type if notifications can only be one of these types at a time
  type Notification = LikeNotification | ChallengeNotification | CommentNotification;
  
export   interface NotificationsResponse {
    notifications: Notification[];
}
  
export interface Unread {
    lastNotificationReadTime: number;
    unreadNotifications: Notification[];
    unreadNum: number;
}

