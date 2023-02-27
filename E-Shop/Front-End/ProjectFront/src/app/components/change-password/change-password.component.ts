import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { passwordFormat } from 'src/app/formats/Formats';
import { ChangePasswordDto } from 'src/app/models/User/ChangePasswordDto';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends SelfUnsubscriberBase implements OnInit {

  token = this.activatedRoute.snapshot.paramMap.get("token") as string;

  userId!: Guid;

  newPassword: FormControl;
  repeatNewPassword: FormControl;

  changePasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { 
    super();

    this.newPassword = new FormControl ('', [Validators.required, Validators.pattern(passwordFormat)]);
    this.repeatNewPassword = new FormControl ('', [Validators.required, Validators.pattern(passwordFormat)]);

    this.changePasswordForm = this.formBuilder.group({
      'newPassword': this.newPassword,
      'repeatNewPassword': this.repeatNewPassword,     
    })
  }

  ngOnInit(): void {
    this.userService.getUserIdByResetToken(this.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.userId = result;
        console.log(this.userId);
      },
      (error) => {
        this.route.navigate(['page_not_found'])
      })
  }

  changePassword(changePasswordDto: ChangePasswordDto){
    changePasswordDto.id = this.userId;
    this.userService.changePassword(changePasswordDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.route.navigate(['login']);
      })
  }

}
