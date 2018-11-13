import { Page } from '@app/admin/page/page';
import { PhotoContent } from '@app/photo/photo';

export class AdminPhoto extends Page<PhotoContent[]> {
  kind = 'photo';
  @Reflect.metadata('design:type', Date)
  effectiveTo: Date = null;
}
