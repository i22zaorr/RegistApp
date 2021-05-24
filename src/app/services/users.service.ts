import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Users {
    id: string;
    name: string;
    surname: string;
    pass: string;
    lastAccess: string;
    status: boolean;
  }
@Injectable({
    providedIn: 'root'
})
  export class UsersService {
    private url = 'YOUR_SERVER_NAME/api/login.php';
    constructor(private http: HttpClient) {}
   
    getAllUser(){
      return this.http.get<[Users]>(this.url);
    }
  
    getUser(id: string, pass: any){
      return this.http.get<[Users]>(this.url + '?id=' + id + '&pass=' + pass);
    }
  
    createUser(user: string){
      return this.http.post(this.url, user);
    }
  
    updateUser(user: string){
      return this.http.post(this.url, user);
    }
  
    removeUser(id: string){
      return this.http.delete(this.url + '?id=' + id);
    }

  }