// 20250623 mod by jimmy for 新增使用者功能
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// 20250624 mod by jimmy for 編輯使用者功能
import { RouterModule } from '@angular/router'; 

// 20250624 mod by jimmy for 功能擴充 : 使用者搜尋
import { FormsModule } from '@angular/forms'; //管理使用者輸入資料

// 20250627 mod by jimmy for API啟動
import { HttpClient, HttpClientModule } from '@angular/common/http';

// 20250629 mod by jimmy for API刪除使用者功能
import { Observable, throwError  } from 'rxjs'; // 引入 Observable
import { catchError } from 'rxjs/operators'; // 引入 catchError 操作符
import { error } from 'node:console';

// 20250627 mod by jimmy for API啟動
// 定義 User 介面，保持前後端資料結構一致
interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  
  // 20250624 mod by jimmy for 編輯使用者功能
  // 20250627 mod by jimmy for API啟動
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})

// 20250623 mod by jimmy for 新增使用者功能
export class UsersComponent implements OnInit { // 補充"implements OnInit"，可以避免失去編譯器的提醒，讓ts知道我們要用ngOnInit()
  // 20250623 mod by jimmy for 新增使用者功能
  // users = [
  //     { id: 1, name: '王小明', email: 'xiaoming@example.com' },
  //     { id: 2, name: '陳美麗', email: 'meili@example.com' },
  //     { id: 3, name: '張大衛', email: 'david@example.com' }
  //   ];

  // 20250623 mod by jimmy for 新增使用者功能
  // users: { id: number, name: string, email: string }[] = [];

  // 20250627 mod by jimmy for API啟動
  users: User[] = []; // 使用定義的 User 介面
  searchTerm = ''; //雙向綁定

  constructor(private http: HttpClient) { }

  // 20250624 mod by jimmy for code一致性，補充void
  ngOnInit(): void {
    // 20250627 mod by jimmy for API啟動
    // const stored = localStorage.getItem('users'); // 從localStorage取出東西

    // // 先看localStorage有沒有東西
    // if (stored) {
    //   this.users = JSON.parse(stored); // 有的話 : 把localStorage的users資料轉為js的資料型態
    // } else {
    //   // 如果沒資料的話 : 用土炮的方式初始化預設資料
    //   this.users = [
    //     { id: 1, name: '王小明', email: 'xiaoming@example.com' },
    //     { id: 2, name: '陳美麗', email: 'meili@example.com' },
    //     { id: 3, name: '張大衛', email: 'david@example.com' }
    //   ];
    //   localStorage.setItem('users', JSON.stringify(this.users));
    // }

    this.getUsers();

  }

  // 20250627 mod by jimmy for API啟動
  getUsers(): void {
    const apiUrl = 'https://localhost:7278/api/Users';

    this.http.get<User[]>(apiUrl).pipe(
      catchError(error => {
        console.error('獲取使用者列表失敗:', error);
        // 根據錯誤類型顯示不同的訊息給使用者
        alert('無法載入使用者資料，請檢查後端服務是否運行。');
        return new Observable<User[]>(); // 返回一個空的 Observable
      })
    )
    .subscribe(data => {
      this.users = data;
    });

  }

  deleteUser(id: number) {
    // 20250629 mod by jimmy for API刪除使用者功能
    const apiUrl = `https://localhost:7278/api/Users/${id}`;
    const user = this.users.find(u => u.id === id);

    if (user && confirm(`是否確定刪除 ${user.name} (ID : ${user.id}) ? `)){
      // 20250629 mod by jimmy for API刪除使用者功能
      // this.users = this.users.filter(u => u.id !== id); //透過將users陣列做filter方法，保留id不同的剔除id相同的，實現刪除

      // 20250623 mod by jimmy for 新增使用者功能
      // localStorage.setItem('users', JSON.stringify(this.users)); // 透過filter方法更新後的使用者資料重新存回 localStorage
      // console.log(`${user.name} 已被刪除`);

      // 20250627 mod by jimmy for API啟動
      // 暫時仍然只在前端模擬刪除，待後續實作後端 DELETE API 再修改
      // this.users = this.users.filter(u => u.id !== id);
      // console.log(`${user.name} 已被刪除 (前端模擬)`);
      
      this.http.delete(apiUrl).pipe(
        catchError(error =>{
          console.error('刪除使用者失敗:', error);
          alert('刪除使用者失敗，請檢查網路或後端服務。');
          return throwError(() => new Error('刪除使用者失敗')); // 拋出錯誤，阻止訂閱繼續執行
        })
      ).subscribe(() => { // 後端完成刪除後就來到前端更新使用者列表
        console.log(`使用者 (ID: ${id}) 已成功刪除`);
        // 如果後端刪除成功，才更新前端的使用者列表
        this.users = this.users.filter(u => u.id !== id);
      })
    }
  }

  // 20250624 mod by jimmy for 功能擴充 : 使用者搜尋
  // 20250627 mod by jimmy for API啟動
  // searchTerm = ''; // 新增搜尋字串，雙向綁定
  // 20250629 mod by jimmy for 過濾使用者
  get filteredUsers(): User[] {
    return this.users.filter(user =>
      user.name.includes(this.searchTerm) || user.email.includes(this.searchTerm)
    );
  }
}

