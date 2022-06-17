import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BoardService {
  constructor(private http: HttpClient) {}

  getCards(size = 4) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );

    return this.http.get<string[]>(
      `https://api.littleworker.fr/2.0/account/cards?size=${size}`,
      { headers }
    );
  }

  postScore(body: { time: number; moves: number }) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );

    return this.http.post(
      'https://api.littleworker.fr/2.0/account/cards/scores',
      body,
      { headers }
    );
  }
}
