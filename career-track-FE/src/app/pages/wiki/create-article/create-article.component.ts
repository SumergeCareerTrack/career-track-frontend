import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WikiDataService } from '../../../services/wiki-data/wiki-data.service';
import { ApprovalStatus, Article } from '../../../interfaces/backend-requests';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.css'
})
export class CreateArticleComponent {
  wikiDataService = inject(WikiDataService);
  authService = inject(AuthService);
  router = inject(Router);
  user = this.authService.getUserData();

  form = new FormGroup({
    title: new FormControl("", { validators: [Validators.required] }),
    body: new FormControl("", { validators: [Validators.required] }),
    type: new FormControl("WIKI", { validators: [Validators.required] })
  });

  onSubmit() {
    let article: Article = {
      title: this.form.value.title!,
      body: this.form.value.body!,
      type: this.form.value.type! as "BLOG" | "WIKI",
      author: this.user!.id,
      approvalStatus: ApprovalStatus.Pending,
      submissionDate: Date.now(),
      comment: ""
    };

    this.wikiDataService.createArticle(article, this.user!.managerId)
      .subscribe(console.log)
      .unsubscribe();

    this.router.navigate(["articles"]);
  }
}
