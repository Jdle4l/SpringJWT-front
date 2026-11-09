import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

function samePassword(group: AbstractControl) {
  return group.get('password')?.value === group.get('confirm')?.value ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly error = signal('');
  protected readonly success = signal('');
  protected readonly loading = signal(false);
  protected readonly form = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.pattern(/^[^<>]+$/)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirm: ['', Validators.required],
    },
    { validators: samePassword },
  );

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.success.set('');
    const { username, password } = this.form.getRawValue();
    this.auth.register(username, password).subscribe({
      next: (msg) => {
        this.loading.set(false);
        this.success.set(msg || 'Usuario registrado exitosamente');
        this.form.reset();
      },
      error: (e: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(
          e.status === 0
            ? 'No se pudo conectar con el servidor.'
            : typeof e.error === 'string' && e.error
              ? e.error
              : 'Error al registrar el usuario.',
        );
      },
    });
  }
}
