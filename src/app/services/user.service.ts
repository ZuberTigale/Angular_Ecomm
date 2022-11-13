import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { login, SignUp } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  invalidUserAuth=new EventEmitter<boolean>(false)

  constructor(private http: HttpClient, private router:Router) { }
  userSignUp(user:SignUp){
    this.http.post('http://localhost:8080/user/Signup',user,{observe:'response'})
    .subscribe((result)=>{
      if(result){
        console.warn(result.body);
        
        // localStorage.setItem('user',JSON.stringify(result.body))
        setTimeout(()=>{

          this.router.navigate(['/user-auth'])
        },500)
      }      
    })
  }
  userAuthReload(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/'])
    }
  }
  userLogin(user:login){
    // this.http.get<SignUp[]>(`http://localhost:3000/users?email=${user.email}&password=${user.password}`,{observe:'response'})
    this.http.post('http://localhost:8080/user/Login',user,{observe:'response'})
    .subscribe((result)=>{
      console.warn(result);
      // if(result && result.body?.length){
        if(result && result.body){
        this.invalidUserAuth.emit(false)
        // localStorage.setItem('user',JSON.stringify(result.body[0]))
        let userDetails = JSON.stringify(result.body)
        userDetails.includes('name')
        localStorage.setItem('user',JSON.stringify(result.body))
        this.router.navigate(['/']);
      }else{
        this.invalidUserAuth.emit(true)
      }
    })
    
  }
}
