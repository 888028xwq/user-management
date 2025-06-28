// 20250624 mod by jimmy for 編輯使用者功能
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // 從 URL網址 中抓參數（如 /edit-user/1 中的 1）
import { FormsModule } from '@angular/forms'; // 讓 [(ngModel)] 雙向綁定能使用

// 20250628 mod by jimmy for  API編輯使用者功能
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators'; // 引入 catchError 操作符
import { of, Observable, throwError } from 'rxjs'; // 引入 throwError 函數

// 定義 User 介面，保持前後端資料結構一致
interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-edit-user',
  standalone: true,
  // 20250628 mod by jimmy for  API編輯使用者功能
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.css']
})

export class EditUserComponent implements OnInit {
  // 20250628 mod by jimmy for  API編輯使用者功能
  // id: number = 0; // 讓ActivatedRoute可以取得在URL中的使用者ID
  id: number | null = null; // 用來儲存從路由取得的使用者 ID

  // 雙向綁定
  name = '';
  email = '';

  // 20250628 mod by jimmy for  API編輯使用者功能
  // route : 取得 URL 參數。router : 引導回主頁面
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // 20250628 mod by jimmy for  API編輯使用者功能
    // this.id = Number(this.route.snapshot.paramMap.get('id')); //在app.route.ts設定過的:id，可以取得使用者ID並顯示在URL。用Number()將字串轉換為數字
    // const users = JSON.parse(localStorage.getItem('users') || '[]');
    // const user = users.find((u: any) => u.id === this.id); // 用find()尋找陣列中第一個符合條件的元素。u.id === this.id要檢查選取的ID跟URL的ID是否一致

    // if (user){ // 如果有正確選取到要編輯的使用者
    //   // 根據編輯結果賦值到name跟email
    //   this.name = user.name; 
    //   this.email = user.email;
    // }else{ // 找不到就警告
    //   alert('找不到使用者');
    //   this.router.navigate(['/users']); // 回到主頁面
    // }

    // 從路由參數中獲取使用者 ID
    this.route.paramMap.pipe(
      map(p => Number(p.get('id'))), // id轉數字
      switchMap(id => {
        if (isNaN(id)){
          console.error('無效的使用者 ID');
          this.router.navigate(['/users']); // 導回列表頁
          return of(null); // 返回一個空的 Observable
        }
        this.id = id;
        const apiUrl = `https://localhost:7278/api/Users/${this.id}`;

        // 透過 HTTP GET 請求從後端獲取指定使用者資料
        return this.http.get<User>(apiUrl).pipe(
          catchError(error =>{
            console.error('獲取使用者資料失敗:', error);
            alert('無法載入使用者資料，請檢查後端服務或 ID 是否存在。');
            this.router.navigate(['/users']); // 出錯時導回列表頁
            return throwError(() => new Error('獲取使用者資料失敗'));
          })
        );
      })
    ).subscribe(user => {
      if (user){
        this.name = user.name;
        this.email = user.email;
      }
    })
  }

  // 20250628 mod by jimmy for  API編輯使用者功能
  // 到目前為止，只針對變數做編輯，需要儲存回localStorage
  saveUser(): void{
    // 20250628 mod by jimmy for  API編輯使用者功能
    // const users = JSON.parse(localStorage.getItem('users') || '[]'); // 變數初步編輯完成後，重新從 localStorage 取出舊的所有使用者。
    // const index = users.findIndex((u: any) => u.id === this.id); // 找到要更新的使用者在陣列中的索引位置

    // if (index !== -1) { // 有找到就把剛剛編輯過的新結果賦值回localStorage
    //   users[index].name = this.name;
    //   users[index].email = this.email;
    //   localStorage.setItem('users', JSON.stringify(users)); // 以JSON格式儲存新的使用者資料

    //   alert('使用者更新成功！'); // 通知
    //   this.router.navigate(['/users']); // 成功後返回主頁面
    // }
    if (this.id === null) {
      alert('無法更新使用者：使用者 ID 不存在。');
      return;
    }

    const updatedUser: User = {
      id: this.id, // 務必包含 ID；後端的 PUT API (`PUT /api/Users/{id}`) 需要這個 ID 來識別要更新哪個資源。
      name: this.name,
      email: this.email
    };

    const apiUrl = `https://localhost:7278/api/Users/${this.id}`;

    // 透過 HTTP PUT 請求將更新後的資料發送到後端 API
    this.http.put(apiUrl, updatedUser) // PUT 不返回內容，所以不需要指定<XXX>的泛型型別
      .pipe(
        catchError(error => {
          console.error('更新使用者失敗:', error);
          alert('更新使用者失敗，請檢查網路或後端服務。');
          return throwError(() => new Error('更新使用者失敗'));
        })
      )
      .subscribe(() => {
        console.log(`使用者 : ${this.id} 更新成功`);
        this.router.navigate(['/users']); // 導回使用者清單頁
      });
  }
}
