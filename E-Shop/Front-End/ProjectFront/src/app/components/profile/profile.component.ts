import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { GetOrderedProductsDto } from 'src/app/models/Product/GetOrderedProductsDto';
import { ChangeProfilePictureDto } from 'src/app/models/User/ChangeProfilePictureDto';
import { CountryStateCity } from 'src/app/models/User/CountryStateCity';
import { EditProfileDetails } from 'src/app/models/User/EditProfileDetailsDto';
import { UserProfileDetailsDto } from 'src/app/models/User/UserProfileDetailsDto';
import { CountryStateCityService } from 'src/app/services/country-state-city.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends SelfUnsubscriberBase implements OnInit {

  private userId = this.activeRoute.snapshot.paramMap.get("userId") as unknown as Guid;

  userProfileDetailsDto?: UserProfileDetailsDto;

  editUserForm!: FormGroup;

  changeProfilePicture: ChangeProfilePictureDto;

  username: FormControl;
  email: FormControl;
  firstName: FormControl;
  lastName: FormControl;
  address: FormControl;
  city: FormControl;
  country: FormControl;
  state: FormControl;
  phoneNumber: FormControl;

  getOrderedProductsDto : GetOrderedProductsDto[] = [];

  countryStateCity: CountryStateCity;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    private route: Router,
    private countryStateCityService: CountryStateCityService,
    private productService: ProductService,
  ){
    super();

    this.countryStateCity = new CountryStateCity();
    this.countryStateCity.Country = this.countryStateCityService.getCountries();

    this.firstName = new FormControl('', Validators.required);
    this.lastName = new FormControl('', Validators.required);
    this.address = new FormControl('', Validators.required);
    this.phoneNumber = new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);
    this.username = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.country = new FormControl(null, [Validators.required]);
    this.state = new FormControl({ value: null, disabled: true }, [ Validators.required,]);
    this.city = new FormControl({ value: null, disabled: true }, [Validators.required,]);

    this.editUserForm = this.formBuilder.group ({
      'firstName': this.firstName,
      'lastName': this.lastName,
      'address': this.address,
      'phoneNumber': this.phoneNumber,
      'username': this.username,
      'email': this.email,
      'country' : this.country,
      'city' : this.city,
      'state' : this.state,
    });

    this.changeProfilePicture = new ChangeProfilePictureDto();
    this.changeProfilePicture.profilePicture = new FormData();
    this.changeProfilePicture.userId = this.userId;
  }
  
  ngOnInit(): void {
    this.userService.getUserProfileDetails(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) =>{
        this.userProfileDetailsDto = result;
       this.initializeForm();
      })

      this.productService.getOrderedProducts(this.userId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result) => {
          this.getOrderedProductsDto = result
        })

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

  initializeForm(){
    this.username.setValue(this.userProfileDetailsDto?.username);
    this.email.setValue(this.userProfileDetailsDto?.email);
    this.firstName.setValue(this.userProfileDetailsDto?.firstName);
    this.lastName.setValue(this.userProfileDetailsDto?.lastName);
    this.address.setValue(this.userProfileDetailsDto?.address);
    this.phoneNumber.setValue(this.userProfileDetailsDto?.phoneNumber);
    this.country.setValue(this.userProfileDetailsDto?.country);
    this.state.setValue(this.userProfileDetailsDto?.state);
    this.city.setValue(this.userProfileDetailsDto?.city);

    this.editUserForm.patchValue({
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'address': this.address.value,
      'phoneNumber': this.phoneNumber?.value,
      'username': this.username.value,
      'email': this.email.value,
      'country' : this.country.value,
      'state' : this.state.value,
      'city' : this.city.value,
    })
  }

  onViewProductDetails(id: Guid){
    this.route.navigate(['/product-detail',id]);
  }

  onChangeProfilePicture(files : any){
    if(files.length !== 0){
      const reader = new FileReader();
      var fileToUpload = <File>files[0];

      reader.readAsDataURL(fileToUpload);
      this.changeProfilePicture.profilePicture!.append('file', fileToUpload, fileToUpload.name);
      this.changeProfilePicture.profilePicture!.append('userId', this.changeProfilePicture.userId as unknown as string);
  
      reader.onload = () => {
        this.changeProfilePicture.path = reader.result as string;
        this.userProfileDetailsDto!.profilePicture = this.changeProfilePicture.path;
      }
    }
  }

  onSaveProfilePicture(){
    if(!this.changeProfilePicture.path){
      return;
    }
    this.userService.changeUserProfilePicture(this.changeProfilePicture.profilePicture!)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe();
  }

  onUpdateProfile(editProfileDetails: EditProfileDetails){
    editProfileDetails.userId = this.userId;
    this.userService.editProfileDetails(editProfileDetails)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

}
