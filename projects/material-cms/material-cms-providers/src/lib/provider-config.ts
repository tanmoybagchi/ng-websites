import { InjectionToken } from '@angular/core';

export interface ProviderConfig {
  audioFolder: any;
  docFolder: any;
  g_drive_database: string;
  g_oauth_login_name: string;
  g_sheets_database: string;
  photoFolder: any;
}

export const PROVIDER_CONFIG = new InjectionToken<ProviderConfig>('ProviderConfig');
