import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService{
  public errorMessage: string = ''
  public detail: string = ''

  constructor() { }

  public setErrorAlert(error: string){
    Swal.fire({
      icon: 'error',
      title: 'Trouble',
      text: error
    });
  }

  public setSuccesAlert(succes: string){
    Swal.fire({
      icon: 'success',
      title: 'Succes',
      text: succes
    })
  }

  public handleError<T>(_ = 'operation', result?: T){
    return (error: any): Observable<T> => {
      this.detail = error.error.Detail
      this.setErrorAlert(this.errorMessage)
      return of(result as T)
    }
  }


  public displayInvalidParameter(message: string){
    this.setErrorAlert(message)
  }

  public displaySuccesAlert(message: string){
    this.setSuccesAlert(message)
  }

}
