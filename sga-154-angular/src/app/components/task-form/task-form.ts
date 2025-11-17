import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../model/task';

@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './task-form.html',
})
export class TaskForm implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskForm!: FormGroup;
  taskId?: number;

  categories = ['Trabalho', 'Estudos', 'Lazer', 'Outros'];

  ngOnInit(): void {
    this.initForm();
    this.loadTaskIfEditing();
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      completed: [false],
      category: ['', Validators.required],
      // Default para a data: hoje, formato YYYY-MM-DD
      dueDate: [new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  private loadTaskIfEditing(): void {
    this.route.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.taskId = +idParam;
        const task = this.taskService.tasks().find(t => t.id === this.taskId);
        if (task) {
          // Converte a data existente para string YYYY-MM-DD se necessário
          const taskPatch = {
            ...task,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
          };
          this.taskForm.patchValue(taskPatch);
        }
      }
    });
  }

  submitForm(): void {
  if (this.taskForm.invalid) {
    this.taskForm.markAllAsTouched();
    return;
  }

  const formValue = this.taskForm.value;

  const taskData: Omit<Task, 'id'> = {
    title: formValue.title,
    category: formValue.category,
    completed: formValue.completed,
    dueDate: formValue.dueDate
      ? new Date(formValue.dueDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0], // garante sempre string
  };


  if (this.taskId) {
    const confirmed = confirm('Você tem certeza que deseja atualizar esta tarefa?');
    if (!confirmed) return;
    this.taskService.update(this.taskId, taskData);
  } else {
    this.taskService.create(taskData);
  }

  this.router.navigate(['/']);
}

}
