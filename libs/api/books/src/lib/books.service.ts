import { HttpService, Injectable } from '@nestjs/common';
import { Book } from '@tmo/shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GOOGLE_API } from './constants'

@Injectable()
export class BooksService {
  constructor(private readonly http: HttpService) {}

  /**
   * Search pattern key for books
   * @param term 
   * @returns 
   */
  search(term: string): Observable<Book[]> {
    if (!term) {
      throw new Error('Missing serach term');
    }

    return this.http
      .get(`${GOOGLE_API}?q=${term}`)
      .pipe(
        map(resp => {
          return resp.data.items.map(item => {
            return {
              id: item.id,
              title: item.volumeInfo?.title,
              authors: item.volumeInfo?.authors || [],
              description: item.searchInfo?.textSnippet,
              publisher: item.volumeInfo?.publisher,
              publishedDate: item.volumeInfo?.publishedDate
                ? new Date(item.volumeInfo?.publishedDate).toISOString()
                : undefined,
              coverUrl: item.volumeInfo?.imageLinks?.thumbnail
            };
          });
        })
      );
  }
}
