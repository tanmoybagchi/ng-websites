// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  endPoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  client_id: '476036799041-9ub5f7f9kgem33aetosjm1mdcqfh9vfa.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive',
  rootFolder: 'Websites',
  database: 'dailyspendlimit.json',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
