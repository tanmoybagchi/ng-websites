import { Created } from './created ';
import { Thing } from './thing';
import { Votable } from './votable';

export class Link extends Thing implements Votable, Created {
  ups: number;
  downs: number;
  likes: boolean;
  created: number;
  // tslint:disable-next-line:variable-name
  created_utc: number;
  author: string;
  domain: string;
  // tslint:disable-next-line:variable-name
  num_comments: number;
  // tslint:disable-next-line:variable-name
  over_18: boolean;
  // tslint:disable-next-line:variable-name
  post_hint: string;
  selftext: string;
  // tslint:disable-next-line:variable-name
  selftext_html: string;
  stickied: boolean;
  subreddit: string;
  // tslint:disable-next-line:variable-name
  subreddit_id: string;
  // tslint:disable-next-line:variable-name
  subreddit_name_prefixed: string;
  thumbnail: string;
  // tslint:disable-next-line:variable-name
  thumbnail_height: number;
  // tslint:disable-next-line:variable-name
  thumbnail_width: number;
  title: string;
  url: string;
}
