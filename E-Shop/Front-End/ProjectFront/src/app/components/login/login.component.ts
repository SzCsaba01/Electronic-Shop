import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { AuthenticationRequestDto } from 'src/app/models/Authentication/AuthenticationRequestDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends SelfUnsubscriberBase implements OnInit {

  loginForm: FormGroup; 

  userCredentials: FormControl;
  password: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: Router,
  ) { 
    super();
    this.userCredentials = new FormControl('');
    this.password = new FormControl('');

    this.loginForm = this.formBuilder.group({
      'userCredentials': this.userCredentials,
      'password': this.password
    })
  }

  ngOnInit(): void {
  }

  onLogin(authentication: AuthenticationRequestDto){
    if(!authentication.userCredentials || !authentication.password){
      return;
    }

    this.authenticationService.login(authentication)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.route.navigate(['home']);  
    });
  }

}
