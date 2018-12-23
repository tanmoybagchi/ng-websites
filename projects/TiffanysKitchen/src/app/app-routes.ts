import { Routes } from '@angular/router';
import { ServerErrorComponent } from 'mh-server-error';
import { HomepageComponent } from './homepage/homepage.component';
import { RecipesComponent } from './recipes/recipes.component';
import { SignInComponent } from './security/sign-in.component';
import { FilesComponent } from './setup/files/files.component';
import { SheetComponent } from './setup/sheet/sheet.component';

export const routes: Routes = [
  { path: 'error', component: ServerErrorComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'setup', component: FilesComponent },
  { path: 'setup/sheet', component: SheetComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '', component: HomepageComponent, pathMatch: 'full' },
];
