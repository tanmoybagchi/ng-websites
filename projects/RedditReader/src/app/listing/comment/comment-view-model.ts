import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Link, Thing } from '@app/domain/models';

export class CommentViewModel {
  id: string;
  author: string;
  createdOn: Date;
  stickied: boolean;
  body: string;
  hasReplies: boolean;

  constructor(thing: Thing, private sanitizer: DomSanitizer) {
    switch (thing.kind) {
      case Thing.Kind.Comment:
        this.comment(thing.data);
        break;

      default:
        break;
    }
  }

  comment(link: any) {
    this.id = link.id;
    this.author = link.author;

    const d = new Date(0);
    d.setUTCSeconds(link.created_utc);
    this.createdOn = d;

    const el = document.createElement('p');
    el.innerHTML = link.body_html;
    Array.from(el.getElementsByTagName('a')).forEach(e => {
      e.setAttribute('target', '_blank');
      e.setAttribute('rel', 'noopener noreferrer');
    });

    this.body = el.innerHTML;

    this.hasReplies = typeof link.replies === 'object';
    this.stickied = link.stickied;
  }
}
