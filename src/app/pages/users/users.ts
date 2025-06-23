// 20250623 mod by jimmy for 新增使用者功能
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})

// 20250623 mod by jimmy for 新增使用者功能
export class UsersComponent implements OnInit {
  // 20250623 mod by jimmy for 新增使用者功能
  // users = [
  //     { id: 1, name: '王小明', email: 'xiaoming@example.com' },
  //     { id: 2, name: '陳美麗', email: 'meili@example.com' },
  //     { id: 3, name: '張大衛', email: 'david@example.com' }
  //   ];

  // 20250623 mod by jimmy for 新增使用者功能
  users: { id: number, name: string, email: string }[] = [];
  ngOnInit() {
    const stored = localStorage.getItem('users'); // 從localStorage取出東西

    // 先看localStorage有沒有東西
    if (stored) {
      this.users = JSON.parse(stored); // 有的話 : 把localStorage的users資料轉為js的資料型態
    } else {
      // 如果沒資料的話 : 用土炮的方式初始化預設資料
      this.users = [
        { id: 1, name: '王小明', email: 'xiaoming@example.com' },
        { id: 2, name: '陳美麗', email: 'meili@example.com' },
        { id: 3, name: '張大衛', email: 'david@example.com' }
      ];
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  deleteUser(id: number) {
    const user = this.users.find(u => u.id === id);

    if (user && confirm('是否確定刪除 ? ')){
      this.users = this.users.filter(u => u.id !== id); //透過將users陣列做filter方法，保留id不同的剔除id相同的，實現刪除

      // 20250623 mod by jimmy for 新增使用者功能
      localStorage.setItem('users', JSON.stringify(this.users)); // 透過filter方法更新後的使用者資料重新存回 localStorage
      console.log(`${user.name} 已被刪除`);
    }
  }
}

