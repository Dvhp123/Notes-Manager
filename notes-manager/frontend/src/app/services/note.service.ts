import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Note {
  _id?: string;
  title: string;
  content: string;
  createdAt?: Date;
}

export interface Activity {
  _id?: string;
  actionType: string;
  noteTitle: string;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`);
  }

  addNote(note: Note): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/notes`, note);
  }

  updateNote(id: string, note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/notes/${id}`, note);
  }

  deleteNote(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notes/${id}`);
  }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/activities`);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}
