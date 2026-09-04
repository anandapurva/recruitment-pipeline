import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement
} from 'chart.js';

import {
  DashboardService,
  DashboardResponse
} from '../../core/services/dashboard';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  loading = false;
  errorMessage = '';

  dashboard: DashboardResponse | null = null;

  private jobChart: Chart | null = null;
  private stageChart: Chart | null = null;
  private weeklyChart: Chart | null = null;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.loading = true;
    this.errorMessage = '';

    // Destroy old charts before reloading
    this.destroyCharts();

    this.dashboardService.getDashboard().subscribe({

      next: response => {

        console.log('DASHBOARD RESPONSE:', response);

        this.dashboard = response;
        this.loading = false;

        this.cdr.detectChanges();

        /*
         * Wait until Angular has rendered the canvases
         * after dashboard data is available.
         */
        setTimeout(() => {
          this.createCharts();
        }, 0);
      },

      error: error => {

        console.error('DASHBOARD ERROR:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to load dashboard.';

        this.loading = false;

        this.cdr.detectChanges();
      }

    });
  }


  createCharts(): void {

    if (!this.dashboard) {
      console.log('No dashboard data available');
      return;
    }

    console.log('Creating charts...');

    const jobCanvas =
      document.getElementById(
        'applicationsByJobChart'
      ) as HTMLCanvasElement | null;

    const stageCanvas =
      document.getElementById(
        'applicationsByStageChart'
      ) as HTMLCanvasElement | null;

    const weeklyCanvas =
      document.getElementById(
        'applicationsPerWeekChart'
      ) as HTMLCanvasElement | null;

    console.log('Job canvas:', jobCanvas);
    console.log('Stage canvas:', stageCanvas);
    console.log('Weekly canvas:', weeklyCanvas);


    if (jobCanvas) {
      this.createApplicationsByJobChart(jobCanvas);
    }

    if (stageCanvas) {
      this.createApplicationsByStageChart(stageCanvas);
    }

    if (weeklyCanvas) {
      this.createApplicationsPerWeekChart(weeklyCanvas);
    }

  }


  createApplicationsByJobChart(
    canvas: HTMLCanvasElement
  ): void {

    const jobs =
      this.dashboard?.applicationsByJob || [];

    console.log(
      'Applications by job:',
      jobs
    );

    // Destroy existing chart on this canvas
    Chart.getChart(canvas)?.destroy();

    this.jobChart = new Chart(canvas, {

      type: 'bar',

      data: {

        labels: jobs.map(
          job => job.title
        ),

        datasets: [
          {
            label: 'Applications',

            data: jobs.map(
              job => Number(job.application_count)
            ),

            backgroundColor: [
              '#10b981',
              '#3b82f6',
              '#8b5cf6',
              
              '#f59e0b',
              '#ef4444',
              '#06b6d4',
              '#ec4899'
            ],

            borderRadius: 6,

            borderWidth: 0
          }
        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false
          }

        },

        scales: {

          y: {

            beginAtZero: true,

            ticks: {
              precision: 0
            }

          }

        }

      }

    });

  }


  createApplicationsByStageChart(
    canvas: HTMLCanvasElement
  ): void {

    const stages =
      this.dashboard?.applicationsByStage || [];

    console.log(
      'Applications by stage:',
      stages
    );

    Chart.getChart(canvas)?.destroy();

    this.stageChart = new Chart(canvas, {

      type: 'doughnut',

      data: {

        labels: stages.map(
          item => item.stage
        ),

        datasets: [
          {
            data: stages.map(
              item => Number(item.application_count)
            ),

            backgroundColor: [
              '#3b82f6',
              '#ef4444',   
              '#f59e0b',
              '#10b981',
              '#8b5cf6',
              '#06b6d4',
              '#ec4899'
            ],

            borderWidth: 2,

            borderColor: '#ffffff'
          }
        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {

            position: 'bottom'

          }

        }

      }

    });

  }


  createApplicationsPerWeekChart(
    canvas: HTMLCanvasElement
  ): void {

    const weeks =
      this.dashboard?.applicationsPerWeek || [];

    console.log(
      'Applications per week:',
      weeks
    );

    Chart.getChart(canvas)?.destroy();

    this.weeklyChart = new Chart(canvas, {

      type: 'line',

      data: {

        labels: weeks.map(
          week =>
            new Date(
              week.week_start
            ).toLocaleDateString(
              'en-IN',
              {
                day: '2-digit',
                month: 'short'
              }
            )
        ),

        datasets: [
          {
            label: 'Applications',

            data: weeks.map(
              week => Number(week.application_count)
            ),

            borderColor: '#3b82f6',

            backgroundColor: 'rgba(59, 130, 246, 0.15)',

            pointBackgroundColor: '#3b82f6',

            pointBorderColor: '#ffffff',

            pointBorderWidth: 2,

            pointRadius: 4,

            tension: 0.3,

            fill: true
          }
        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false
          }

        },

        scales: {

          y: {

            beginAtZero: true,

            ticks: {
              precision: 0
            }

          }

        }

      }

    });

  }


  destroyCharts(): void {

    if (this.jobChart) {
      this.jobChart.destroy();
      this.jobChart = null;
    }

    if (this.stageChart) {
      this.stageChart.destroy();
      this.stageChart = null;
    }

    if (this.weeklyChart) {
      this.weeklyChart.destroy();
      this.weeklyChart = null;
    }

  }

}