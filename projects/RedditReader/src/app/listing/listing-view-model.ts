import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Link, Thing } from '@app/domain/models';

export class ListingViewModel {
  static imageFileTypes = ['.apng', '.bmp', '.ico', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp', '.png', '.svg', '.tif', '.tiff', '.webp'];

  author: string;
  createdOn: Date;
  hasEmbed: boolean;
  hasImage: boolean;
  hasText: boolean;
  hasVideo: boolean;
  embed: SafeHtml;
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
    this.createdOn = new Date(link.created);
    this.stickied = link.stickied;
    this.subreddit = link.subreddit;
    this.title = link.title;
    this.url = link.url;

    if (link.media && link.media.reddit_video) {
      this.hasVideo = true;
      this.thumbnail = link.preview.images[0].source.url;

      this.videoSrcs = [
        link.media.reddit_video.dash_url,
        link.media.reddit_video.hls_url,
        link.media.reddit_video.fallback_url
      ];

      return;
    }

    if (link.media_embed && link.media_embed.content) {
      this.hasEmbed = true;

      const tan = document.createElement('p');
      tan.innerHTML = link.media_embed.content;
      const ifr = tan.getElementsByTagName('iframe')[0];
      ifr.width = '100%';
      ifr.height = 'auto';

      this.embed = this.sanitizer.bypassSecurityTrustHtml(ifr.outerHTML);

      return;
    }

    if (link.preview && link.preview.reddit_video_preview) {
      this.hasVideo = true;
      this.thumbnail = link.preview.images[0].source.url;

      this.videoSrcs = [
        link.preview.reddit_video_preview.dash_url,
        link.preview.reddit_video_preview.hls_url,
        link.preview.reddit_video_preview.fallback_url
      ];

      return;
    }

    if (link.preview && Array.isArray(link.preview.images) && link.preview.images[0].variants && link.preview.images[0].variants.mp4) {
      this.hasVideo = true;
      this.thumbnail = link.preview.images[0].source.url;

      this.videoSrcs = [
        link.preview.images[0].variants.mp4.source.url
      ];

      return;
    }

    if (String.hasData(link.selftext_html)) {
      this.hasText = true;
      this.text = link.selftext_html;
    }

    if (String.hasData(link.post_hint) && (link.post_hint.includes('image'))) {
      this.hasImage = true;
      this.thumbnail = link.url;
    }

    if (link.preview && Array.isArray(link.preview.images)) {
      this.hasImage = true;
      this.thumbnail = link.preview.images[0].source.url;
    }

    if (ListingViewModel.imageFileTypes.some(x => this.url.endsWith(x))) {
      this.hasImage = true;
      this.thumbnail = this.url;
    }
  }
}
