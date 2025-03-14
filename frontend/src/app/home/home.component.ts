import { Component, ElementRef, ViewChildren, QueryList, Renderer2, AfterViewInit, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, AfterViewChecked {
  @ViewChildren('movableText') movableTextElements!: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.initializeMovableText();
  }

  ngAfterViewChecked() {
    // Re-initialize if the content has changed
    this.initializeMovableText();
  }

  private initializeMovableText() {
    this.movableTextElements.forEach((textElementRef) => {
      const textElement = textElementRef.nativeElement;
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

      const resetPosition = () => {
        this.renderer.setStyle(textElement, 'transform', 'translate(0, 0)');
      };

      // Listen for both mouse and touch events
      this.renderer.listen(textElement, 'mousemove', moveAway);
      this.renderer.listen(textElement, 'mouseleave', resetPosition);
      this.renderer.listen(textElement, 'touchstart', moveAway);
      this.renderer.listen(textElement, 'touchend', resetPosition);
    });
  }
}