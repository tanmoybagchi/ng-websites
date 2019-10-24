import { Link, Thing } from '@app/domain/models';

export class ListingViewModel {
  author: string;
  createdOn: Date;
  isImage: boolean;
  isText: boolean;
  isVideo: boolean;
  stickied: boolean;
  subreddit: string;
  text: string;
  thumbnail: string;
  title: string;
  url: string;
  videoSrcs: string[];

  constructor(thing: Thing) {
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
      this.isVideo = true;
      this.thumbnail = link.preview.images[0].source.url;

      this.videoSrcs = [
        link.media.reddit_video.dash_url,
        link.media.reddit_video.hls_url,
        link.media.reddit_video.fallback_url
      ];

      return;
    }

    if (link.preview && link.preview.reddit_video_preview) {
      this.isVideo = true;
      this.thumbnail = link.preview.images[0].source.url;

      this.videoSrcs = [
        link.preview.reddit_video_preview.dash_url,
        link.preview.reddit_video_preview.hls_url,
        link.preview.reddit_video_preview.fallback_url
      ];

      return;
    }

    if (link.preview && Array.isArray(link.preview.images) && link.preview.images[0].variants && link.preview.images[0].variants.mp4) {
      this.isVideo = true;
      this.thumbnail = link.preview.images[0].source.url;

      this.videoSrcs = [
        link.preview.images[0].variants.mp4.source.url
      ];

      return;
    }

    if (String.hasData(link.selftext_html)) {
      this.isText = true;
      this.text = link.selftext_html;
    }

    if (String.hasData(link.post_hint) && (link.post_hint.includes('image'))) {
      this.isImage = true;
      this.thumbnail = link.url;
    }

    if (link.preview && Array.isArray(link.preview.images)) {
      this.isImage = true;
      this.thumbnail = link.preview.images[0].source.url;
    }
  }
}
