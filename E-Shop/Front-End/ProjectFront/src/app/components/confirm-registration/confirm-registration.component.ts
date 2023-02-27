import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.scss']
})
export class ConfirmRegistrationComponent extends SelfUnsubscriberBase implements OnInit {

  token = this.activatedRoute.snapshot.paramMap.get("token") as string;

  constructor(
    private route: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
   }

  ngOnInit(): void {
    this.userService.confirmRegistration(this.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.route.navigate(['login']);
      },
      (error) => {
        this.route.navigate(['page_not_found']);
      })
  }

}
