import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from './api.config';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('AuthService + interceptor', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  it('login guarda sesión y el interceptor añade Bearer', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('admin', 'x').subscribe();
    const r = http.expectOne(`${API_URL}/auth/login`);
    expect(r.request.headers.has('Authorization')).toBe(false);
    r.flush({ token: 'abc', role: 'ADMIN' });

    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.isAdmin()).toBe(true);

    TestBed.inject(UserService).getAll().subscribe();
    const g = http.expectOne(`${API_URL}/user/getall`);
    expect(g.request.headers.get('Authorization')).toBe('Bearer abc');
    g.flush(null);
  });

  it('logout limpia la sesión', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('u', 'p').subscribe();
    http.expectOne(`${API_URL}/auth/login`).flush({ token: 't', role: 'USER' });
    auth.logout(false);
    expect(auth.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('session')).toBeNull();
  });
});
