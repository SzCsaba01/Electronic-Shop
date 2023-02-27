import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ConfirmRegistrationComponent } from './components/confirm-registration/confirm-registration.component';
import { ProductsComponent } from './components/products/products.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from './components/layout/layout.module';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { DeleteButtonCellComponent } from './components/manage-users/delete-button-cell/delete-button-cell.component';
import { AgGridModule } from 'ag-grid-angular';
import { ProductComponent } from './components/products/product/product.component';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { OrderComponent } from './components/order/order.component';
import { AuthenticationInterceptor } from './helpers/auth-interceptor';
import { ErrorInterceptor } from './helpers/error-interceptor';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainPageComponent,
        RegistrationComponent,
        ForgotPasswordComponent,
        ChangePasswordComponent,
        PageNotFoundComponent,
        ConfirmRegistrationComponent,
        ProductsComponent,
        ProfileComponent,
        ManageProductsComponent,
        ManageUsersComponent,
        DeleteButtonCellComponent,
        ProductComponent,
        ProductDetailComponent,
        OrderComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        LayoutModule,
        AgGridModule,
        MatGridListModule,
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthenticationInterceptor,
        multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInterceptor,
        multi: true
      }],
    
})
export class AppModule { }
