import { Wine, Wines } from '@app/wines/wines';
import { Page } from 'material-cms-view';

export class AdminWines extends Page<Wines> {
  kind = 'wines';
  content = new Wines();

  addRedAfter(item: Wine) {
    this.addAfter(item, this.content.reds);
  }

  removeRed(item: Wine) {
    this.remove(item, this.content.reds);
  }

  moveRedUp(item: Wine) {
    this.moveUp(item, this.content.reds);
  }

  moveRedDown(item: Wine) {
    this.moveDown(item, this.content.reds);
  }

  addWhiteAfter(item: Wine) {
    this.addAfter(item, this.content.whites);
  }

  removeWhite(item: Wine) {
    this.remove(item, this.content.whites);
  }

  moveWhiteUp(item: Wine) {
    this.moveUp(item, this.content.whites);
  }

  moveWhiteDown(item: Wine) {
    this.moveDown(item, this.content.whites);
  }

  private addAfter(item: Wine, list: Wine[]) {
    const idx = list.indexOf(item, 0);
    list.splice(idx + 1, 0, new Wine());
  }

  private remove(item: Wine, list: Wine[]) {
    const idx = list.indexOf(item, 0);
    list.splice(idx, 1);

    // tslint:disable-next-line:no-unused-expression
    list.length === 0 && list.push(new Wine());
  }

  private moveUp(item: Wine, list: Wine[]) {
    const idx = list.indexOf(item, 0);
    if (idx <= 0) { return; }

    list.splice(idx, 1);
    list.splice(idx - 1, 0, item);
  }

  private moveDown(item: Wine, list: Wine[]) {
    const idx = list.indexOf(item, 0);
    if (idx === list.length - 1) { return; }

    list.splice(idx, 1);
    list.splice(idx + 1, 0, item);
  }
}
