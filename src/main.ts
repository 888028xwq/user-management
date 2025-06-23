import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app.module';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
//20250623 mod by jimmy for 刪除動作失效
import 'zone.js'; //問題來自zone.js缺失

bootstrapApplication(App, {
  providers: [provideRouter(appRoutes)]
}).then(() => {
  console.log('Application started successfully');
}).catch(err => console.error(err));