import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cartDataUpdate = new EventEmitter<product[] | []>();

  constructor(private http: HttpClient) { }
  addProduct(data:product){
    return this.http.post('http://localhost:8080/product',data)
  }
  productList(){
    return this.http.get<product[]>('http://localhost:8080/product')
  }
  deleteProduct(id:number){
    return this.http.delete(`http://localhost:3000/products/${id}`)
  }
  getProduct(id:string){
    console.warn(id);
    
    return this.http.get<product>(`http://localhost:8080/product/${id}`)
  }
  updateProduct(product:product){
    
    return this.http.put<product>(`http://localhost:3000/products/${product.id}`,product)
  }
  popularProduct(){
    return this.http.get<product[]>('http://localhost:3000/products?_limit=4')
  }
  trendyProducts(){
    return this.http.get<product[]>('http://localhost:3000/products?_limit=8')
  }
  searchProducts(query:string){
    return this.http.get<product[]>(`http://localhost:8080/product/search?q=${query}`)
  }
  localAddToCart(data:product){
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if(!localCart){
      
      localStorage.setItem('localCart',JSON.stringify([data]))
      this.cartDataUpdate.emit([data]);
    }
    else{
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart',JSON.stringify(cartData))
      this.cartDataUpdate.emit(cartData);
    }
  }
  removeItemFromCart(productId:number){
    let cartData=localStorage.getItem('localCart');
    if(cartData){
      let items:product[]= JSON.parse(cartData);
      items = items.filter((item:product)=>productId!==item.id);
      localStorage.setItem('localCart',JSON.stringify(items))   
      this.cartDataUpdate.emit(items);   
    }
    
  }
  addToCart(cartData:cart){
    return this.http.post('http://localhost:3000/cart',cartData)  
  }
  removeFromCart(cartId:number){
    return this.http.delete('http://localhost:3000/cart/'+cartId)    
  }
  getCartList(userId: number){
    return this.http.get<product[]>('http://localhost:3000/cart?userId='+userId,
    {observe:'response'}).subscribe((result)=>{
      if(result && result.body)
      this.cartDataUpdate.emit(result.body);
    });      
  }
  currentCart(){
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>('http://localhost:3000/cart?userId='+userData.id);
  }
  orderNow(data:order){
    return this.http.post('http://localhost:3000/orders',data);
  }
  orderList(){
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId='+userData.id);
  }
  deleteCartItems(cartId:number){
    return this.http.delete('http://localhost:3000/cart/'+cartId,{observe:'response'})
    .subscribe((result)=>{
      if(result){
        this.cartDataUpdate.emit([])
      }
    })    
  }
  cancelOrders(orderId:number){
    return this.http.delete('http://localhost:3000/orders/'+orderId)
  }
}