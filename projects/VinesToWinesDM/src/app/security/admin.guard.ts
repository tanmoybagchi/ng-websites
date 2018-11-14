import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { environment as env } from '@env/environment';
import { AuthTokenService, Result } from 'core';
import { DriveFileSearchQuery, DrivePermission, DrivePermissionsQuery } from 'gapi';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SecurityModule } from './security.module';

@Injectable({ providedIn: SecurityModule })
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  private isAdmin: boolean;

  constructor(
    private authTokenService: AuthTokenService,
    private driveFileSearchQuery: DriveFileSearchQuery,
    private drivePermissionsQuery: DrivePermissionsQuery,
    private router: Router
  ) {
    this.isAdmin = false;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.check();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);
  }

  canLoad(route: Route): boolean | Observable<boolean> {
    return this.check();
  }

  private check() {
    if (this.isAdmin) {
      return of(true);
    }

    if (String.isNullOrWhitespace(this.authTokenService.getAuthToken())) {
      return of(false);
    }

    return this.driveFileSearchQuery.execute(`${env.rootFolder}\\${env.database}`).pipe(
      switchMap(sr => this.drivePermissionsQuery.execute(sr[0].id)),
      switchMap(qr => {
        if (qr.permissions.some(x => x.role !== DrivePermission.Roles.reader)) {
          this.isAdmin = true;
          return of(true);
        }

        return throwError(Result.CreateErrorResult('NotAuthorized'));
      }),
      catchError(err => {
        this.authTokenService.removeAuthToken();
        this.router.navigate(['/sign-in']);
        return of(false);
      })
    );
  }
}
