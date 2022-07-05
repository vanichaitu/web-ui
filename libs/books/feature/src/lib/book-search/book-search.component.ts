import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { Book } from '@tmo/shared/models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];

  bookeQuery: string;
  bookeQueryUpdate = new Subject<string>();

  constructor(
    private readonly store: Store
  ) {
    this.bookeQueryUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(() => {
        this.searchBooks();
      });
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.bookeQuery = 'JavaScript';
    this.searchBooks();
  }

  searchBooks() {
    if (this.bookeQuery) {
      this.store.dispatch(searchBooks({ term: this.bookeQuery }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
