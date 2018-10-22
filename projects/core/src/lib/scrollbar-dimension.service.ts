import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollbarDimensionService {
  constructor() { }

  getDimensions() {
    const el = document.createElement('div');
    el.style.width = '100px';
    el.style.height = '100px';
    el.style.overflow = 'scroll';
    el.style.position = 'absolute';
    el.style.top = '-9999px';

    document.body.appendChild(el);

    const scrollbarHeight = el.offsetHeight - el.clientHeight;
    const scrollbarWidth = el.offsetWidth - el.clientWidth;

    document.body.removeChild(el);

    return { height: scrollbarHeight, width: scrollbarWidth };
  }
}
