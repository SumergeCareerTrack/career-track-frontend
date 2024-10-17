import { Pipe, PipeTransform } from "@angular/core";
import { Article } from "../interfaces/backend-requests";

@Pipe({ name: "filterArticles", standalone: true })
export class FilterArticlesPipe implements PipeTransform {
    transform(list: Article[], query: string) {
        return list.filter(item => item.type === query);
    }

}