import { Route } from '@angular/router';
import { StreamerComponent } from './streamer-viewer/streamer-component';
import { StreamListComponent } from './stream-list/stream-list.component';
import { StreamStreamerComponent } from './streamer-streamer/streamer-streamer.component';
export const appRoutes: Route[] = [
    { path: '', component: StreamListComponent },
    { path: 'streamer', component: StreamStreamerComponent },

  { path: 'viewer', component: StreamerComponent },
  { path: 'stream-list', component: StreamListComponent }
];