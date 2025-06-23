import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users';
import { AddUserComponent } from './pages/add-user/add-user';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
  { path: 'add-user', component: AddUserComponent }
];
