import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { passwordMatchValidator } from '../../../core/validators/password-match.validator';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);


  registerForm = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],

      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/),
        ],
      ],

      password: ['', [Validators.required, Validators.minLength(8)]],

      confirmPassword: ['', Validators.required],
    },
    {
      validators: passwordMatchValidator(),
    },
  );

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, mobile, password } =
      this.registerForm.getRawValue();

    if (!username || !mobile || !password) {
      return;
    }

    this.authService.register({
      username,
      mobile,
      password,
    }).subscribe({
      next: (response) => {
        alert(response.message);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert(error.error?.message || 'Registration failed');
      },
    });

  }
}
