import { Injectable } from '@nestjs/common';
import { StorageService } from '@tmo/shared/storage';
import { Book, ReadingListItem } from '@tmo/shared/models';
import { KEY } from './constants'

@Injectable()
export class ReadingListService {
  private readonly storage = new StorageService<ReadingListItem[]>(KEY, []);

  async getList(): Promise<ReadingListItem[]> {
    return this.storage.read();
  }

  async addBook(b: Book): Promise<void> {
    this.storage.update(list => {
      const { id, ...rest } = b;
      list.push({
        bookId: id,
        ...rest
      });
      return list;
    });
  }

  async removeBook(id: string): Promise<void> {
    this.storage.update(list => {
      return list.filter(x => x.bookId !== id);
    });
  }

  async markAsFinished(id: string, item: ReadingListItem): Promise<void> {
    this.storage.update(list => {
      const bookIndex = list.findIndex(x => x.bookId === id);
      if(bookIndex > -1) {
        list[bookIndex].finished = item.finished;
        list[bookIndex].finishedDate = item.finishedDate;
      }
      return list;
    });
  }
}
