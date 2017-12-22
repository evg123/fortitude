import {Injectable} from '@angular/core';
import {Http, RequestOptions, Response, URLSearchParams} from '@angular/http';
import 'rxjs/Rx';
import {environment} from '../../environments/environment';
import {SharedService} from './shared.service';

@Injectable()
export class UserService {

  constructor(private _http: Http,
              private sharedService: SharedService) { }

  baseUrl = environment.serverBaseUrl;
  options = new RequestOptions();

  api = {
    'createUser' : this.createUser,
    'findUserById' : this.findUserById,
    'findUserByUsername' : this.findUserByUsername,
    'findUserByCredentials' : this.findUserByCredentials,
    'searchUsers' : this.searchUsers,
    'updateUser' : this.updateUser,
    'deleteUser' : this.deleteUser,
    'login' : this.login,
    'logout' : this.logout,
    'register' : this.register,
  };

  checkLogin() {
    this.options.withCredentials = true;
    return this._http.post(this.baseUrl + '/api/loggedIn', '', this.options)
      .map(
        (res: Response) => {
          const user = res.json();
          if (user !== 0) {
            this.sharedService.setUser(user);
          }
          return true;
        }
      );
  }

  login(username: string, password: string) {
    this.options.withCredentials = true;

    const body = {
      username : username,
      password : password
    };

    return this._http.post(this.baseUrl + '/api/login', body, this.options)
      .map(
        (res: Response) => {
          const user = res.json();
          this.sharedService.setUser(user);
          return user;
        }
      );
  }

  logout() {
    this.options.withCredentials = true;

    return this._http.post(this.baseUrl + '/api/logout', '', this.options)
      .map(
        (res: Response) => {
          this.sharedService.clearUser();
          return res;
        }
      );
  }

  register(username: String, password: String) {
    this.options.withCredentials = true;

    const userCred = {
      username : username,
      password : password
    };

    return this._http.post(this.baseUrl + '/api/register', userCred, this.options)
      .map(
        (res: Response) => {
          const user = res.json();
          this.sharedService.setUser(user);
          return user;
        }
      );
  }

  createUser(user: any) {
    return this._http.post(this.baseUrl + '/api/user', user)
      .map(
        (res: Response) => {
          return res.json();
        }
      );
  }

  findUserByUsername(username: string) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('username', username);

    const requestOpts: RequestOptions = new RequestOptions ({
      search: params
    });

    return this._http.get(this.baseUrl + '/api/user', requestOpts)
      .map(
        (res: Response) => {
          return res.json();
        }
      );
  }

  searchUsers(userQuery: string) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('query', userQuery);

    const requestOpts: RequestOptions = new RequestOptions ({
      search: params
    });

    return this._http.get(this.baseUrl + '/api/user/search', requestOpts)
      .map(
        (res: Response) => {
          return res.json();
        }
      );
  }

  getAllUsers() {
    return this._http.get(this.baseUrl + '/api/user/search')
      .map(
        (res: Response) => {
          return res.json();
        }
      );
  }

  findUserByCredentials(username: string, password: string) {
    const params: URLSearchParams = new URLSearchParams();
    params.set('username', username);
    params.set('password', password);

    const requestOpts: RequestOptions = new RequestOptions();
    requestOpts.params = params;

    return this._http.get(this.baseUrl + '/api/user/', requestOpts)
      .map(
        (res: Response) => {
          return res.json();
        }
      );
  }

  findUserById(userId: number) {
    return this._http.get(this.baseUrl + '/api/user/' + userId)
      .map(
        (res: Response) => {
          return res.json();
        }
      );
  }

  updateUser(userId: number , user: any) {
    return this._http.put(this.baseUrl + '/api/user/' + userId, user)
      .map(
        (res: Response) => {
          return res.json();
        }
      );
  }

  deleteUser(userId: number) {
    return this._http.delete(this.baseUrl + '/api/user/' + userId)
      .map(
        (res: Response) => {
          return res.json();
        }
      );
  }
}
