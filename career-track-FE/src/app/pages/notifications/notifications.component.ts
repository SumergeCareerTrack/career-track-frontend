import { SharedDataService } from './../../services/shared-data/shared-data.service';
import { Component } from '@angular/core';
import { Subject} from 'rxjs';
import { NotificationData, Notifications, UserResponse } from '../../interfaces/backend-requests';
import { NotificationService } from '../../services/notifications/notifications-service';
import { CookieService } from 'ngx-cookie-service';
import { NotificationCardComponent } from "../../components/notification-card/notification-card.component";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NotificationCardComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

    data: Notifications[] = [];
    cards : NotificationData[] = [];
    notificationsNum: number = 0;
    user: UserResponse | undefined;
    $onDestroy: Subject<void> = new Subject<void>();

    constructor(public sharedDataService: SharedDataService,public notificationService: NotificationService,
      public cookieService: CookieService) {
        const userData = this.cookieService.get('UserData');
        this.user= JSON.parse(userData);


    }

    ngOnInit(): void {
      this.notificationService.getNotificationByUserId(this.user!.id).subscribe({
        next: (response) => {
          this.data = response as Notifications[];
          this.notificationsNum = this.data.length;
          this.data.forEach((notification) => {
            this.notificationService.fromNotificationToData(notification).then((card) => {this.cards.push(card)});
          });
      }
    });
    }

    read() {

    }

    ngOnDestroy() {
      this.$onDestroy.next();
      this.$onDestroy.complete();
    }


  }
