import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { passwordFormat } from 'src/app/formats/Formats';
import { CountryStateCity } from 'src/app/models/User/CountryStateCity';
import { UserRegisterDto } from 'src/app/models/User/UserRegisterDto';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent extends SelfUnsubscriberBase implements OnInit {

  firstName: FormControl;
  lastName: FormControl;
  country: FormControl;
  state: FormControl;
  city: FormControl;
  address: FormControl;
  phoneNumber: FormControl;
  username: FormControl;
  email: FormControl;
  password: FormControl;
  repeatPassword: FormControl;
  countryStateCity: CountryStateCity;


  registrationForm: FormGroup;

  constructor(    
    private formBuilder: FormBuilder,
    private route: Router,
    private userService: UserService,
    private countryStateCityService: CountryStateCityService) { 
    super();

    this.countryStateCity = new CountryStateCity();
    this.countryStateCity.Country = this.countryStateCityService.getCountries();

    this.firstName = new FormControl('', Validators.required);
    this.lastName = new FormControl('', Validators.required);
    this.address = new FormControl('', Validators.required);
    this.phoneNumber = new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
    this.username = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(passwordFormat)]);
    this.repeatPassword = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(passwordFormat)]);
    this.country = new FormControl(null, [Validators.required]);
    this.state = new FormControl({ value: null, disabled: true }, [ Validators.required,]);
    this.city = new FormControl({ value: null, disabled: true }, [Validators.required,]);
    
    this.registrationForm = this.formBuilder.group ({
      'firstName': this.firstName,
      'lastName': this.lastName,
      'address': this.address,
      'phoneNumber': this.phoneNumber,
      'username': this.username,
      'email': this.email,
      'password': this.password,
      'repeatPassword': this.repeatPassword,
      'country' : this.country,
      'city' : this.city,
      'state' : this.state,
    });
  }

  ngOnInit(): void {

    this.country.valueChanges.subscribe((country) => {
      this.state.reset();
      this.state.disable();
      if (country) {
        this.countryStateCity.State = this.countryStateCityService.getStatesByCountry(country);
        this.countryStateCity.CountryCode = country;
        this.state.enable();
      }
    });

    this.state.valueChanges.subscribe((state) => {
      this.city.reset();
      this.city.disable();
      if (state) {
        this.countryStateCity.City = this.countryStateCityService.getCitiesByState(this.country.value, state);
        this.city.enable();
      }
    });
  }

  register(registrationDto: UserRegisterDto){
    this.userService.register(registrationDto).
      pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.route.navigate(['login']);
      });
  }

}
