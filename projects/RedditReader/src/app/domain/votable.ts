export interface Votable {
  /** the number of upvotes. (includes own) */
  ups: number;
  /** the number of downvotes. (includes own) */
  downs: number;
  /** true if thing is liked by the user, false if thing is disliked, null if the user has not voted or you are not logged in. */
  likes: boolean;
}
