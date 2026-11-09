import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <nav class="navbar navbar-dark bg-dark mb-4">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Spring JWT</a>
        <div class="d-flex align-items-center gap-2">
          @if (auth.isLoggedIn()) {
            <span class="text-light small">{{ auth.username() }}</span>
            <span class="badge" [class.text-bg-danger]="auth.isAdmin()" [class.text-bg-primary]="!auth.isAdmin()">{{ auth.role() }}</span>
            <button class="btn btn-outline-light btn-sm" (click)="auth.logout()">Salir</button>
          } @else {
            <a class="btn btn-outline-light btn-sm" routerLink="/login">Entrar</a>
            <a class="btn btn-light btn-sm" routerLink="/register">Registro</a>
          }
        </div>
      </div>
    </nav>
  `,
})
export class Navbar {
  protected readonly auth = inject(AuthService);
}
