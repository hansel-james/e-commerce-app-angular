import { Component, ElementRef, ViewChildren, QueryList, Renderer2, AfterViewInit, AfterViewChecked, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { RouterModule } from '@angular/router';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  categories: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterModule]
})
export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChildren('movableText') movableTextElements!: QueryList<ElementRef>;
  @ViewChildren('welcomeText') welcomeTextElements!: QueryList<ElementRef>;
  @ViewChild('touchBox') touchBox!: ElementRef;
  @ViewChild('carousel') carousel!: ElementRef;

  left: string = ''
  right: string = ''

  private textListeners = new Map<HTMLElement, (() => void)[]>();
  private welcomeTextListeners = new Map<HTMLElement, (() => void)[]>();
  private touchBoxListeners: (() => void)[] = [];
  private carouselListeners: (() => void)[] = [];
  products: Product[] | null = null;
  isLoading: boolean = true;

  constructor(private renderer: Renderer2, private productService: ProductService) { }
  ngOnInit(): void {
    this.isLoading = true;
    const queryParams = {
      // sort: 'price-high-to-low'
    };
    this.productService.getProducts(queryParams).subscribe({
      next: (data) => {
        this.products = data.products;
        this.isLoading = false;
      }, 
      error: (error) => {
        console.error('error loading home products : ', error);
      }
    })
  }

  ngAfterViewInit() {
    this.initializeMovableText();
    this.initializeTouchBox();
    this.initializeCarousel();
    this.initializeWelcomeText();
  }

  ngAfterViewChecked() {
    this.cleanupMovableTextListeners();
    this.initializeMovableText();
    this.initializeCarousel();
    this.initializeWelcomeText();
  }

  ngOnDestroy() {
    this.cleanupMovableTextListeners();
    this.cleanupTouchBoxListeners();
    this.cleanupCarouselListeners();
    this.cleanupWelcomeTextListeners();
  }

  private initializeWelcomeText() {
    if (!this.welcomeTextElements || this.welcomeTextElements.length === 0) return;

    this.cleanupWelcomeTextListeners();

    this.welcomeTextElements.forEach((textElementRef) => {
        const textBlock = textElementRef.nativeElement;
        const pointer = textBlock.querySelector('.pointer');

        if (!pointer) {
            console.error("Pointer element not found inside welcomeText!");
            return;
        }

        // Smooth motion for regular movement, disabled for first appearance
        this.renderer.setStyle(pointer, 'transition', 'transform 0.1s ease-out, opacity 0.2s');

        const movePointer = (event: MouseEvent | TouchEvent, instant = false) => {
            const rect = textBlock.getBoundingClientRect();
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
            const moveX = (offsetX / rect.width) * 45;
            const moveY = (offsetY / rect.height) * 45;

            if (instant) {
                this.renderer.setStyle(pointer, 'transition', 'none'); // Disable transition
            } else {
                this.renderer.setStyle(pointer, 'transition', 'transform 0.1s ease-out');
            }

            this.renderer.setStyle(pointer, 'transform', `translate(${offsetX - moveX}px, ${offsetY - moveY}px)`);
        };

        const showPointer = (event: MouseEvent | TouchEvent) => {
            movePointer(event, true); // Instantly position the pointer
            this.renderer.setStyle(pointer, 'opacity', '1');
            this.renderer.setStyle(textBlock, 'cursor', 'none'); // Hide default cursor
        };

        const hidePointer = () => {
            this.renderer.setStyle(pointer, 'opacity', '0');
            this.renderer.setStyle(textBlock, 'cursor', 'auto'); // Restore default cursor
        };

        // Mouse events
        const mouseMoveListener = this.renderer.listen(textBlock, 'mousemove', movePointer);
        const mouseEnterListener = this.renderer.listen(textBlock, 'mouseenter', showPointer);
        const mouseLeaveListener = this.renderer.listen(textBlock, 'mouseleave', hidePointer);

        // Touch events
        const touchMoveListener = this.renderer.listen(textBlock, 'touchmove', (event) => {
            event.preventDefault();
            movePointer(event);
        });
        const touchStartListener = this.renderer.listen(textBlock, 'touchstart', showPointer);
        const touchEndListener = this.renderer.listen(textBlock, 'touchend', hidePointer);

        this.welcomeTextListeners.set(textBlock, [
            mouseMoveListener,
            mouseEnterListener,
            mouseLeaveListener,
            touchMoveListener,
            touchStartListener,
            touchEndListener,
        ]);
    });
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
      };

      const resetPosition = () => {
        this.renderer.setStyle(textElement, 'transform', 'translate(0, 0)');
        this.renderer.removeClass(textElement, 'text-secondary');
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
      this.renderer.removeClass(touchBoxElement, 'border-primary/40');
      this.renderer.addClass(touchBoxElement, 'border-primary/100');
    });

    const touchMoveListener = this.renderer.listen(touchBoxElement, 'touchmove', () => {
      this.renderer.removeClass(touchBoxElement, 'border-primary/40');
      this.renderer.addClass(touchBoxElement, 'border-primary/100');
    });

    const touchEndListener = this.renderer.listen(touchBoxElement, 'touchend', () => {
      setTimeout(() => {
        this.renderer.removeClass(touchBoxElement, 'border-primary/100');
        this.renderer.addClass(touchBoxElement, 'border-primary/40');
      }, 200);
    });

    this.touchBoxListeners = [touchStartListener, touchMoveListener, touchEndListener];
  }

  private initializeCarousel() {
    if (!this.carousel) return;

    this.cleanupCarouselListeners();

    const carouselElement = this.carousel.nativeElement;

    const touchStartListener = this.renderer.listen(carouselElement, 'touchstart', () => {
      this.renderer.removeClass(carouselElement, 'shadow-sm');
      this.renderer.addClass(carouselElement, 'shadow-lg');
      this.renderer.addClass(carouselElement, 'shadow-secondary/30');
    });

    const touchMoveListener = this.renderer.listen(carouselElement, 'touchmove', () => {
      this.renderer.removeClass(carouselElement, 'shadow-sm');
      this.renderer.addClass(carouselElement, 'shadow-lg');
      this.renderer.addClass(carouselElement, 'shadow-secondary/30');
    });

    const touchEndListener = this.renderer.listen(carouselElement, 'touchend', () => {
      setTimeout(() => {
        this.renderer.removeClass(carouselElement, 'shadow-lg');
        this.renderer.removeClass(carouselElement, 'shadow-secondary/30');
        this.renderer.addClass(carouselElement, 'shadow-sm');
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

  private cleanupWelcomeTextListeners() {
    this.welcomeTextListeners.forEach((listeners, element) => {
      listeners.forEach((removeListener) => removeListener());
    });
    this.welcomeTextListeners.clear();
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
