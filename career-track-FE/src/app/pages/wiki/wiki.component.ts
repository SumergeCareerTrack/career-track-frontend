import { Component, inject, OnInit } from '@angular/core';
import { WikiDataService } from '../../services/wiki-data/wiki-data.service';
import { Article } from '../../interfaces/backend-requests';
import { ArticleListComponent } from "./article-list/article-list.component";

@Component({
  selector: 'app-wiki',
  standalone: true,
  imports: [ArticleListComponent],
  templateUrl: './wiki.component.html',
  styleUrl: './wiki.component.css'
})
export class WikiComponent {

}
