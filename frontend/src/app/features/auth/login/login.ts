import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './login.html',

  styleUrls: ['./login.css']
})

export class Login {

  loading = false;
  errorMessage = '';
  loginForm: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm =
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

  }


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
        next: (response) => {

          if (
            response.user.role === 'recruiter'
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


        error: (error) => {

          console.error('LOGIN ERROR:',  error);
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