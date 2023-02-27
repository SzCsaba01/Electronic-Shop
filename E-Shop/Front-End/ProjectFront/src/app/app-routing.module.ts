import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ConfirmRegistrationComponent } from './components/confirm-registration/confirm-registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { OrderComponent } from './components/order/order.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductsComponent } from './components/products/products.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthGuard } from './helpers/auth-guard';

const routes: Routes = [
  {
    path:'login', 
    component: LoginComponent
  },
  {
    path:'',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path:'home',
    component: MainPageComponent
  },
  {
    path:'profile/:userId',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path:'registration',
    component: RegistrationComponent,
  },
  {
    path: 'change-password/:token',
    component: ChangePasswordComponent,
  },
  {
    path: 'confirm-registration/:token',
    component: ConfirmRegistrationComponent,
  },
  {
    path: 'manageProducts',
    component: ManageProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manageUsers',
    component: ManageUsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product/:productType',
    component: ProductsComponent,
  },
  {
    path: 'product-detail/:productId',
    component: ProductDetailComponent,
  },
  {
    path: 'order/:userId',
    component: OrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'page-not-found',
    component: PageNotFoundComponent,
  },
  {
    path:'**',
    redirectTo:'/page-not-found',
    pathMatch:'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
