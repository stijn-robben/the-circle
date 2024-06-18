import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { StreamerComponent } from './streamer-viewer/streamer-component';
import { provideHttpClient } from '@angular/common/http';
import { StreamListComponent } from './stream-list/stream-list.component';
import { StreamStreamerComponent } from './streamer-streamer/streamer-streamer.component';
import { LoginComponent } from './login/login.component';
@NgModule({
  declarations: [
    StreamerComponent,
    StreamListComponent,
    StreamStreamerComponent,
    LoginComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppComponent,
    RouterModule.forRoot(appRoutes),
    LoginComponent,
  ],
  providers: [provideHttpClient()],
  bootstrap: [],
})
export class AppModule {}
