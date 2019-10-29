import { Thing, Listing } from '@app/domain/models';

export class SubredditViewModel {
  children = [new Thing()];
  hasPosts = true;

  constructor(listing?: Listing) {
    if (!listing) {
      return;
    }

    this.children = listing.children;
    this.hasPosts = listing.children.length > 0;
  }
}
