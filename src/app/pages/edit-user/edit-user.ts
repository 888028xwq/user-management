// 20250624 mod by jimmy for 編輯使用者功能
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // 從 URL網址 中抓參數（如 /edit-user/1 中的 1）
import { FormsModule } from '@angular/forms'; // 讓 [(ngModel)] 雙向綁定能使用

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.css']
})

export class EditUserComponent implements OnInit {
  id: number = 0; // 讓ActivatedRoute可以取得在URL中的使用者ID

  // 雙向綁定
  name = '';
  email = '';

  // route : 取得 URL 參數。router : 引導回主頁面
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')); //在app.route.ts設定過的:id，可以取得使用者ID並顯示在URL。用Number()將字串轉換為數字
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.id === this.id); // 用find()尋找陣列中第一個符合條件的元素。u.id === this.id要檢查選取的ID跟URL的ID是否一致

    if (user){ // 如果有正確選取到要編輯的使用者
      // 根據編輯結果賦值到name跟email
      this.name = user.name; 
      this.email = user.email;
    }else{ // 找不到就警告
      alert('找不到使用者');
      this.router.navigate(['/users']); // 回到主頁面
    }
  }

  // 到目前為止，只針對變數做編輯，需要儲存回localStorage
  saveUser(){
    const users = JSON.parse(localStorage.getItem('users') || '[]'); // 變數初步編輯完成後，重新從 localStorage 取出舊的所有使用者。
    const index = users.findIndex((u: any) => u.id === this.id); // 找到要更新的使用者在陣列中的索引位置

    if (index !== -1) { // 有找到就把剛剛編輯過的新結果賦值回localStorage
      users[index].name = this.name;
      users[index].email = this.email;
      localStorage.setItem('users', JSON.stringify(users)); // 以JSON格式儲存新的使用者資料

      alert('使用者更新成功！'); // 通知
      this.router.navigate(['/users']); // 成功後返回主頁面
    }
  }
}
