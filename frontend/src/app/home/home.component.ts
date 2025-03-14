import { Component, ElementRef, ViewChildren, QueryList, Renderer2, AfterViewInit, AfterViewChecked, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChildren('movableText') movableTextElements!: QueryList<ElementRef>;
  @ViewChild('touchBox') touchBox!: ElementRef;
  @ViewChild('carousel') carousel!: ElementRef;

  private textListeners = new Map<HTMLElement, (() => void)[]>();
  private touchBoxListeners: (() => void)[] = [];
  private carouselListeners: (() => void)[] = [];

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.initializeMovableText();
    this.initializeTouchBox();
    this.initializeCarousel();
  }

  ngAfterViewChecked() {
    this.cleanupMovableTextListeners();
    this.initializeMovableText();
  }

  ngOnDestroy() {
    this.cleanupMovableTextListeners();
    this.cleanupTouchBoxListeners();
    this.cleanupCarouselListeners();
  }

  private initializeMovableText() {
    this.movableTextElements.forEach((textElementRef) => {
      const textElement = textElementRef.nativeElement;
      if (this.textListeners.has(textElement)) return; // Prevent duplicate listeners

      const val = parseFloat(textElement.getAttribute('data-val') || '50');

      const moveAway = (event: MouseEvent | TouchEvent) => {
        const rect = textElement.getBoundingClientRect();
        let clientX, clientY;

        if (event instanceof MouseEvent) {
          clientX = event.clientX;
          clientY = event.clientY;
        } else {
          clientX = event.touches[0].clientX;
          clientY = event.touches[0].clientY;
        }

        const offsetX = clientX - rect.left - rect.width / 2;
        const offsetY = clientY - rect.top - rect.height / 2;
        const moveX = (offsetX / rect.width) * val;
        const moveY = (offsetY / rect.height) * val;

        this.renderer.setStyle(textElement, 'transform', `translate(${moveX}px, ${moveY}px)`);
      };

      const applyStyles = () => {
        this.renderer.addClass(textElement, 'text-secondary');
        this.renderer.addClass(textElement, 'shadow-xs');
        this.renderer.addClass(textElement, 'shadow-accent');
      };

      const resetPosition = () => {
        this.renderer.setStyle(textElement, 'transform', 'translate(0, 0)');
        this.renderer.removeClass(textElement, 'text-secondary');
        this.renderer.removeClass(textElement, 'shadow-xs');
      };

      const mouseMoveListener = this.renderer.listen(textElement, 'mousemove', moveAway);
      const mouseLeaveListener = this.renderer.listen(textElement, 'mouseleave', resetPosition);
      const touchStartListener = this.renderer.listen(textElement, 'touchstart', (event: TouchEvent) => {
        applyStyles();
        moveAway(event);
        document.body.style.overflow = 'hidden';
      });
      const touchEndListener = this.renderer.listen(textElement, 'touchend', () => {
        resetPosition();
        document.body.style.overflow = '';
      });

      // Attach and store reference for removal
      const touchMoveHandler = (event: TouchEvent) => {
        event.preventDefault();
        moveAway(event);
      };
      textElement.addEventListener('touchmove', touchMoveHandler, { passive: false });

      this.textListeners.set(textElement, [
        mouseMoveListener,
        mouseLeaveListener,
        touchStartListener,
        touchEndListener,
        () => textElement.removeEventListener('touchmove', touchMoveHandler)
      ]);
    });
  }

  private initializeTouchBox() {
    if (!this.touchBox) return;

    this.cleanupTouchBoxListeners();

    const touchBoxElement = this.touchBox.nativeElement;

    const touchStartListener = this.renderer.listen(touchBoxElement, 'touchstart', () => {
      this.renderer.addClass(touchBoxElement, 'border-primary');
    });

    const touchMoveListener = this.renderer.listen(touchBoxElement, 'touchmove', () => {
      this.renderer.addClass(touchBoxElement, 'border-primary');
    });

    const touchEndListener = this.renderer.listen(touchBoxElement, 'touchend', () => {
      setTimeout(() => {
        this.renderer.removeClass(touchBoxElement, 'border-primary');
      }, 200);
    });

    this.touchBoxListeners = [touchStartListener, touchMoveListener, touchEndListener];
  }

  private initializeCarousel() {
    if (!this.carousel) return;

    this.cleanupCarouselListeners();

    const carouselElement = this.carousel.nativeElement;

    const touchStartListener = this.renderer.listen(carouselElement, 'touchstart', () => {
      this.renderer.addClass(carouselElement, 'shadow-lg');
      this.renderer.addClass(carouselElement, 'shadow-secondary');
    });

    const touchMoveListener = this.renderer.listen(carouselElement, 'touchmove', (event: TouchEvent) => {
      this.renderer.addClass(carouselElement, 'shadow-xl');
      this.renderer.addClass(carouselElement, 'shadow-secondary');
    });

    const touchEndListener = this.renderer.listen(carouselElement, 'touchend', () => {
      setTimeout(() => {
        this.renderer.removeClass(carouselElement, 'shadow-xl');
        this.renderer.removeClass(carouselElement, 'shadow-secondary');
      }, 200);
    });

    this.carouselListeners.push(touchStartListener, touchMoveListener, touchEndListener);
  }

  private cleanupMovableTextListeners() {
    this.textListeners.forEach((listeners, element) => {
      listeners.forEach((removeListener) => removeListener());
    });
    this.textListeners.clear();
  }

  private cleanupTouchBoxListeners() {
    this.touchBoxListeners.forEach((removeListener) => removeListener());
    this.touchBoxListeners = [];
  }

  private cleanupCarouselListeners() {
    this.carouselListeners.forEach((removeListener) => removeListener());
    this.carouselListeners = [];
  }
}
