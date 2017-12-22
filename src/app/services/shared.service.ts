import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
@Injectable()

export class SharedService {
  public loggedIn: Subject<boolean> = new Subject<boolean>();
  user: any = '';

  setUser(user: any) {
    this.user = user;
    this.loggedIn.next(true);
  }

  clearUser() {
    this.user = '';
    this.loggedIn.next(false);
  }
}
