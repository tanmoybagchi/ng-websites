import { Wine, Wines } from '@app/wines/wines';
import { Page } from 'material-cms-view';

export class AdminWines extends Page<Wines> {
  kind = 'wines';
  content = new Wines();

  addAfter(item: Wine, kind: 'reds' | 'whites' | 'speciality') {
    const list = this.content[kind];

    const idx = list.indexOf(item, 0);
    list.splice(idx + 1, 0, new Wine());
  }

  remove(item: Wine, kind: 'reds' | 'whites' | 'speciality') {
    const list = this.content[kind];

    const idx = list.indexOf(item, 0);
    list.splice(idx, 1);

    // tslint:disable-next-line:no-unused-expression
    list.length === 0 && list.push(new Wine());
  }

  moveUp(item: Wine, kind: 'reds' | 'whites' | 'speciality') {
    const list = this.content[kind];

    const idx = list.indexOf(item, 0);
    if (idx <= 0) { return; }

    list.splice(idx, 1);
    list.splice(idx - 1, 0, item);
  }

  moveDown(item: Wine, kind: 'reds' | 'whites' | 'speciality') {
    const list = this.content[kind];

    const idx = list.indexOf(item, 0);
    if (idx === list.length - 1) { return; }

    list.splice(idx, 1);
    list.splice(idx + 1, 0, item);
  }
}
