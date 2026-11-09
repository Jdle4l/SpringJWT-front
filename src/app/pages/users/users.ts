import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Role, User } from '../../core/models';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule],
  templateUrl: './users.html',
})
export class Users implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(UserService);
  protected readonly auth = inject(AuthService);

  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal(false);
  protected readonly message = signal<{ type: 'success' | 'danger'; text: string } | null>(null);
  /** null = formulario oculto; 'new' = creando; number = editando ese id */
  protected readonly editing = signal<'new' | number | null>(null);
  protected readonly toDelete = signal<User | null>(null);
  protected readonly roles: Role[] = ['USER', 'ADMIN'];

  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.pattern(/^[^<>]+$/)]],
    password: ['', Validators.required],
    role: ['USER' as Role, Validators.required],
  });

  ngOnInit() {
    this.load();
  }

  protected load() {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (list) => {
        this.users.set(list);
        this.loading.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.loading.set(false);
        // Sin autenticación válida (token vencido) el back responde 401/403
        if (e.status === 401 || e.status === 403) {
          this.auth.logout();
        } else {
          this.fail(e, 'No se pudo cargar la lista.');
        }
      },
    });
  }

  protected openNew() {
    this.form.reset({ username: '', password: '', role: 'USER' });
    this.editing.set('new');
  }

  protected openEdit(u: User) {
    this.form.reset({ username: u.username, password: '', role: u.role ?? 'USER' });
    this.editing.set(u.id!);
  }

  protected cancel() {
    this.editing.set(null);
  }

  protected save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const target = this.editing();
    const value = this.form.getRawValue();
    const req =
      target === 'new' ? this.api.create(value) : this.api.update(target as number, value);
    req.subscribe({
      next: (msg) => {
        this.message.set({ type: 'success', text: msg });
        this.editing.set(null);
        this.load();
      },
      error: (e) => this.fail(e, 'No se pudo guardar el usuario.'),
    });
  }

  protected confirmDelete(u: User) {
    this.toDelete.set(u);
  }

  protected doDelete() {
    const u = this.toDelete();
    if (!u?.id) return;
    this.api.delete(u.id).subscribe({
      next: (msg) => {
        this.message.set({ type: 'success', text: msg });
        this.toDelete.set(null);
        this.load();
      },
      error: (e) => {
        this.toDelete.set(null);
        this.fail(e, 'No se pudo eliminar el usuario.');
      },
    });
  }

  private fail(e: HttpErrorResponse, fallback: string) {
    const text =
      e.status === 0
        ? 'No se pudo conectar con el servidor.'
        : e.status === 403
          ? 'No tienes permisos para esta acción.'
          : typeof e.error === 'string' && e.error
            ? e.error
            : fallback;
    this.message.set({ type: 'danger', text });
  }
}
