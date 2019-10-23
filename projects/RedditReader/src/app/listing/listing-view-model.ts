import { Thing, Link } from '@app/domain/models';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

export class ListingViewModel {
  author: string;
  createdOn: Date;
  isImage: boolean;
  isText: boolean;
  isVideo: boolean;
  subreddit: string;
  text: string;
  thumbnail: string;
  title: string;
  url: string;
  videoSrc: any;

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
    this.isVideo = String.hasData(link.post_hint) && link.post_hint.includes('video');
    this.subreddit = link.subreddit;

    if (String.hasData(link.selftext_html)) {
      this.isText = true;
      this.text = link.selftext_html;
    }

    if (this.isImage) {
      this.thumbnail = link.url;
    }

    if (this.isVideo) {
      this.thumbnail = (link as any).preview.images[0].source.url;
      this.videoSrc = (link as any).media.reddit_video.hls_url;
    }

    this.title = link.title;
    this.url = link.url;
  }
}
