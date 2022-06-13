import { Component, OnDestroy } from '@angular/core';
import { ToastService } from '@app/_services/toast.service';


@Component({ selector: 'app-toast', templateUrl: './toast.component.html' })
export class ToastComponent implements OnDestroy {
  config: any;

  constructor(public toastService: ToastService) {}
  
  ngOnDestroy(): void {
    this.toastService.clear();
  }
}