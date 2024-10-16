import { SharedDataService } from './../../services/shared-data/shared-data.service';
import { Component } from '@angular/core';
import { Subject} from 'rxjs';
import { NotificationData, Notifications, UserResponse } from '../../interfaces/backend-requests';
import { NotificationService } from '../../services/notifications/notifications-service.service';
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
          this.notificationsNum = this.data.reduce((count, element) => !element.seen ? count + 1 : count, 0);
          this.data.forEach((notification) => {
            this.notificationService.fromNotificationToData(notification).then((card) => {this.cards.push(card)});
          });
          console.log(this.data,"data");
      }
    });

    }


    read() {
        this.notificationService.markAllAsRead(this.user!.id).subscribe({
          next: (response) => {
            this.notificationsNum = 0;
            this.cards.forEach((card) => {card.seen = true;});
          }
        })
    }

    ngOnDestroy() {
      this.$onDestroy.next();
      this.$onDestroy.complete();
    }


  }
