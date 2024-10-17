import { FileService } from './../../../services/file/file.service';
import { ArticleReq, ArticleResp, UserResponse } from './../../../interfaces/backend-requests';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { firstValueFrom, map, Observable, startWith } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { AdminUpdateComponent } from "../../../components/admin-update/admin-update-user/admin-update-user.component";
import { AdminUpdateCareerpackageComponent } from "../../admin-update/admin-update-careerpackage/admin-update-careerpackage.component";
import { ArticleService } from '../../../services/articles/article-service.service';
import { User } from '../../../interfaces/user.model';
import { LoadingSpinnerComponent } from "../../../shared/loading-spinner/loading-spinner.component";
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard-wiki-blogs',
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight, AdminUpdateComponent, NgbPaginationModule, FormsModule, AdminUpdateCareerpackageComponent, LoadingSpinnerComponent],
  templateUrl: './admin-dashboard-wiki-blogs.component.html',
  styleUrl: './admin-dashboard-wiki-blogs.component.css'
})
export class AdminDashboardWikiBlogsComponent {

  filter = new FormControl('', { nonNullable: true });
  @Output() cancel = new EventEmitter<void>();
  wikis$: Observable<ArticleResp[]>;
  articles: ArticleResp[] = [];
  filteredArticles: ArticleResp[] = [];
  articlePage = 1;
  articlePageSize = 2;
  articleCollectionSize = 0;
  article: ArticleResp = {} as ArticleResp;
  isLoading=true;
  constructor(private sharedDataService: SharedDataService,
              private articleService: ArticleService,
            private router:Router) {
                this.wikis$ = this.filter.valueChanges.pipe(
                  startWith(''),
                  map((text) => this.searchArticle(text))
                );
              }

  ngOnInit() {
    this.isLoading=false;
    this.loadAllWikis();
  }


  loadAllWikis(){
    this.articles=[];
    this.articleService.getArticles().subscribe({
      next: (data) => {
        this.isLoading=false;
        this.articles=[];
        const temp = data as ArticleResp[];
        this.articleCollectionSize = temp.length;
        temp.forEach((entry) => {
          this.setAuthor(entry).then((article) => {this.articles.push(article)});
        });
                this.filteredArticles = this.articles;
      },
    })
  }



  loadWikis() {
    this.articles=[];
      this.articleService.getArticlesPaginated( this.articlePage - 1, this.articlePageSize).subscribe({
        next: (data) => {
          this.isLoading=false;
          const temp = data as ArticleResp[];
          temp.forEach((entry) => {
            this.setAuthor(entry).then((article) => {this.articles.push(article)});
          });
          this.filteredArticles = this.articles;
        }
      });
    }

    async setAuthor(article: ArticleResp): Promise<ArticleResp> {
      let author=await firstValueFrom(this.sharedDataService.getUserById(article.author)) as UserResponse;
      console.log(author)
      return {
        id: article.id,
        title: article.title,
        author: author.firstName + ' ' + author.lastName,
        type: article.type,
        submissionDate: article.submissionDate,
        approvalStatus: article.approvalStatus,
        comment: article.comment,
        body: article.body
      };
    }
  onPageChange(page: number) {
    if(this.articlePageSize==1){
      this.articlePage = 1;
      this.loadWikis()
      console.log("collecsize",this.articleCollectionSize)
      console.log("pagesize",this.articlePageSize)
    }
    else{
    this.articlePage = page;
    console.log(this.filteredArticles)
    this.filteredArticles = this.searchArticle(this.filter.value);
    const startIndex = (this.articlePage - 1) * this.articlePageSize;
    const endIndex = startIndex + this.articlePageSize;
    console.log(this.filteredArticles)
    console.log("start",startIndex)
    console.log("end",endIndex)
    this.filteredArticles = this.filteredArticles.slice(startIndex, endIndex);
    console.log(this.filteredArticles)

  }
  }

  onPageSizeChange() {
    if(this.articlePageSize==1){
      this.articlePage = 1;
      this.loadWikis()
      return;
    }
    else{
    const totalPages = Math.ceil(this.articleCollectionSize / this.articlePageSize);

    if (this.articlePage > totalPages) {
      this.articlePage = totalPages;
    }
    this.loadWikis();
  }
  }

  searchArticle(text: string): ArticleResp[] {
    const term = text.toLowerCase();
    const filtered = this.articles.filter((data) =>
      data.title.toLowerCase().includes(term) ||
      data.type.toLowerCase().includes(term) ||
      data.author.toLowerCase().includes(term) ||
      data.approvalStatus.toLowerCase().includes(term)
        );
    return filtered;
  }


  onDelete(id: string) {
    this.articleService.deleteArticle(id).subscribe({
      next: (data: any) => {
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error deleting Package:', error);
      }
    });
  }

  statusIdentifier(entry: string) {
    if (entry === 'APPROVED') {
      return 'success';
    } else if (entry === 'REJECTED') {
      return 'danger';
    }else if (entry === 'BLOG') {
      return 'dark';
    }
    else if (entry === 'WIKI') {
      return 'info';
    }
    else{
      return 'warning';
    }
  }
  onView(id: string) {
    this.router.navigate(['/articles/'+id]);
    }

}
