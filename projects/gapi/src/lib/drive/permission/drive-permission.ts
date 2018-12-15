/** A permission for a file. A permission grants a user, group, domain or the world access to a file or a folder hierarchy. */
export class DrivePermission {
  static fields = 'id,type,emailAddress,role,displayName,deleted';

  /** Identifies what kind of resource this is. Value: the fixed string "drive#permission". */
  kind = 'drive#permission';
  /** The ID of this permission. This is a unique identifier for the grantee, and is published in User resources as permissionId. */
  id = '';
  /** The type of the grantee. */
  type = DrivePermission.Type.user;
  /** The email address of the user or group to which this permission refers. */
  emailAddress = '';
  /** The role granted by this permission. */
  role = DrivePermission.Roles.reader;
  /** A displayable name for users, groups or domains. */
  displayName = '';
  /** Whether the account associated with this permission has been deleted.
   * This field only pertains to user and group permissions.*/
  deleted = false;
}

export namespace DrivePermission {
  export enum Type {
    user = 'user',
    group = 'group',
    domain = 'domain',
    anyone = 'anyone'
  }

  export enum Roles {
    owner = 'owner',
    organizer = 'organizer',
    fileOrganizer = 'fileOrganizer',
    writer = 'writer',
    commenter = 'commenter',
    reader = 'reader'
  }
}
