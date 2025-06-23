import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})

export class UsersComponent {
  users = [
      { id: 1, name: '王小明', email: 'xiaoming@example.com' },
      { id: 2, name: '陳美麗', email: 'meili@example.com' },
      { id: 3, name: '張大衛', email: 'david@example.com' }
    ];

    deleteUser(id: number) {
      console.log('要刪除 ID：', id);
      this.users = this.users.filter(user => user.id !== id); //透過將users陣列做filter方法，保留id不同的剔除id相同的，實現刪除
    }
}
