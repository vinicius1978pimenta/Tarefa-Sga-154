import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, computed, signal } from '@angular/core';
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

  search = signal('');
  categoryFilter = signal('');
  dateFilter = signal(''); 
  showOnlyIncomplete = signal(false);




 // Lista de categorias únicas atualizada automaticamente
  categories = computed(() => {
    const cats = this.taskService.tasks().map(task => task.category);
    return Array.from(new Set(cats));
  });


  // Computed para filtrar tarefas
 filteredTasks = computed(() => {
  const searchValue = this.search().toLowerCase();
  const category = this.categoryFilter();
  const date = this.dateFilter();
  const onlyIncomplete = this.showOnlyIncomplete();

  return this.taskService.tasks().filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchValue);
    const matchesCategory = category ? task.category === category : true;
    const matchesDate = date ? task.dueDate === date : true;
    const matchesIncomplete = onlyIncomplete ? !task.completed : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDate &&
      matchesIncomplete
    );
  });
});



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

   onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryFilter.set(value);
  }
}
