import { Thing, Link } from '@app/domain/models';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

export class ListingViewModel {
  author: string;
  createdOn: Date;
  isImage: boolean;
  isText: boolean;
  isVideo: boolean;
  subreddit: string;
  text: SafeHtml;
  thumbnail: SafeUrl;
  title: string;
  url: string;

  constructor(thing: Thing, sanitizer: DomSanitizer) {
    switch (thing.kind) {
      case Thing.Kind.Link:
        this.link(thing.data as Link, sanitizer);
        break;

      default:
        break;
    }
  }

  link(link: Link, sanitizer: DomSanitizer) {
    this.author = link.author;
    this.createdOn = new Date(link.created);
    this.isImage = String.hasData(link.post_hint) && link.post_hint.includes('image');
    this.isText = String.isNullOrWhitespace(link.post_hint) || String.isNullOrWhitespace(link.selftext);
    this.isVideo = String.hasData(link.post_hint) && link.post_hint.includes('video');
    this.subreddit = link.subreddit;

    if (String.hasData(link.selftext_html)) {
      this.text = sanitizer.bypassSecurityTrustHtml(link.selftext_html);
    }

    if (String.hasData(link.thumbnail)) {
      this.thumbnail = sanitizer.bypassSecurityTrustUrl(link.thumbnail);
    }

    this.title = link.title;
    this.url = link.url;
  }
}
