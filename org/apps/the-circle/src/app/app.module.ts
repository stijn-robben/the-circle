import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { StreamerComponent } from './streamer-viewer/streamer-component';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    StreamerComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppComponent,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [provideHttpClient()],
  bootstrap: []
})
export class AppModule { }