import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoteService, Note } from '../../services/note.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './notes.component.html'
})
export class NotesComponent implements OnInit {
  newNote: Note = { title: '', content: '' };

  constructor(
    private noteService: NoteService
  ) {}

  ngOnInit() {}

  addNote() {
    if (!this.newNote.title || !this.newNote.content) return;
    this.noteService.addNote(this.newNote).subscribe(() => {
      this.newNote = { title: '', content: '' };
      alert('Note added successfully!');
    });
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
