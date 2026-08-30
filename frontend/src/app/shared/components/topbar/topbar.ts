import {
  Component,
  inject
} from '@angular/core';

import {
  AuthService
} from '../../../core/services/auth';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar {

  authService =
    inject(AuthService);

  user =
    this.authService.getUser();
}