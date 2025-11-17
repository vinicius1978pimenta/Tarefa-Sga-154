import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../model/task';

@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.html',
})
export class TaskList implements OnInit {
  taskService = inject(TaskService);

  ngOnInit(): void {
    this.taskService.getAll();
  }

toggleComplete(task: Task, value: boolean) {
  const action = value ? 'marcar como concluída' : 'desmarcar';
  if (confirm(`Deseja realmente ${action} esta tarefa?`)) {
    const updatedTask = { completed: value }; 
    this.taskService.update(task.id, updatedTask);
    
    // Atualiza localmente para refletir na UI
    this.taskService.tasks.update(list =>
      list.map(item => item.id === task.id ? { ...item, completed: value } : item)
    );
  }
}


  deleteTask(task: Task): void {
    if (confirm('Você tem certeza que deseja deletar esta tarefa?')) {
      this.taskService.delete(task.id);
    }
  }
}
