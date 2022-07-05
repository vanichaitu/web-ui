import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'
import { Store } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { getReadingList, removeFromReadingList, markFinishedReadingList, addToReadingList } from '@tmo/books/data-access';
import { Book, ReadingListItem } from '@tmo/shared/models';
import * as moment from 'moment';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store,
    private _snackbar : MatSnackBar) {}

  removeFromReadingList(item: ReadingListItem) {
    this.store.dispatch(removeFromReadingList({ item }));
    const bookSnackbarRef = this._snackbar.open(`${item.title} removed from reading list`, 'Undo', { duration : 2000 });
    bookSnackbarRef.onAction().subscribe(() => {
      const book : Book = {
        id: item.bookId,
        ...item
      };
      this.store.dispatch(addToReadingList({book}));
    });
  }

  markAsFinished(item) {
  const readListItem : ReadingListItem = { ...item}
  readListItem.finished = true;
  readListItem.finishedDate = moment(new Date().toISOString()).format("MMMM d, YYYY");
   const updateItems = {
    id: readListItem.bookId,
    changes: {
      id: readListItem.bookId,
      ...readListItem
    }
   } ;
   this.store.dispatch(markFinishedReadingList({ update: updateItems }));
  }
}
