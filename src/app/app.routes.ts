import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users';
import { AddUserComponent } from './pages/add-user/add-user';

// 20250624 mod by jimmy for 編輯使用者功能
import { EditUserComponent } from './pages/edit-user/edit-user';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
  { path: 'add-user', component: AddUserComponent },
  // 20250624 mod by jimmy for 編輯使用者功能
  { path: 'edit-user/:id', component: EditUserComponent } // 讓edit-user.ts能夠取得路由 /edit-user/:id 的使用者ID。
];
