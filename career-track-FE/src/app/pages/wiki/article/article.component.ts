import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article, UserResponse } from '../../../interfaces/backend-requests';
import { WikiDataService } from '../../../services/wiki-data/wiki-data.service';
import { firstValueFrom } from 'rxjs';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  article = signal<Article>({} as Article);
  route = inject(ActivatedRoute);
  articleId = input.required<string>();
  wikiDataService = inject(WikiDataService);
  sharedDataService = inject(SharedDataService);


  ngOnInit() {
    let aid = this.route.snapshot.paramMap.get('articleId')!;
    this.wikiDataService.getArticleById(aid).subscribe(async data => {
      let articleData = data as Article;
      let author = await firstValueFrom(this.sharedDataService.getUserById(articleData.author)) as UserResponse;
      let authorName = `${author.firstName} ${author.lastName}`;
      this.article.set({ ...articleData, author: authorName });
    });
  }
}
