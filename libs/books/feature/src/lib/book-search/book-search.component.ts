import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  removeFromReadingList
} from '@tmo/books/data-access';
import { Book, ReadingListItem } from '@tmo/shared/models';
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
    private readonly store: Store,
    private _snackbar : MatSnackBar
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
    const bookSnackbarRef = this._snackbar.open(`${book.title} added into reading list`, 'Undo', { duration : 2000 });
    bookSnackbarRef.onAction().subscribe(() => {
      const item: ReadingListItem = {
        bookId: book.id,
        ...book
      }
      this.store.dispatch(removeFromReadingList({item}));
    });
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
