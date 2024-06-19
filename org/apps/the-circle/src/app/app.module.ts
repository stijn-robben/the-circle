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
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { SignalrService } from './services/signalr.service';
@NgModule({
  declarations: [
    // StreamerComponent,
    AppComponent,
    // StreamListComponent,
    StreamStreamerComponent 
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
    AppComponent,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [provideHttpClient(), ApiService, SignalrService],
  bootstrap: [AppComponent],
})
export class AppModule {}
