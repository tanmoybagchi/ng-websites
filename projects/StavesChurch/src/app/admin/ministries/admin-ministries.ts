import { Ministries, Ministry } from '@app/ministries/ministries';
import { Page } from 'material-cms-view';

export class AdminMinistries extends Page<Ministries> {
  kind = 'ministries';
  content = new Ministries();

  addAfter(item: Ministry) {
    const idx = this.content.list.indexOf(item, 0);
    this.content.list.splice(idx + 1, 0, new Ministry());
  }

  remove(item: Ministry) {
    const idx = this.content.list.indexOf(item, 0);
    this.content.list.splice(idx, 1);

    // tslint:disable-next-line:no-unused-expression
    this.content.list.length === 0 && this.content.list.push(new Ministry());
  }

  moveUp(item: Ministry) {
    const idx = this.content.list.indexOf(item, 0);
    if (idx <= 0) { return; }

    this.content.list.splice(idx, 1);
    this.content.list.splice(idx - 1, 0, item);
  }

  moveDown(item: Ministry) {
    const idx = this.content.list.indexOf(item, 0);
    if (idx === this.content.list.length - 1) { return; }

    this.content.list.splice(idx, 1);
    this.content.list.splice(idx + 1, 0, item);
  }
}
