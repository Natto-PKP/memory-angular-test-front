import { Component } from '@angular/core';
import { AccountService } from './account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-memory';

  constructor(public account: AccountService) {
    // TEMP
    this.account.user = true;
    localStorage.setItem(
      'token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndtYWludmllbGxlQGdtYWlsLmNvbSIsImlkIjoyMDcwMzYsInBsYXRmb3JtIjoiaGVsb2dpIiwiaWF0IjoxNjU1NDg4ODk5LCJleHAiOjE2NTY2ODg4OTl9.zKvHvcb_fc4yHNSX6VGGEN3KGq6Fkfj7VhBszcpBdj0'
    );
  }
}
