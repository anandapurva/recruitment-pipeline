import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

  private fb = inject(FormBuilder);
  private authService =
    inject(AuthService);
  private router =
    inject(Router);

  loading = false;
  errorMessage = '';

  loginForm =
    this.fb.nonNullable.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required
        ]
      ]
    });

  submit(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login(
        this.loginForm.getRawValue()
      )
      .subscribe({

        next: response => {

          if (
            response.user.role ===
            'recruiter'
          ) {

            this.router.navigate([
              '/recruiter/dashboard'
            ]);

          } else {

            this.router.navigate([
              '/interviewer/applications'
            ]);
          }
        },

        error: error => {

          this.loading = false;

          this.errorMessage =
            error?.error?.message ||
            'Invalid email or password';
        },

        complete: () => {
          this.loading = false;
        }
      });
  }
}