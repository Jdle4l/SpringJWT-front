import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from './api.config';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;
  const isAuthCall = req.url.startsWith(`${API_URL}/auth/`);
  const authReq = token && !isAuthCall
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Token vencido/ inválido: el back responde 401/403 en /user
      if (!isAuthCall && token && err.status === 401) {
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};
