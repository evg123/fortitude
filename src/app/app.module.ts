import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HomeComponent} from './components/site/home/home.component';
import {GameScreenComponent} from './components/site/game-screen/game-screen.component';
import {NotFoundComponent} from './components/site/not-found/not-found.component';
import {Routing} from './app.routing';
import {SharedService} from './services/shared.service';
import {UserService} from './services/user.service.client';
import {GameService} from './services/game.service.client';
import {InputService} from './services/input.service.client';
import {HttpModule} from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameScreenComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    Routing,
    HttpModule
  ],
  providers: [SharedService, UserService, GameService, InputService],
  bootstrap: [AppComponent]
})
export class AppModule { }
