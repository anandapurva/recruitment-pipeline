import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StalledAlert, StalledAlertService } from '../../core/services/stalled-alert';

@Component({
  selector: 'app-alerts',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './alerts.html',

  styleUrl: './alerts.css'
})

export class Alerts implements OnInit {

  alerts: StalledAlert[] = [];

  loading = false;

  errorMessage = '';

  constructor(
    private alertService: StalledAlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadAlerts();

  }

  loadAlerts(): void {

    this.loading = true;

    this.errorMessage = '';

    this.alertService
      .getAlerts()
      .subscribe({

        next: response => {

          console.log(
            'STALLED ALERTS:',
            response
          );

          this.alerts =
            response.alerts || [];

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'LOAD ALERTS ERROR:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load alerts.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }

  dismissAlert(alert: StalledAlert): void {

    this.alertService
      .dismissAlert(alert.id)
      .subscribe({

        next: () => {

          this.alerts =
            this.alerts.filter(
              item => item.id !== alert.id
            );

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'DISMISS ALERT ERROR:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to dismiss alert.';

        }

      });

  }

}