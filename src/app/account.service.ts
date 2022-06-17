import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccountService {
  user = true;

  constructor(private http: HttpClient) {
    this.disconnect();
  }

  disconnect() {
    localStorage.clear();
    this.user = false;
  }

  login({ email: login, password }: { email: string; password: string }) {
    return this.http.post<{ token: string }>(
      'https://api.littleworker.fr/2.0/account/login',
      { login, password }
    );
  }

  register(body: { email: string; password: string }) {
    return this.http.post(
      'https://api.littleworker.fr/2.0/account/register',
      body
    );
  }
}
