import { ICity, ICountry, IState } from "country-state-city";

export class CountryStateCity{
    Country!: ICountry[];
    CountryCode?: string;
    State!: IState[];
    StateCode?: string
    City!: ICity[];
}