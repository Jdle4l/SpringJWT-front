import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from './api.config';
import { AuthResponse, Role } from './models';

const API = `${API_URL}/auth`;
const KEY = 'session';

interface Session {
  token: string;
  role: Role;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly session = signal<Session | null>(this.load());

  readonly isLoggedIn = computed(() => this.session() !== null);
  readonly isAdmin = computed(() => this.session()?.role === 'ADMIN');
  readonly username = computed(() => this.session()?.username ?? '');
  readonly role = computed(() => this.session()?.role ?? null);

  get token(): string | null {
    return this.session()?.token ?? null;
  }

  login(username: string, password: string) {
    return this.http.post<AuthResponse>(`${API}/login`, { username, password }).pipe(
      tap((res) => {
        const s: Session = { token: res.token, role: res.role, username };
        this.session.set(s);
        try {
          localStorage.setItem(KEY, JSON.stringify(s));
        } catch {}
      }),
    );
  }

  register(username: string, password: string) {
    return this.http.post(`${API}/register`, { username, password }, { responseType: 'text' });
  }

  logout(redirect = true) {
    this.session.set(null);
    try {
      localStorage.removeItem(KEY);
    } catch {}
    if (redirect) this.router.navigate(['/login']);
  }

  private load(): Session | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }
}
