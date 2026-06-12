import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoteService, Activity, Note } from '../../services/note.service';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="admin-dashboard">
      <header class="dashboard-header">
        <div class="header-main">
          <div class="logo">
            <span class="icon">📋</span>
            <h1>Display Log</h1>
          </div>
          <nav class="main-nav">
            <a routerLink="/notes" class="nav-link">Notes</a>
            <a routerLink="/activity-log" class="nav-link active">Display Log</a>
            <button class="btn-logout" (click)="logout()">Logout</button>
          </nav>
        </div>
      </header>

      <main class="dashboard-content single-col">
        <div *ngIf="isLoading" class="loading-state glass slide-in" style="margin-bottom: 20px; padding: 20px; text-align: center; color: #a29bfe;">
          <span class="spinner">⏳</span> Loading data from database...
        </div>

        <div *ngIf="errorMessage && !isLoading" class="error-box glass slide-in" style="margin-bottom: 20px; padding: 15px; background: rgba(255, 77, 77, 0.1); border-left: 4px solid #ff4d4d; color: #ff4d4d;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">⚠️</span>
            <span>{{ errorMessage }}</span>
          </div>
        </div>
        
        <section class="activity-section" *ngIf="!isLoading">
          <div class="card glass">
            <div class="section-header">
              <h2>Note Inventory</h2>
              <span class="badge">{{ notes.length }} notes</span>
            </div>
            
            <div class="notes-grid" style="margin-top: 20px;">
              <div *ngFor="let note of notes" class="note-card glass slide-in">
                <div class="note-header">
                  <h3>{{ note.title }}</h3>
                  <div class="actions">
                    <button class="btn-icon edit" (click)="startEdit(note)" title="Edit">
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6.02 20.71,5.63L18.37,3.29C17.98,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                      </svg>
                    </button>
                    <button class="btn-icon delete" (click)="deleteNote(note._id!)" title="Delete">
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19V4M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="note-content">{{ note.content }}</p>
                <div class="note-footer">
                  <span class="note-date">{{ note.createdAt | date:'short' }}</span>
                </div>
              </div>
            </div>
            <div *ngIf="notes.length === 0" class="empty-state">No notes found.</div>
          </div>

          <div class="card glass" style="margin-top: 30px;">
            <div class="section-header">
              <h2>Recent Activity</h2>
              <span class="badge">{{ activities.length }} total</span>
            </div>
            <div class="activity-list">
              <div *ngFor="let activity of activities" class="activity-item slide-in">
                <div class="activity-icon" [ngClass]="getIconClass(activity.actionType)">
                  <span>{{ activity.actionType === 'Note Deleted' ? '-' : '+' }}</span>
                </div>
                <div class="activity-info">
                  <p class="activity-text">
                    <span class="action">{{ activity.actionType }}</span>: 
                    <i>"{{ activity.noteTitle }}"</i>
                  </p>
                  <span class="activity-time">{{ activity.timestamp | date:'medium' }}</span>
                </div>
              </div>
              <div *ngIf="activities.length === 0" class="empty-state">No activity logs yet.</div>
            </div>
          </div>
        </section>
      </main>

      <!-- Edit Modal -->
      <div *ngIf="editingNote" class="modal-overlay">
        <div class="modal-card glass slide-in">
          <h2>Edit Note</h2>
          <form (ngSubmit)="saveEdit()" #editForm="ngForm">
            <div class="form-group">
              <label>Title</label>
              <input type="text" name="editTitle" [(ngModel)]="editingNote.title" required>
            </div>
            <div class="form-group">
              <label>Content</label>
              <textarea name="editContent" [(ngModel)]="editingNote.content" required></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="cancelEdit()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="!editForm.form.valid">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ActivityLogComponent implements OnInit {
  activities: Activity[] = [];
  notes: Note[] = [];
  editingNote: Note | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private noteService: NoteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadActivities();
    this.loadNotes();
  }

  loadActivities() {
    this.isLoading = true;
    this.noteService.getActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.errorMessage = '';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading activities:', err);
        this.errorMessage = err.error?.message || 'Failed to load activity logs. Is the backend running?';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadNotes() {
    this.isLoading = true;
    this.noteService.getNotes().subscribe({
      next: (data) => {
        this.notes = data;
        this.errorMessage = '';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading notes:', err);
        this.errorMessage = err.error?.message || 'Failed to load notes. Please check your database connection.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(note: Note) {
    this.editingNote = { ...note };
  }

  cancelEdit() {
    this.editingNote = null;
  }

  saveEdit() {
    if (!this.editingNote) return;
    this.noteService.updateNote(this.editingNote._id!, this.editingNote).subscribe(() => {
      this.editingNote = null;
      this.loadNotes();
      this.loadActivities(); // Refresh activities too
    });
  }

  deleteNote(id: string) {
    if (confirm('Delete this note?')) {
      this.noteService.deleteNote(id).subscribe(() => {
        this.loadNotes();
        this.loadActivities(); // Refresh activities too
      });
    }
  }

  getIconClass(action: string): string {
    return action.toLowerCase().replace(/\s+/g, '-');
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
