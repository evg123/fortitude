
import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {GameScreenComponent} from './components/site/game-screen/game-screen.component';
import {NotFoundComponent} from './components/site/not-found/not-found.component';
import {HomeComponent} from './components/site/home/home.component';


const APP_ROUTES: Routes = [
  {path: '', component : HomeComponent},
  {path: 'play', component : GameScreenComponent},
  {path: '**', component : NotFoundComponent},
];

// Export the routes as module providers
export const Routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
