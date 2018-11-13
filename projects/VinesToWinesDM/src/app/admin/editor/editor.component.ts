import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { Photo } from '@app/photo/photo';
import { PhotoQuery } from '@app/photo/photo-query.service';
import { UniqueIdService } from 'core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  private rangeStartContainer: Node;
  private rangeStartOffset: number;
  private rangeEndContainer: Node;
  private rangeEndOffset: number;
  private savedContent = '';

  private lastContentEmitted = '';

  @Input() disabled = false;

  @Input()
  public set content(v: string) {
    setTimeout(() => {
      if (String.isNullOrWhitespace(v) || this._editor.innerHTML.length > 0 || v === this._editor.innerHTML) {
        return;
      }

      this.lastContentEmitted = v;
      this._editor.innerHTML = v;
      Array.from(this._editor.querySelectorAll('img')).forEach(img => this.photo_click_register(img));
    }, 0);
  }

  @Output() changed = new EventEmitter<string>(true);

  private _editor: HTMLElement;
  @ViewChild('editor')
  public set editor(v: ElementRef) {
    if (v === undefined || v === null) {
      this._editor = null;
    } else {
      this._editor = v.nativeElement;
    }
  }

  private specialOpen = false;
  // tslint:disable-next-line:max-line-length
  specialCharacters = ['&mdash;', '&ndash;', '&laquo;', '&raquo;', '&larr;', '&rarr;', '&uarr;', '&darr;', '&copy;', '&reg;', '&trade;', '&middot;', '&deg;'];

  private sizeOpen = false;
  sizes = [
    { class: 'mat-headline', title: 'Headline' },
    { class: 'mat-title', title: 'Title' },
    { class: 'mat-subheading-2', title: 'Subheading-2' },
    { class: 'mat-subheading-1', title: 'Subheading-1' },
    { class: 'mat-caption', title: 'Caption' },
  ];

  private linkOpen = false;
  choosingExternalLink: boolean;
  choosingInternalLink = false;

  editorId = 0;

  choosingPhoto = false;
  photo: HTMLElement;
  photoSliderTop: number;
  photoSliderWidth: number;
  photoSliderValue: number;

  private onPaste_StripFormatting_IEPaste = false;

  constructor(
    private uniqueIdService: UniqueIdService,
    private photoCurrentQuery: PhotoQuery,
  ) {
    this.editorId = uniqueIdService.getUniqueId();
  }

  ngOnInit() {
  }

  onBlur() {
    const newContent = this._editor.innerHTML;
    if (this.lastContentEmitted === newContent) { return; }

    this.lastContentEmitted = newContent;
    this.changed.emit(newContent);
  }

  onSpecialOpen() {
    this.specialOpen = true;
  }

  onSpecialClose() {
    this.specialOpen = false;
  }

  special(value: string) {
    const intervalHandle = window.setInterval(_ => {
      if (this.specialOpen) { return; }

      window.clearInterval(intervalHandle);

      this.execCommand('insertHTML', value);
    }, 50);
  }

  onSizeOpen() {
    this.sizeOpen = true;
  }

  onSizeClose() {
    this.sizeOpen = false;
  }

  size(value: string) {
    const intervalHandle = window.setInterval(_ => {
      if (this.sizeOpen) { return; }

      window.clearInterval(intervalHandle);

      const range = this.getRange();

      const parentSPAN = this.getParentSPAN(range);

      if (parentSPAN && parentSPAN.hasAttribute('class')) {
        parentSPAN.classList.remove(...this.sizes.map(x => x.class));
        // tslint:disable-next-line:no-unused-expression
        parentSPAN.classList.length === 0 && parentSPAN.removeAttribute('class');
      }

      if (value === 'normal') {
        setTimeout(() => {
          this.onBlur();
        }, 0);

        return;
      }

      if (parentSPAN) {
        parentSPAN.classList.add(value);
      } else {
        const span = document.createElement('span');
        span.classList.add(value);

        range.surroundContents(span);
      }

      setTimeout(() => {
        this.onBlur();
      }, 0);
    }, 50);
  }

  onLinkOpen() {
    this.linkOpen = true;
  }

  onLinkClose() {
    this.linkOpen = false;
  }

  onInternalLink() {
    this.saveSelection();

    this.choosingInternalLink = true;
  }

  onInternalLinkChosen($event: { link: string, name: string }) {
    this.choosingInternalLink = false;

    const intervalHandle = window.setInterval(_ => {
      if (this.linkOpen) { return; }

      window.clearInterval(intervalHandle);

      this.restoreSelection();

      if ($event === undefined || $event === null) { return; }

      const range = this.getRange();
      if (range.collapsed) {
        this.execCommand('insertHTML', `<a href="" routerLink="/${$event.link}">${$event.name}</a>`);
      } else {
        const anchor = document.createElement('a');
        anchor.href = '';
        anchor.setAttribute('routerLink', `/${$event.link}`);

        range.surroundContents(anchor);

        setTimeout(() => {
          this.onBlur();
        }, 0);
      }
    }, 50);
  }

  onExternalLink() {
    this.saveSelection();

    this.choosingExternalLink = true;
  }

  onExternalLinkChosen($event: string) {
    this.choosingExternalLink = false;

    const intervalHandle = window.setInterval(_ => {
      if (this.linkOpen) { return; }

      window.clearInterval(intervalHandle);

      this.restoreSelection();

      if (String.isNullOrWhitespace($event)) { return; }

      const range = this.getRange();
      if (range.collapsed) {
        this.execCommand('insertHTML', `<a href="${$event}" target="_blank" rel="noopener">${$event}</a>`);
      } else {
        const anchor = document.createElement('a');
        anchor.href = $event;
        anchor.target = '_blank';
        anchor.rel = 'noopener';

        range.surroundContents(anchor);

        setTimeout(() => {
          this.onBlur();
        }, 0);
      }
    }, 50);
  }

  onAddPhoto() {
    this.saveSelection();

    this.choosingPhoto = true;
  }

  onPhotoListDone(photoIdentifier: string) {
    this.choosingPhoto = false;

    window.setTimeout(_ => {
      this.restoreSelection();

      if (String.isNullOrWhitespace(photoIdentifier)) { return; }

      this.photoCurrentQuery.execute().subscribe(sizes => this.insertImgElement(sizes, photoIdentifier));
    }, 0);
  }

  insertImgElement(photos: Photo[], identifier: string) {
    const imgEl = document.createElement('img');
    imgEl.id = this.uniqueIdService.getUniqueId().toString();

    const currentPhoto = photos.filter(p => p.identifier === identifier)[0];

    const largest_photo = currentPhoto.sizeLG.width > currentPhoto.original.width ? currentPhoto.sizeLG : currentPhoto.original;

    imgEl.src = largest_photo.location;
    imgEl.style.width = '100%';

    const photoSizes = [
      currentPhoto.smallThumbnail,
      currentPhoto.bigThumbnail,
      currentPhoto.sizeXS,
      currentPhoto.sizeSM,
      currentPhoto.sizeMD,
      currentPhoto.sizeLG,
      currentPhoto.original
    ].sort((a, b) => a.width - b.width);

    imgEl.srcset = photoSizes.map(x => `${x.location} ${x.width}w`).join(',');

    imgEl.sizes = '(max-width: 768px) 100vw, (max-width: 992px) 750px, (max-width: 1200px) 970px, 1170px';

    this.execCommand('insertHTML', imgEl.outerHTML);

    window.setTimeout(_ => {
      const img = document.getElementById(imgEl.id);
      img.id = '';
      this.photo_click_register(img);
    }, 0);
  }

  private photo_click_register(elm: HTMLElement) {
    elm.addEventListener('click', ev => this.photo_click_handler(ev));
  }

  private photo_click_handler(ev) {
    this.photo = ev.target;
    this.photoSliderTop = this.photo.offsetTop - 30;
    this.photoSliderWidth = this._editor.clientWidth;
    this.photoSliderValue = Number(this.photo.style.width.replace('%', ''));
  }

  onPhotoSliderInput($event: MatSliderChange) {
    // tslint:disable-next-line:no-unused-expression
    this.photo && (this.photo.style.width = `${$event.value}%`);
  }

  onBodyClick($event: MouseEvent) {
    if ($event.target !== this.photo) {
      this.photo = null;
      this.onBlur();
    }
  }

  execCommand(cmd: string, value?: any) {
    document.execCommand(cmd, false, value);
  }

  onPaste(e) {
    if (e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
      e.preventDefault();
      const text = e.originalEvent.clipboardData.getData('text/plain');
      this.execCommand('insertHTML', text.replace(/\r\n\r\n/g, '<div><br></div>'));
      return;
    }

    if (e.clipboardData && e.clipboardData.getData) {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      this.execCommand('insertHTML', text.replace(/[\r\n]+/g, '<div><br></div>'));
      return;
    }

    if (window['clipboardData'] && window['clipboardData'].getData) {
      // Stop stack overflow
      if (!this.onPaste_StripFormatting_IEPaste) {
        this.onPaste_StripFormatting_IEPaste = true;
        e.preventDefault();
        window.document.execCommand('ms-pasteTextOnly', false);
      }
      this.onPaste_StripFormatting_IEPaste = false;
    }
  }

  private getParentSPAN(range: Range) {
    const parent_element = range.startContainer.parentElement;

    if (parent_element.nodeName !== 'SPAN' || parent_element.id === this.editorId.toString()) { return null; }

    if (range.startOffset !== 0) { return null; }

    if (range.endOffset !== (<Text>range.endContainer).length) { return null; }

    return parent_element;
  }

  private saveSelection(collapse = false) {
    const range = this.getRange();
    // tslint:disable-next-line:no-unused-expression
    collapse && range.collapse(true);

    this.rangeStartContainer = range.startContainer;
    this.rangeStartOffset = range.startOffset;

    this.rangeEndContainer = range.endContainer;
    this.rangeEndOffset = range.endOffset;

    this.savedContent = this._editor.innerHTML;
  }

  private restoreSelection() {
    this.content = this.savedContent;

    const startContainer = this.findNode(this.rangeStartContainer);
    const endContainer = this.findNode(this.rangeEndContainer);

    const range = new Range();
    range.setStart(startContainer, this.rangeStartOffset);
    range.setEnd(endContainer, this.rangeEndOffset);

    this.setRange(range);
  }

  private findNode(nodeToFind: Node) {
    return document.createTreeWalker(
      this._editor,
      NodeFilter.SHOW_ALL,
      { acceptNode: node => node.isEqualNode(nodeToFind) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP },
      false
    ).nextNode();
  }

  private getRange(): Range {
    if (window.getSelection) {
      const range = window.getSelection();
      if (range.getRangeAt && range.rangeCount) {
        return range.getRangeAt(0);
      }
    } else if (document['selection'] && document['selection']['createRange']) {
      return document['selection']['createRange']();
    }

    return null;
  }

  private setRange(range: Range) {
    if (!range) { return; }

    if (window.getSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document['selection'] && range['select']) {
      range['select']();
    }
  }
}
