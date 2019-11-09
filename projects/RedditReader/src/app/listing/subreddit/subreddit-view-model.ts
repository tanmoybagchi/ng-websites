import { Thing, Listing } from '@app/domain/models';

export class SubredditViewModel {
  children = [];
  hasPosts = false;
  first: string;
  last: string;
  modhash: string;
  after: string;

  constructor(listing?: Listing) {
    if (!listing) {
      return;
    }

    this.children = listing.children;
    this.hasPosts = listing.children.length > 0;

    if (this.hasPosts) {
      this.after = listing.after;
      this.modhash = listing.modhash;
      this.first = (listing.children[0].data as any).name;
      this.last = (listing.children[listing.children.length - 1].data as any).name;
    }
  }
}
