import { Thing } from './thing';

export class Listing extends Thing {
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
