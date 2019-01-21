import { AboutUs } from '@app/about-us/about-us';
import { Page } from 'material-cms-view';

export class AdminAboutUs extends Page<AboutUs> {
  kind = 'about-us';
  content = new AboutUs();
}
