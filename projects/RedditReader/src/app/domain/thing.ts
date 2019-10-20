export class Thing {
  id: string;
  name: string;
  kind: Thing.Kind.Listing;
  data: any;
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
