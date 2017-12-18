import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/site/home/home.component';
import { GameScreenComponent } from './components/site/game-screen/game-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameScreenComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
