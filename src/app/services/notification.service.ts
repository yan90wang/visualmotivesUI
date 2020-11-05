import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class NotificationService {
  notifications: string[] = [];

  add(notification: string) {
    this.notifications.push(notification);
  }

  clear() {
    this.notifications = [];
  }
}
