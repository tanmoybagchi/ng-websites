import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { MatButtonModule, MatCardModule, MatIconModule } from '@angular/material';
import { MhGeneralErrorModule } from 'mh-general-error';
import { MhPageTitleModule } from 'mh-page-title';
import { PageDatabase, PAGE_DATABASE } from './page-database';
import { PageViewComponent } from './page/view/page-view.component';
import { PhotoGalleryComponent } from './photo/gallery/photo-gallery.component';
import { PhotoViewerComponent } from './photo/viewer/photo-viewer.component';
import { SitePages, SITE_PAGES } from './site-pages';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MhGeneralErrorModule,
    MhPageTitleModule,
  ],
  declarations: [
    PageViewComponent,
    PhotoGalleryComponent,
    PhotoViewerComponent,
  ],
  exports: [
    PageViewComponent,
    PhotoGalleryComponent,
    PhotoViewerComponent,
  ]
})
export class MaterialCmsViewModule {
  // tslint:disable-next-line:max-line-length
  static forRoot(sitePages: Type<SitePages>, pageDatabase: Type<PageDatabase>) {
    return <ModuleWithProviders<MaterialCmsViewModule>>{
      ngModule: MaterialCmsViewModule,
      providers: [
        { provide: PAGE_DATABASE, useClass: pageDatabase },
        { provide: SITE_PAGES, useClass: sitePages },
      ]
    };
  }
}
