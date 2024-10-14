import { SharedDataService } from './../../services/shared-data/shared-data.service';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { map, mergeMap, Subject, takeUntil, tap } from 'rxjs';
import { NotificationData, Notifications, UserResponse,LearningResp } from '../../interfaces/backend-requests';
import { NotificationService } from '../../services/notifications/notifications-service';
import { read } from '@popperjs/core';
import { CookieService } from 'ngx-cookie-service';
import { NotificationCardComponent } from "../../components/notification-card/notification-card.component";
import { User } from '../../interfaces/user.model';

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

    }

    read() {

    }

    ngOnDestroy() {
      this.$onDestroy.next();
      this.$onDestroy.complete();
    }


  }
