import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/cruds';

  // Signal para armazenar as tarefas
  tasks = signal<Task[]>([]);

 
  getTasks() {
    return this.tasks();
  }

  
  getAll() {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (res) => this.tasks.set(res), // sobrescreve o signal com dados atuais do backend
      error: (err) => console.error('Erro ao buscar tasks:', err),
    });
  }

  
  create(data: Omit<Task, 'id'>) {
    this.http.post<Task>(this.apiUrl, data).subscribe({
      next: (created) => {
        // Evita duplicação caso já exista
        const exists = this.tasks().some(t => t.id === created.id);
        if (!exists) {
          this.tasks.update(list => [...list, created]);
        }
      },
      error: (err) => console.error('Erro ao criar task:', err),
    });
  }

  update(id: number, data: Partial<Task>, callback?: () => void) {
    this.http.patch(`${this.apiUrl}/${id}`, data).subscribe({
      next: (updated) => {
        // Atualiza o signal localmente para refletir imediatamente na UI
        this.tasks.update(list =>
          list.map(item => (item.id === id ? { ...item, ...updated } : item))
        );

        // Executa callback se fornecido (ex: recarregar lista)
        if (callback) callback();
      },
      error: (err) => console.error('Erro ao atualizar task:', err),
    });
  }
 
  delete(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.tasks.update(list => list.filter(item => item.id !== id));
      },
      error: (err) => console.error('Erro ao deletar task:', err),
    });
  }
}
