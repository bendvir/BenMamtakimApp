import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMagnifier]',
  standalone: true
})
export class MagnifierDirective implements OnInit {
  @Input() appMagnifier: boolean | '' = true;

  private lens!: HTMLElement;
  private img!: HTMLImageElement;
  private readonly zoom = 2.5;
  private readonly lensSize = 140;

  private get enabled() { return this.appMagnifier !== false; }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (!this.enabled) return;
    this.img = this.el.nativeElement.querySelector('img');
    if (!this.img) return;

    this.lens = this.renderer.createElement('div');
    this.renderer.addClass(this.lens, 'mag-lens');
    this.renderer.appendChild(this.el.nativeElement, this.lens);
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'crosshair');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.enabled || !this.lens || !this.img) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const half = this.lensSize / 2;
    this.renderer.setStyle(this.lens, 'left', `${x - half}px`);
    this.renderer.setStyle(this.lens, 'top', `${y - half}px`);

    const bw = this.el.nativeElement.offsetWidth * this.zoom;
    const bh = this.el.nativeElement.offsetHeight * this.zoom;
    const bx = -(x * this.zoom - half);
    const by = -(y * this.zoom - half);

    this.renderer.setStyle(this.lens, 'backgroundImage', `url(${this.img.src})`);
    this.renderer.setStyle(this.lens, 'backgroundSize', `${bw}px ${bh}px`);
    this.renderer.setStyle(this.lens, 'backgroundPosition', `${bx}px ${by}px`);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.enabled && this.lens) this.renderer.setStyle(this.lens, 'opacity', '1');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.lens) this.renderer.setStyle(this.lens, 'opacity', '0');
  }
}
