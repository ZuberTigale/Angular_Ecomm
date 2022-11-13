import { Component, OnInit } from '@angular/core';
import { cart, login, product, SignUp } from '../data-type'
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {
  showLogin:boolean=true;
  authError:string="";

  constructor(private user:UserService, private product:ProductService) { }

  ngOnInit(): void {
    this.user.userAuthReload();
  }
  signUp(data:SignUp){
    this.user.userSignUp(data);
  }
  login(data:login){
    this.user.userLogin(data);
    this.user.invalidUserAuth.subscribe((result)=>{
      console.warn("apple  ",result);
        if(result){
          this.authError="Please enter valid user"
        }else{
          this.localCartToRemoteCart();
        }
      
        })
  }
  openLogin(){
    this.showLogin=true
  }
  openSignup(){
    this.showLogin=false
  }
  localCartToRemoteCart(){
    let data = localStorage.getItem('localCart');
    setTimeout(()=>{
      console.warn('waiting');
      
    
    let user = localStorage.getItem('user');
    console.warn(user);    
    console.warn(data);
    
    let userId = user && JSON.parse(user).id;
    console.warn(userId);
    
    if(data){
      let cartDataList:product[]= JSON.parse(data);

      cartDataList.forEach((product:product, index)=>{
        let cartData :cart= {
          ...product,
          productId: product.id,
          userId,
        };

        delete cartData.id;
        setTimeout(()=>{

          this.product.addToCart(cartData).subscribe((result)=>{
            if(result){
              console.warn("Item stored to DB");              
            }
          })
          if(cartDataList.length===index+1){
            localStorage.removeItem('localCart')
          }
        }, 500);
      })
    }
    setTimeout(()=>{
      this.product.getCartList(userId);
    }, 200)
  },50)
  }
}
