import { Thing, Listing } from '@app/domain/models';

export class SubredditViewModel {
  after = '';
  before = '';
  children = [new Thing()];
  hasPosts = true;
  modhash = '';

  constructor(listing?: Listing) {
    if (!listing) {
      return;
    }

    this.before = listing.before;
    this.after = listing.after;
    this.modhash = listing.modhash;
    this.children = listing.children;
    this.hasPosts = listing.children.length > 0;
  }
}
