import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Link, Thing } from '@app/domain/models';

export class PostViewModel {
  // tslint:disable-next-line:max-line-length
  static imageFileTypes = ['.apng', '.bmp', '.gif', '.ico', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp', '.png', '.svg', '.tif', '.tiff', '.webp'];

  author: string;
  createdOn: Date;
  domain: string;
  embed: any;
  hasEmbed: boolean;
  hasImage: boolean;
  hasLink: boolean;
  hasText: boolean;
  hasVideo: boolean;
  stickied: boolean;
  subreddit: string;
  text: string;
  thumbnail: string;
  title: string;
  url: string;
  videoSrcs: string[];

  constructor(thing: Thing, private sanitizer: DomSanitizer) {
    switch (thing.kind) {
      case Thing.Kind.Link:
        this.link(thing.data as Link);
        break;

      default:
        break;
    }
  }

  link(link: any) {
    this.author = link.author;

    const d = new Date(0);
    d.setUTCSeconds(link.created_utc);
    this.createdOn = d;

    this.domain = link.domain;
    this.stickied = link.stickied;
    this.subreddit = link.subreddit;
    this.title = link.title;
    this.url = link.url;

    const media = link.crosspost_parent_list ? link.crosspost_parent_list[0].media : link.media;
    const mediaEmbed = link.crosspost_parent_list ? link.crosspost_parent_list[0].media_embed : link.media_embed;

    if (media && media.reddit_video) {
      this.hasVideo = true;
      // tslint:disable-next-line:no-unused-expression
      link.preview && Array.isArray(link.preview.images) && (this.thumbnail = link.preview.images[0].source.url);

      this.videoSrcs = [
        media.reddit_video.dash_url,
        media.reddit_video.hls_url,
        media.reddit_video.fallback_url
      ];

      return;
    }

    if (link.preview && link.preview.reddit_video_preview) {
      this.hasVideo = true;
      // tslint:disable-next-line:no-unused-expression
      link.preview && Array.isArray(link.preview.images) && (this.thumbnail = link.preview.images[0].source.url);

      this.videoSrcs = [
        link.preview.reddit_video_preview.dash_url,
        link.preview.reddit_video_preview.hls_url,
        link.preview.reddit_video_preview.fallback_url
      ];

      return;
    }

    if (link.preview && Array.isArray(link.preview.images) && link.preview.images[0].variants && link.preview.images[0].variants.mp4) {
      this.hasVideo = true;
      // tslint:disable-next-line:no-unused-expression
      link.preview && Array.isArray(link.preview.images) && (this.thumbnail = link.preview.images[0].source.url);

      this.videoSrcs = [
        link.preview.images[0].variants.mp4.source.url
      ];

      return;
    }

    if (mediaEmbed && mediaEmbed.content) {
      this.hasEmbed = true;

      const el = document.createElement('p');
      el.innerHTML = mediaEmbed.content;

      Array.from(el.getElementsByTagName('iframe')).forEach(e => {
        e.width = '100%';
        e.height = 'auto';
        e.setAttribute('loading', 'lazy');
      });

      this.embed = this.sanitizer.bypassSecurityTrustHtml(el.innerHTML);
      return;
    }

    if (String.hasData(link.selftext_html)) {
      this.hasText = true;

      const el = document.createElement('p');
      el.innerHTML = link.selftext_html;
      Array.from(el.getElementsByTagName('a')).forEach(e => {
        e.setAttribute('target', '_blank');
        e.setAttribute('rel', 'noopener noreferrer');
      });

      this.text = el.innerHTML;
    }

    /* if (String.hasData(link.post_hint) && (link.post_hint.includes('image'))) {
      this.hasImage = true;
      this.thumbnail = link.url;
    } */

    if (link.preview && Array.isArray(link.preview.images)) {
      this.hasImage = true;
      this.thumbnail = link.preview.images[0].source.url;

      return;
    }

    if (PostViewModel.imageFileTypes.some(x => this.url.endsWith(x))) {
      this.hasImage = true;
      this.thumbnail = this.url;

      return;
    }

    if (!this.hasImage && !this.hasText) {
      this.hasLink = true;
    }
  }
}
