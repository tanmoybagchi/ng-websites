export interface Created {
  /** the time of creation in local epoch-second format. ex: 1331042771.0 */
  created: number;
  /** the time of creation in UTC epoch-second format. Note that neither of these ever have a non-zero fraction. */
  created_utc: number;
}
