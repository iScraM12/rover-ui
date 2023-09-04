import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SERVICES } from './service/SERVICES';
import { COMPONENTS } from './component/COMPONENTS';

@NgModule({
  declarations: [AppComponent, ...COMPONENTS],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [...SERVICES],
  bootstrap: [AppComponent],
})
export class AppModule {}
