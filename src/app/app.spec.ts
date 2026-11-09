import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render navbar brand', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.navbar-brand')?.textContent).toContain('Spring JWT');
  });

  it('should render footer with university and author', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const footer = (fixture.nativeElement as HTMLElement).querySelector('footer')?.textContent;
    expect(footer).toContain('Universidad El Bosque');
    expect(footer).toContain('@judalesa');
  });
});
