import { Component  } from '@angular/core';

import { RouterOutlet  } from '@angular/router';

import { Sidebar } from '../../shared/components/sidebar/sidebar';

import { Topbar } from '../../shared/components/topbar/topbar';

@Component({
  selector: 'app-recruiter-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Topbar
  ],
  templateUrl: './recruiter-layout.html',
  styleUrl: './recruiter-layout.css'
})
export class RecruiterLayout {}