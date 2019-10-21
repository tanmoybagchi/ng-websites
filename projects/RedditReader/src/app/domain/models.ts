export class Thing {
  id: string;
  name: string;
  kind: Thing.Kind.Listing;
  data: Listing | Link;
}

// tslint:disable-next-line:no-namespace
export namespace Thing {
  export enum Kind {
    Listing = 'Listing',
    Comment = 't1',
    Account = 't2',
    Link = 't3',
    Message = 't4',
    Subreddit = 't5',
    Award = 't6',
    More = 'more'
  }
}

export class Listing {
  /** The fullname of the listing that follows before this page. null if there is no previous page. */
  before = '';
  /** The fullname of the listing that follows after this page. null if there is no next page. */
  after = '';
  /**
   * A modhash is a token that the reddit API requires to help prevent CSRF.
   * The preferred way to send a modhash is to include an X-Modhash custom HTTP header with your requests.
   */
  modhash = '';
  children: Thing[];
}

export class Link implements Votable, Created {
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

export class Comment extends Thing implements Votable, Created {
  ups: number;
  downs: number;
  likes: boolean;
  created: number;
  // tslint:disable-next-line:variable-name
  created_utc: number;
}

export interface Votable {
  /** the number of upvotes. (includes own) */
  ups: number;
  /** the number of downvotes. (includes own) */
  downs: number;
  /** true if thing is liked by the user, false if thing is disliked, null if the user has not voted or you are not logged in. */
  likes: boolean;
}

export interface Created {
  /** the time of creation in local epoch-second format. ex: 1331042771.0 */
  created: number;
  /** the time of creation in UTC epoch-second format. Note that neither of these ever have a non-zero fraction. */
  created_utc: number;
}
