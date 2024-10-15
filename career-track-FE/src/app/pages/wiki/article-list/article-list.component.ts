import { Component, inject } from '@angular/core';
import { WikiDataService } from '../../../services/wiki-data/wiki-data.service';
import { Article, UserResponse } from '../../../interfaces/backend-requests';
import { FilterArticlesPipe } from '../../../pipes/wikiFilter.pipe';
import { ArticleItemComponent } from "./article-item/article-item.component";
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../../interfaces/user.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [FilterArticlesPipe, ArticleItemComponent],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent {
  wikiDataService = inject(WikiDataService);
  sharedDataService = inject(SharedDataService);
  filter: "WIKI" | "BLOG" = "WIKI";
  articles: Article[] = [];

  ngOnInit(): void {
    this.wikiDataService.getAll().subscribe(async (articlesResponse) => {
      let articlesResponseArray = articlesResponse as Article[];

      let authorIds = [... new Set(articlesResponseArray.map(article => article.author))];

      let authors = await firstValueFrom(this.sharedDataService.getBatchUsers(authorIds)) as UserResponse[];

      this.articles = articlesResponseArray.map(article => {
        let authorId = article.author;
        let author = authors.find(a => a.id === authorId)!;
        let authorName = `${author.firstName} ${author.lastName}`;
        return { ...article, author: authorName };
      });
    });
  }

  setFilter(filter: "WIKI" | "BLOG") {
    this.filter = filter;
  }
}
