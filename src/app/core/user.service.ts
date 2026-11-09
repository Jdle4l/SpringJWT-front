import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { API_URL } from './api.config';
import { User } from './models';

const API = `${API_URL}/user`;

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  /** El back responde 204 (sin cuerpo) cuando no hay usuarios. */
  getAll() {
    return this.http.get<User[] | null>(`${API}/getall`).pipe(map((r) => r ?? []));
  }

  create(user: User) {
    return this.http.post(`${API}/createjson`, user, { responseType: 'text' });
  }

  update(id: number, user: User) {
    return this.http.put(`${API}/updatejson`, user, { params: { id }, responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${API}/deletebyid/${id}`, { responseType: 'text' });
  }
}
