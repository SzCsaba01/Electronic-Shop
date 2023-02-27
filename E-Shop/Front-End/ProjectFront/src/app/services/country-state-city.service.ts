import { Injectable } from '@angular/core';
import {Country, State, City} from 'country-state-city';

@Injectable({
  providedIn: 'root'
})
export class CountryStateCityService {

  getCountries() {
    return Country.getAllCountries();
  }

  getCountryByIsoCode(isoCode: string){
    return Country.getCountryByCode(isoCode)
  }

  getStatesByCountry(country: string) {
    return State.getStatesOfCountry(country);
  }

  getCitiesByState(countryCode: string, stateCode: string) {
    return City.getCitiesOfState(countryCode, stateCode);
  }
}
