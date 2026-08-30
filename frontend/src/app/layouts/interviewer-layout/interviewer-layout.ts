import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../../shared/components/sidebar/sidebar';

import { Topbar } from '../../shared/components/topbar/topbar';

@Component({
  selector: 'app-interviewer-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Topbar
  ],
  templateUrl: './interviewer-layout.html',
  styleUrl: './interviewer-layout.css'
})
export class InterviewerLayout {}