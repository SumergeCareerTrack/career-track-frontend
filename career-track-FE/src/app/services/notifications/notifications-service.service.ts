import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  ArticleResp, LearningResp, NotificationData, Notifications, UserResponse } from '../../interfaces/backend-requests';
import {  firstValueFrom } from 'rxjs';
import { SharedDataService } from '../shared-data/shared-data.service';
import { ArticleService } from '../articles/article-service.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  notificationBaseUrl = 'http://localhost:';
  notificationBasePort= '8090';
  constructor(private httpClient: HttpClient,private sharedDataService:SharedDataService,private articleService:ArticleService) {

  }


  getNotificationByUserId(userId: string,seen?:boolean) {
    return this.httpClient.get(this.notificationBaseUrl+this.notificationBasePort + '/notifications/'+userId)

  }



  setUpAction(notification: Notifications){
    let action=""
    if(notification.name =="REJECTION") {action="Rejected"}
    else if(notification.name =="APPROVAL") {action="Approved"}
    else if(notification.name =="SUBMISSION") {action="Submitted"}
    return action;
  }
  async setUpEntityName(notification:Notifications){
    let entityType="";
    let entityObject: LearningResp|ArticleResp = {} as LearningResp | ArticleResp;
    if(notification.entityTypeName == "LEARNING") {
      entityType = "Learning";
      entityObject=await firstValueFrom(this.sharedDataService.getLearningById(notification.entityId)) as LearningResp;
    }
    else if(notification.entityTypeName == "WIKI") {
      entityType = "Wiki";
      entityObject=await firstValueFrom(this.articleService.getArticleById(notification.entityId)) as ArticleResp;
    }
    //TODO: Have to Finish Wiki Career and Blog after we Merge
    else if(notification.entityTypeName == "CAREER_PACKAGE") { entityType = "Career Package"; }
  else if(notification.entityTypeName == "BLOG") { entityType = "Blog"; }

  return {entityType, entityObject};
  }



  async fromNotificationToData(notification: Notifications): Promise<NotificationData> {
    let user = await firstValueFrom(this.sharedDataService.getUserById(notification.actorId)) as UserResponse;

    let action= this.setUpAction(notification);
    const { entityType, entityObject } = await this.setUpEntityName(notification);

    const data={
      id: notification.id,
      receiverID: notification.receiverID,
      actor: user,
      name: action,
      entity: entityObject, //| WikiResp | CareerPackageResp | Blog;
      entityTypeName: entityType,
      date: notification.date,
      seen: notification.seen
      }

    return data

  }

  markAsRead(notificationId: string) {
    return this.httpClient.put(this.notificationBaseUrl+this.notificationBasePort + '/notifications/'+notificationId,{})
  }
  markAllAsRead(receiverId:string){
    return this.httpClient.put(this.notificationBaseUrl+this.notificationBasePort + '/notifications/all/'+receiverId,{});
  }
  }
