import { Created } from './created ';
import { Thing } from './thing';
import { Votable } from './votable';

export class Comment extends Thing implements Votable, Created {
  ups: number;
  downs: number;
  likes: boolean;
  created: number;
  // tslint:disable-next-line:variable-name
  created_utc: number;

}
