import { Injectable } from '@angular/core';

export class SmoothScrollOptions {
  duration = 800;
  offset = 0;
  easing = 'easeInOutCubic';
  callbackBefore: (element: HTMLElement) => void;
  callbackAfter: (element: HTMLElement) => void;
  containerId: string;
}

@Injectable({ providedIn: 'root' })
export class ScrollService {
  constructor() { }

  fastScroll(element: HTMLElement) {
    element.scrollIntoView();
  }

  // adapted from https://github.com/d-oliveros/ngSmoothScroll
  smoothScroll(element: HTMLElement, options?: SmoothScrollOptions) {
    options = options || new SmoothScrollOptions();

    // Options
    const duration = options.duration || 800;
    const offset = options.offset || 0;
    const easing = options.easing || 'easeInOutCubic';
    // tslint:disable-next-line:only-arrow-functions
    const callbackBefore = options.callbackBefore || function() { };
    // tslint:disable-next-line:only-arrow-functions
    const callbackAfter = options.callbackAfter || function() { };
    const container = document.getElementById(options.containerId) || null;
    const containerPresent = (container !== undefined && container != null);

    /**
     * Retrieve current location
     */
    // tslint:disable-next-line:only-arrow-functions
    const getScrollLocation = function() {
      if (containerPresent) {
        return container.scrollTop;
      } else {
        if (window.pageYOffset) {
          return window.pageYOffset;
        } else {
          return document.documentElement.scrollTop;
        }
      }
    };

    /**
     * Calculate easing pattern.
     * @see http://archive.oreilly.com/pub/a/server-administration/excerpts/even-faster-websites/writing-efficient-javascript.html
     */
    // tslint:disable-next-line:only-arrow-functions
    const getEasingPattern = function(animationType: string, time: number) {
      switch (animationType) {
        case 'easeInQuad': return time * time; // accelerating from zero velocity
        case 'easeOutQuad': return time * (2 - time); // decelerating to zero velocity
        // tslint:disable-next-line:max-line-length
        case 'easeInOutQuad': return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
        case 'easeInCubic': return time * time * time; // accelerating from zero velocity
        case 'easeOutCubic': return (--time) * time * time + 1; // decelerating to zero velocity
        // tslint:disable-next-line:max-line-length
        case 'easeInOutCubic': return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
        case 'easeInQuart': return time * time * time * time; // accelerating from zero velocity
        case 'easeOutQuart': return 1 - (--time) * time * time * time; // decelerating to zero velocity
        // tslint:disable-next-line:max-line-length
        case 'easeInOutQuart': return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
        case 'easeInQuint': return time * time * time * time * time; // accelerating from zero velocity
        case 'easeOutQuint': return 1 + (--time) * time * time * time * time; // decelerating to zero velocity
        // tslint:disable-next-line:max-line-length
        case 'easeInOutQuint': return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
        default: return time;
      }
    };

    /**
		 * Calculate how far to scroll
		 */
    // tslint:disable-next-line:no-shadowed-variable only-arrow-functions
    const getEndLocation = function(element: HTMLElement) {
      let location = 0;
      if (element.offsetParent) {
        do {
          location += element.offsetTop;
          element = element.offsetParent as HTMLElement;
        } while (element);
      }
      location = Math.max(location - offset, 0);
      return location;
    };

    // Initialize the whole thing
    // tslint:disable-next-line:no-shadowed-variable only-arrow-functions
    setTimeout(function() {
      let currentLocation = null;
      const startLocation = getScrollLocation();
      const endLocation = getEndLocation(element);
      let timeLapsed = 0;
      const distance = endLocation - startLocation;
      let percentage;
      let position: number;
      let scrollHeight;
      let internalHeight;

      /**
			 * Stop the scrolling animation when the anchor is reached (or at the top/bottom of the page)
			 */
      // tslint:disable-next-line:no-shadowed-variable only-arrow-functions
      const stopAnimation = function() {
        currentLocation = getScrollLocation();
        if (containerPresent) {
          scrollHeight = container.scrollHeight;
          internalHeight = container.clientHeight + currentLocation;
        } else {
          scrollHeight = document.body.scrollHeight;
          internalHeight = window.innerHeight + currentLocation;
        }

        if (
          ( // condition 1
            position === endLocation
          ) ||
          ( // condition 2
            currentLocation === endLocation
          ) ||
          ( // condition 3
            internalHeight >= scrollHeight
          )
        ) { // stop
          clearInterval(runAnimation);
          callbackAfter(element);
        }
      };

      /**
			 * Scroll the page by an increment, and check if it's time to stop
			 */
      // tslint:disable-next-line:no-shadowed-variable only-arrow-functions
      const animateScroll = function() {
        timeLapsed += 16;
        percentage = (timeLapsed / duration);
        percentage = (percentage > 1) ? 1 : percentage;
        position = startLocation + (distance * getEasingPattern(easing, percentage));
        if (containerPresent) {
          container.scrollTop = position;
        } else {
          window.scrollTo(0, position);
        }
        stopAnimation();
      };

      callbackBefore(element);
      const runAnimation = setInterval(animateScroll, 16);
    }, 0);
  }
}
