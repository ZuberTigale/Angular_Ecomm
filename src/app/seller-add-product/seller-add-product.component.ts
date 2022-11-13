import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent implements OnInit {
  addProductMessage:string | undefined;
  res:any;

  constructor(private product: ProductService) { }

  ngOnInit(): void {
  }
  submit(data:product){
    this.product.addProduct(data).subscribe((result)=>{
      console.warn(result)
      if(result){
        this.res=result;

        console.warn(this.res.status);
        
        this.addProductMessage=this.res.errorMsg;
      }
      setTimeout(()=>{
        this.addProductMessage = undefined;
        // this.route.navigate(['seller-home']);
      }, 3000)
    });
  }

}
