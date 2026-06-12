import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card glass slide-in">
        <div class="logo">
          <span class="icon">🔐</span>
          <h1>Admin Login</h1>
        </div>
        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label>Username</label>
            <input type="text" name="username" [(ngModel)]="credentials.username" required placeholder="admin">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" [(ngModel)]="credentials.password" required placeholder="admin123">
          </div>
          
          <div *ngIf="errorMessage" class="error-box">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-primary" [disabled]="!loginForm.form.valid">Login</button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage: string = '';

  constructor(private noteService: NoteService, private router: Router) {}

  login() {
    this.errorMessage = ''; // Reset error message
    this.noteService.login(this.credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/notes']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
