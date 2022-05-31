import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxsModule, NgxsModuleOptions } from '@ngxs/store';
import { AppState } from './store/app.state';
import { environment } from '../environments/environment';

const ngxsConfig: NgxsModuleOptions = {
  developmentMode: !environment.production,
  selectorOptions: {
    suppressErrors: false,
  },
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([AppState], ngxsConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
