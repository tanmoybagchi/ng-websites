import { ValueObject } from 'core';

export class Photo {
  static readonly SIZES = [
    { name: 'Original', dimension: -1 },
    { name: 'Thumbnail_Small', dimension: 128 },
    { name: 'Thumbnail_Big', dimension: 256 },
    { name: 'Size_XS', dimension: 599 },
    { name: 'Size_SM', dimension: 959 },
    { name: 'Size_MD', dimension: 1279 },
    { name: 'Size_LG', dimension: 1919 },
  ];

  id = 0;
  @Reflect.metadata('design:type', Date)
  effectiveFrom: Date = null;
  smallThumbnail: PhotoContent;
  bigThumbnail: PhotoContent;
  sizeXS: PhotoContent;
  sizeSM: PhotoContent;
  sizeMD: PhotoContent;
  sizeLG: PhotoContent;
  original: PhotoContent;

  setSizes(content: PhotoContent[]) {
    let pc: PhotoContent;

    while (pc = content.pop()) {
      pc.location = pc.location.startsWith('http') ?
        encodeURI(pc.location) :
        encodeURIComponent(pc.location);

      const size = Photo.SIZES.find(x => x.dimension === pc.height || x.dimension === pc.width);

      if (size === null || size === undefined) {
        this.original = pc;
        continue;
      }

      switch (size.name) {
        case 'Thumbnail_Small':
          this.smallThumbnail = pc;
          break;

        case 'Thumbnail_Big':
          this.bigThumbnail = pc;
          break;

        case 'Size_XS':
          this.sizeXS = pc;
          break;

        case 'Size_SM':
          this.sizeSM = pc;
          break;

        case 'Size_MD':
          this.sizeMD = pc;
          break;

        case 'Size_LG':
          this.sizeLG = pc;
          break;

        default:
          this.original = pc;
          break;
      }
    }
  }

  photos() {
    const result: PhotoContent[] = [];

    // tslint:disable-next-line:no-unused-expression
    this.smallThumbnail && result.push(this.smallThumbnail);
    // tslint:disable-next-line:no-unused-expression
    this.bigThumbnail && result.push(this.bigThumbnail);
    // tslint:disable-next-line:no-unused-expression
    this.sizeXS && result.push(this.sizeXS);
    // tslint:disable-next-line:no-unused-expression
    this.sizeSM && result.push(this.sizeSM);
    // tslint:disable-next-line:no-unused-expression
    this.sizeMD && result.push(this.sizeMD);
    // tslint:disable-next-line:no-unused-expression
    this.sizeLG && result.push(this.sizeLG);
    // tslint:disable-next-line:no-unused-expression
    this.original && result.push(this.original);

    return result;

  }
}

export class PhotoContent extends ValueObject {
  fileName: string;
  height = 0;
  location = '';
  name = '';
  width = 0;
}
