import { Wine, Wines, WineType } from '@app/wines/wines';
import { Page } from 'material-cms-view';

export class AdminWineType extends WineType {
  addAfter(item: Wine) {
    const list = this.wines;

    const idx = list.indexOf(item, 0);
    list.splice(idx + 1, 0, new Wine());
  }

  remove(item: Wine) {
    const list = this.wines;

    const idx = list.indexOf(item, 0);
    list.splice(idx, 1);

    // tslint:disable-next-line:no-unused-expression
    list.length === 0 && list.push(new Wine());
  }

  moveUp(item: Wine) {
    const list = this.wines;

    const idx = list.indexOf(item, 0);
    if (idx <= 0) { return; }

    list.splice(idx, 1);
    list.splice(idx - 1, 0, item);
  }

  moveDown(item: Wine) {
    const list = this.wines;

    const idx = list.indexOf(item, 0);
    if (idx === list.length - 1) { return; }

    list.splice(idx, 1);
    list.splice(idx + 1, 0, item);
  }
}

export class AdminWines extends Wines {
  @Reflect.metadata('design:type', AdminWineType)
  wineTypes: AdminWineType[] = [];

  addAfter(item: AdminWineType) {
    const list = this.wineTypes;

    const idx = list.indexOf(item, 0);
    list.splice(idx + 1, 0, new AdminWineType());
  }

  remove(item: AdminWineType) {
    const list = this.wineTypes;

    const idx = list.indexOf(item, 0);
    list.splice(idx, 1);

    // tslint:disable-next-line:no-unused-expression
    list.length === 0 && list.push(new AdminWineType());
  }

  moveUp(item: AdminWineType) {
    const list = this.wineTypes;

    const idx = list.indexOf(item, 0);
    if (idx <= 0) { return; }

    list.splice(idx, 1);
    list.splice(idx - 1, 0, item);
  }

  moveDown(item: AdminWineType) {
    const list = this.wineTypes;

    const idx = list.indexOf(item, 0);
    if (idx === list.length - 1) { return; }

    list.splice(idx, 1);
    list.splice(idx + 1, 0, item);
  }
}

export class AdminWinesPage extends Page<AdminWines> {
  kind = 'wines';
  content = new AdminWines();
}
