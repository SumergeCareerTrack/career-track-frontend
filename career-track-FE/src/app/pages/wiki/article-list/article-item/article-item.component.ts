import { Component, inject, input } from '@angular/core';
import { Article } from '../../../../interfaces/backend-requests';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-article-item',
  standalone: true,
  imports: [],
  templateUrl: './article-item.component.html',
  styleUrl: './article-item.component.css',

})
export class ArticleItemComponent {
  article = input.required<Article>();
  route = inject(ActivatedRoute);
  router = inject(Router);

  routeToArticle() {
    console.log(`ROUTING FROM ${this.route}`);
    this.router.navigate([this.article().id], { relativeTo: this.route });
  }

}
