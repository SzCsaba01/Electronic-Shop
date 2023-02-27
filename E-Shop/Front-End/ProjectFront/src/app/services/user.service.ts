import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangePasswordDto } from '../models/User/ChangePasswordDto';
import { EditProfileDetails } from '../models/User/EditProfileDetailsDto';
import { SendForgotPasswordEmailDto } from '../models/User/SendForgotPasswordEmailDto';
import { UserPaginationDto } from '../models/User/UserPaginationDto';
import { UserProfileDetailsDto } from '../models/User/UserProfileDetailsDto';
import { UserRegisterDto } from '../models/User/UserRegisterDto';
import { UserSearchDto } from '../models/User/UserSearchDto';

const options = {
  responseType: 'text' as 'json',
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _url = 'User'

  constructor(private http: HttpClient) { }

  public register(userRegister: UserRegisterDto){
    return this.http.post(`${environment.apiUrl}/${this._url}/Registration`, userRegister);
  }

  public sendForgotPasswordEmail(sendForgotPasswordEmailDto: SendForgotPasswordEmailDto){
    return this.http.post(`${environment.apiUrl}/${this._url}/ForgotPassword`, sendForgotPasswordEmailDto);
  }

  public changePassword(changePasswordDto: ChangePasswordDto){
    return this.http.post(`${environment.apiUrl}/${this._url}/ChangePassword`, changePasswordDto);
  }

  public getUserIdByResetToken(token: string): Observable<Guid>{
    return this.http.get<Guid>(`${environment.apiUrl}/${this._url}/GetUserIdByResetPasswordToken?token=${token}`);
  }

  public confirmRegistration(resetPasswordToken: string): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/${this._url}/ConfirmRegistration?resetPasswordToken=${resetPasswordToken}`, resetPasswordToken);
  }

  public getUserProfilePictureUrl(id: Guid) : Observable<string>{
    return this.http.get<string>(`${environment.apiUrl}/${this._url}/GetProfilePictureUrl?Id=${id}`, options);
  }

  public getUserProfileDetails(id: Guid) : Observable<UserProfileDetailsDto>{
    return this.http.get<UserProfileDetailsDto>(`${environment.apiUrl}/${this._url}/GetProfileDetails?Id=${id}`);
  }

  public changeUserProfilePicture(changeUserProfilePicture: FormData){
    console.log(changeUserProfilePicture);
    return this.http.put(`${environment.apiUrl}/${this._url}/ChangeProfilePicture`, changeUserProfilePicture);
  }

  public editProfileDetails(editProfileDetails: EditProfileDetails){
    return this.http.put(`${environment.apiUrl}/${this._url}/EditProfile`, editProfileDetails);
  }

  public getUsersPaginated(page: number):Observable<UserPaginationDto>{
    return this.http.get<UserPaginationDto>(`${environment.apiUrl}/${this._url}/PaginatedUsers?page=${page}`);
  }
  public getSearchedUsersByUserName(userSearch: UserSearchDto): Observable<UserPaginationDto>{
    return this.http.post<UserPaginationDto>(`${environment.apiUrl}/${this._url}/SearchUsersByUserName`, userSearch);
  }

  public getSearchedUsersByEmail(userSearch: UserSearchDto): Observable<UserPaginationDto>{
    return this.http.post<UserPaginationDto>(`${environment.apiUrl}/${this._url}/SearchUsersByEmail`, userSearch);
  }

  public deleteUser(username: string){
    return this.http.delete(`${environment.apiUrl}/${this._url}/DeleteUser?username=${username}`);
  }
}
