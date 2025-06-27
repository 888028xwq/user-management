import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 20250623 mod by jimmy for 新增使用者功能
import { Router } from '@angular/router'; //路徑 : 新增成功後返回users頁面
import { FormsModule } from '@angular/forms'; //管理使用者輸入資料


@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.css']
})

// 20250623 mod by jimmy for 新增使用者功能
export class AddUserComponent {
  name = '';
  email = '';

  constructor(private router: Router) {} // 這個 component 具備路由導向能力

  addUser() {
    // 20250627 mod by jimmy for Email 格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('請輸入正確的 Email 格式');
      return;
    }

    const newUser = {
      id: Date.now(), // 暫時用 timestamp 當作 ID
      name: this.name, // this.name表示使用者在前端輸入的資料
      email: this.email // this.email表示使用者在前端輸入的資料
    };

    const users = JSON.parse(localStorage.getItem('users') || '[]'); //如果'users'不存在就回傳[]。用JSON.parse()把JSON轉為js的陣列或物件
    users.push(newUser); // 推入新資料到陣列
    localStorage.setItem('users', JSON.stringify(users));  // 把陣列的資料放入localStorage的'users'。用JSON.stringify()把users轉為JSON

    this.router.navigate(['/users']); // 導回使用者清單頁
  }
}
