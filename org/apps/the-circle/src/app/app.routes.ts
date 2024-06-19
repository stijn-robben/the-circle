import { Route } from '@angular/router';
import { StreamerComponent } from './streamer-viewer/streamer-component';
import { StreamListComponent } from './stream-list/stream-list.component';
import { StreamStreamerComponent } from './streamer-streamer/streamer-streamer.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './gurad/auth.gurad';

export const appRoutes: Route[] = [
  { path: '', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: 'streamer',
    component: StreamStreamerComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'viewer', component: StreamerComponent, canActivate: [AuthGuard] },
  {
    path: 'stream-list',
    component: StreamListComponent,
    canActivate: [AuthGuard],
  },{
    path: 'streamer/:username',
    component: StreamStreamerComponent,
    canActivate: [AuthGuard],
  },
];
