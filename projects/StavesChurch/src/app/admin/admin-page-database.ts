import { Injectable } from '@angular/core';
import { AdminModule } from '@app/admin/admin.module';
import { Page } from '@app/admin/page/page';
import { PageDatabase } from '@app/page/page-database';
import { environment } from '@env/environment';
import { DomainHelper, Result } from 'core';
import { DriveFileSaveCommand } from 'gapi';
import { EMPTY, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: AdminModule
})
export class AdminPageDatabase {
  constructor(
    private driveFileSaveCommand: DriveFileSaveCommand,
    private pageDatabase: PageDatabase,
  ) { }

  get(kind: string) {
    return this.pageDatabase.get(kind);
  }

  add(pageToAdd: Page) {
    this.pageDatabase.initialize();

    return this.get(pageToAdd.kind).pipe(
      switchMap(_ => {
        const newPage = DomainHelper.adapt(Page, pageToAdd);
        newPage.id = this.pageDatabase.pages.length === 0 ? 1 : Math.max(...this.pageDatabase.pages.map(x => x.id)) + 1;
        newPage.identifier = this.uid();
        newPage.version = 1;
        newPage.savedBy = environment.login_name;
        newPage.savedOn = new Date();
        // tslint:disable-next-line:no-unused-expression
        typeof pageToAdd.content === 'object' && (newPage.content = JSON.stringify(pageToAdd.content));

        (this.pageDatabase.pages as any[]).push(newPage);

        return this.driveFileSaveCommand.execute(this.pageDatabase.pages, this.pageDatabase.fileId).pipe(
          switchMap(x => {
            this.pageDatabase.version = x.version;
            return of(DomainHelper.adapt(Page, newPage));
          })
        );
      })
    );
  }

  addAll(pagesToAdd: Page[]) {
    this.pageDatabase.initialize();

    return this.get(pagesToAdd[0].kind).pipe(
      switchMap(_ => {
        const addedItems: Page[] = [];

        pagesToAdd.forEach(pageToAdd => {
          const newPage = DomainHelper.adapt(Page, pageToAdd);
          newPage.id = Math.max(...this.pageDatabase.pages.map(x => x.id)) + 1;
          newPage.identifier = this.uid();
          newPage.version = 1;
          newPage.savedBy = environment.login_name;
          newPage.savedOn = new Date();
          // tslint:disable-next-line:no-unused-expression
          typeof pageToAdd.content === 'object' && (newPage.content = JSON.stringify(pageToAdd.content));

          addedItems.push(newPage);

          (this.pageDatabase.pages as any[]).push(newPage);
        });

        return this.driveFileSaveCommand.execute(this.pageDatabase.pages, this.pageDatabase.fileId).pipe(
          switchMap(x => {
            this.pageDatabase.version = x.version;
            return of(addedItems.map(item => DomainHelper.adapt(Page, item)));
          })
        );
      })
    );
  }

  private uid() {
    const tan = new Uint8Array(8);
    crypto.getRandomValues(tan);
    return tan.join('');
  }

  update(updatedPage: Page) {
    this.pageDatabase.initialize();

    return this.get(updatedPage.kind).pipe(
      switchMap(_ => {
        const result = new Result();

        const savedPage = this.pageDatabase.pages.find(x => x.id === updatedPage.id);
        if (!savedPage) {
          result.addError(`Cannot find item with id ${updatedPage.id}.`);
          return throwError(result);
        }

        if (savedPage.version !== updatedPage.version) {
          result.addError(`This was last updated by ${updatedPage.savedBy} on ${updatedPage.savedOn}. Please refresh your page.`);
          return throwError(result);
        }

        DomainHelper.adapt(savedPage, updatedPage);

        savedPage.version++;
        savedPage.savedBy = environment.login_name;
        savedPage.savedOn = new Date();
        // tslint:disable-next-line:no-unused-expression
        typeof updatedPage.content === 'object' && (savedPage.content = JSON.stringify(updatedPage.content));

        return this.driveFileSaveCommand.execute(this.pageDatabase.pages, this.pageDatabase.fileId).pipe(
          switchMap(x => {
            this.pageDatabase.version = x.version;
            return of(DomainHelper.adapt(Page, savedPage));
          })
        );
      })
    );
  }

  updateAll(updatedPages: Page[]) {
    this.pageDatabase.initialize();

    return this.get(updatedPages[0].kind).pipe(
      switchMap(_ => {
        const result = new Result();

        const updatedItems: Page[] = [];

        updatedPages.forEach(updatePage => {
          const savedPage = this.pageDatabase.pages.find(x => x.id === updatePage.id);
          if (!savedPage) {
            result.addError(`Cannot find item with id ${updatePage.id}.`);
            return throwError(result);
          }

          if (savedPage.version !== updatePage.version) {
            // tslint:disable-next-line:max-line-length
            result.addError(`Item with id ${updatePage.id} was last updated by ${updatePage.savedBy} on ${updatePage.savedOn}. Please refresh your page.`);
            return throwError(result);
          }

          DomainHelper.adapt(savedPage, updatePage);

          savedPage.version++;
          savedPage.savedBy = environment.login_name;
          savedPage.savedOn = new Date();
          // tslint:disable-next-line:no-unused-expression
          typeof updatePage.content === 'object' && (savedPage.content = JSON.stringify(updatePage.content));

          updatedItems.push(savedPage);
        });

        return this.driveFileSaveCommand.execute(this.pageDatabase.pages, this.pageDatabase.fileId).pipe(
          switchMap(x => {
            this.pageDatabase.version = x.version;
            return of(updatedItems.map(item => DomainHelper.adapt(Page, item)));
          })
        );
      })
    );
  }

  remove(page: Page) {
    this.pageDatabase.initialize();

    return this.get(page.kind).pipe(
      switchMap(_ => {
        const result = new Result();

        const itemIdx = this.pageDatabase.pages.findIndex(x => x.id === page.id);
        if (itemIdx === -1) {
          result.addError(`Cannot find item with id ${page.id}.`);
          return throwError(result);
        }

        if (this.pageDatabase.pages[itemIdx].version !== page.version) {
          result.addError(`This was last updated by ${page.savedBy} on ${page.savedOn}. Please refresh your page.`);
          return throwError(result);
        }

        this.pageDatabase.pages.splice(itemIdx, 1);

        return this.driveFileSaveCommand.execute(this.pageDatabase.pages, this.pageDatabase.fileId).pipe(
          switchMap(x => {
            this.pageDatabase.version = x.version;
            return EMPTY;
          })
        );
      })
    );
  }
}
