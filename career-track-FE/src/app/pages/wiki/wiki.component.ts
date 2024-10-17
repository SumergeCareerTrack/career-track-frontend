import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleListComponent } from "./article-list/article-list.component";

@Component({
  selector: 'app-wiki',
  standalone: true,
  imports: [ArticleListComponent],
  templateUrl: './wiki.component.html',
  styleUrl: './wiki.component.css'
})
export class WikiComponent {
  router = inject(Router);

  goToForm() {
    this.router.navigate(["articles", "new"]);
  }

}
