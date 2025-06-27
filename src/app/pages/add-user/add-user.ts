import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 20250623 mod by jimmy for 新增使用者功能
import { Router } from '@angular/router'; //路徑 : 新增成功後返回users頁面
import { FormsModule } from '@angular/forms'; //管理使用者輸入資料

// 20250627 mod by jimmy for API新增使用者功能
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators'; // 引入 catchError 操作符
import { throwError } from 'rxjs'; // 引入 throwError 函數

// 定義 User 介面，保持前後端資料結構一致
interface User {
  id?: number; // ID 在新增時是可選的，因為由後端生成
  name: string;
  email: string;
}

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.css']
})

// 20250623 mod by jimmy for 新增使用者功能
export class AddUserComponent {
  name = '';
  email = '';

  // 20250627 mod by jimmy for API新增使用者功能
  constructor(private router: Router, private http: HttpClient) {} // 這個 component 具備路由導向能力

  addUser() {
    // 20250627 mod by jimmy for Email 格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('請輸入正確的 Email 格式');
      return;
    }
    // 20250627 mod by jimmy for API新增使用者功能
    // const newUser = {
    //   id: Date.now(), // 暫時用 timestamp 當作 ID
    //   name: this.name, // this.name表示使用者在前端輸入的資料
    //   email: this.email // this.email表示使用者在前端輸入的資料
    // };

    // const users = JSON.parse(localStorage.getItem('users') || '[]'); //如果'users'不存在就回傳[]。用JSON.parse()把JSON轉為js的陣列或物件
    // users.push(newUser); // 推入新資料到陣列
    // localStorage.setItem('users', JSON.stringify(users));  // 把陣列的資料放入localStorage的'users'。用JSON.stringify()把users轉為JSON

    // this.router.navigate(['/users']); // 導回使用者清單頁

    const newUser: User = {
      name: this.name,
      email: this.email
    }

    const apiUrl = 'https://localhost:7278/api/Users';

    this.http.post<User>(apiUrl, newUser) // <User> 指定回應的型別，把前端新增的newUser傳到後端
      .pipe(
        catchError(error => {
          console.error('新增使用者失敗:', error);
          // 根據錯誤類型顯示不同的訊息給使用者
          alert('新增使用者失敗，請檢查網路或後端服務。');
          return throwError(() => new Error('新增使用者失敗')); // 拋出錯誤，阻止訂閱繼續執行
        })
      )
      .subscribe(
        (response) => {
          console.log('使用者新增成功:', response);
          // 如果新增成功，導回使用者清單頁
          this.router.navigate(['/users']);
        }
      );
  }
}
