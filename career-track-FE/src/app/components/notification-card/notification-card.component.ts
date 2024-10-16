import { Component, Input, OnInit } from '@angular/core';
import { NotificationData, Notifications } from '../../interfaces/backend-requests';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NotificationService } from '../../services/notifications/notifications-service.service';


@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent {
  @Input() card: NotificationData ={
    id:'',
    receiverID: [],
    name: '',
    entityTypeName: '',
    date: new Date,
    seen: false
  };

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit(): void {

  }
  markAsRead(notificationId: string) {

    this.notificationService.markAsRead(notificationId).subscribe(response => {

      this.card.seen = true;
    });
  }
}
