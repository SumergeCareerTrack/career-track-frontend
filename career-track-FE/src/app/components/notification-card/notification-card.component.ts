import { Component, Input, OnInit } from '@angular/core';
import { NotificationData, Notifications } from '../../interfaces/backend-requests';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent {
  @Input() card: NotificationData ={
    receiverID: [],
    name: '',
    entityTypeName: '',
    date: '',
    seen: false
  };

  constructor() {
  }

  ngOnInit(): void {}
}
