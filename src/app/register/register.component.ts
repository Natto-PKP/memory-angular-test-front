import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  error: string | null = null;
  form = this.formBuilder.group({ email: '', password: '' });

  constructor(
    private account: AccountService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  onSubmit(): void {
    const { email, password } = this.form.value;
    if (!email) this.error = 'Email not given';
    if (!password) this.error = 'Password not given';
    if (this.error) return;

    const body = <{ email: string; password: string }>{ email, password };
    this.account.register(body).subscribe({
      next: () => {
        this.account.login(body).subscribe({
          next: ({ token }) => {
            this.account.user = true;
            localStorage.setItem('token', token);
            this.router.navigate(['/']);
          },
          error: () => (this.error = 'Error Occurred'),
        });
      },
      error: () => (this.error = 'Error Occurred'),
    });
  }
}
