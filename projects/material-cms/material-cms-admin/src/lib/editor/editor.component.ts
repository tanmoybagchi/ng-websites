import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { UniqueIdService } from 'core';
import { Photo, PhotoQuery } from 'material-cms-view';
import { from, timer } from 'rxjs';
import { delay, filter, first, map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @Input() disabled = false;
  private editorVisible$ = timer(0, 50).pipe(filter(() => this._editor !== null), take(1));
  private lastContentEmitted = '';
  private rangeEndContainer: Node;
  private rangeEndOffset: number;
  private rangeStartContainer: Node;
  private rangeStartOffset: number;
  private savedContent = '';

  private _editor: HTMLElement = null;
  @ViewChild('editor')
  public set editor(v: ElementRef) {
    if (v === undefined || v === null) {
      this._editor = null;
    } else {
      this._editor = v.nativeElement;
    }
  }

  @Input()
  public set content(v: string) {
    if (String.isNullOrWhitespace(v)) {
      return;
    }

    this.editorVisible$.pipe(
      filter(_ => this._editor.innerHTML.length === 0),
      filter(_ => v !== this._editor.innerHTML),
      tap(_ => this.lastContentEmitted = v),
      tap(_ => this._editor.innerHTML = v),
      switchMap(_ => from(this._editor.querySelectorAll('img'))),
      tap(img => this.photo_click_register(img))
    ).subscribe();
  }

  @Output() changed = new EventEmitter<string>(true);

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
    private photoCurrentQuery: PhotoQuery,
    private uniqueIdService: UniqueIdService,
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
    timer(0, 50).pipe(
      filter(_ => !this.specialOpen),
      tap(_ => this.execCommand('insertHTML', value)),
      take(1)
    ).subscribe();
  }

  onSizeOpen() {
    this.sizeOpen = true;
  }

  onSizeClose() {
    this.sizeOpen = false;
  }

  size(value: string) {
    timer(0, 50).pipe(
      filter(_ => !this.sizeOpen),
      tap(_ => {
        const range = this.getRange();

        const parentSPAN = this.getParentSPAN(range);

        if (parentSPAN && parentSPAN.hasAttribute('class')) {
          parentSPAN.classList.remove(...this.sizes.map(x => x.class));
          // tslint:disable-next-line:no-unused-expression
          parentSPAN.classList.length === 0 && parentSPAN.removeAttribute('class');
        }

        if (value === 'normal') {
          return;
        }

        if (parentSPAN) {
          parentSPAN.classList.add(value);
        } else {
          const span = document.createElement('span');
          span.classList.add(value);

          range.surroundContents(span);
        }
      }),
      delay(0),
      tap(_ => this.onBlur()),
      take(1)
    ).subscribe();
  }

  onInternalLink() {
    this.saveSelection();

    this.choosingInternalLink = true;
  }

  onInternalLinkChosen($event: { link: string, name: string }) {
    this.choosingInternalLink = false;

    this.editorVisible$.pipe(
      switchMap(_ => this.restoreSelection()),
      filter(_ => $event !== undefined && $event !== null),
      tap(_ => this.execCommand('unlink')),
      tap(_ => {
        const range = this.getRange();
        if (range.collapsed) {
          this.execCommand('insertHTML', `<a href="" routerLink="/${$event.link}">${$event.name}</a>`);
        } else {
          const anchor = document.createElement('a');
          anchor.href = '';
          anchor.setAttribute('routerLink', `/${$event.link}`);

          range.surroundContents(anchor);
          range.collapse();

          setTimeout(() => {
            this.onBlur();
          }, 0);
        }
      })
    ).subscribe();
  }

  onExternalLink() {
    this.saveSelection();

    this.choosingExternalLink = true;
  }

  onExternalLinkChosen($event: string) {
    this.choosingExternalLink = false;

    this.editorVisible$.pipe(
      switchMap(_ => this.restoreSelection()),
      filter(_ => String.hasData($event)),
      tap(_ => this.execCommand('unlink')),
      tap(_ => {
        const range = this.getRange();
        if (range.collapsed) {
          this.execCommand('insertHTML', `<a href="${$event}" target="_blank" rel="noopener">${$event}</a>`);
        } else {
          const anchor = document.createElement('a');
          anchor.href = $event;
          anchor.target = '_blank';
          anchor.rel = 'noopener';

          range.surroundContents(anchor);
          range.collapse();

          setTimeout(() => {
            this.onBlur();
          }, 0);
        }
      })
    ).subscribe();
  }

  onUnlink() {
    this.execCommand('unlink');
    // Unlink can sometimes leave the innerHTML in a fragmented state.
    // This will fix it.
    this._editor.innerHTML = this._editor.innerHTML;
  }

  onAddPhoto() {
    this.saveSelection();

    this.choosingPhoto = true;
  }

  onPhotoListDone(photoIdentifier: string) {
    this.choosingPhoto = false;

    this.editorVisible$.pipe(
      switchMap(_ => this.restoreSelection()),
      filter(_ => String.hasData(photoIdentifier)),
      switchMap(() => this.photoCurrentQuery.execute()),
      switchMap(photos => from(photos)),
      first(photo => photo.identifier === photoIdentifier),
      map(photo => this.convertToImgElement(photo)),
      tap(imgEl => this.execCommand('insertHTML', imgEl.outerHTML)),
      delay(0),
      map(imgEl => document.getElementById(imgEl.id)),
      tap(imgEl => imgEl.id = ''),
      tap(imgEl => this.photo_click_register(imgEl)),
      tap(_ => this.onBlur())
    ).subscribe();
  }

  convertToImgElement(currentPhoto: Photo) {
    const imgEl = document.createElement('img');
    imgEl.id = this.uniqueIdService.getUniqueId().toString();

    const photoSizes = currentPhoto.photos();

    const widestDimension = Math.max(...photoSizes.map(x => x.width));
    const widestPhoto = photoSizes.find(x => x.width === widestDimension);

    imgEl.src = widestPhoto.location;
    imgEl.style.width = '25%';
    imgEl.srcset = photoSizes.map(x => `${x.location} ${x.width}w`).join(',');
    imgEl.sizes = '100vw';

    return imgEl;
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

    return timer(0, 50).pipe(
      filter(_ => this._editor.innerHTML !== null),
      take(1),
      tap(_ => {
        // tslint:disable-next-line:max-line-length
        const startContainer = (<HTMLElement>this.rangeStartContainer).id === this._editor.id ? this._editor : this.findNode(this.rangeStartContainer);
        // tslint:disable-next-line:max-line-length
        const endContainer = (<HTMLElement>this.rangeEndContainer).id === this._editor.id ? this._editor : this.findNode(this.rangeEndContainer);

        const range = new Range();
        range.setStart(startContainer, this.rangeStartOffset);
        range.setEnd(endContainer, this.rangeEndOffset);

        this.setRange(range);
      })
    );
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
