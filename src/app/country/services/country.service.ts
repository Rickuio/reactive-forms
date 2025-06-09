import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({providedIn: 'root'})
export class CountryService {
    
    private baseUrl = "https://restcountries.com/v3.1";
    private http = inject(HttpClient);

    private _regions = [
        'Africa','Americas','Asia','Europe','Oceania'
    ];

    get regions(): string[] {
        return [...this._regions];
    }

    getCountriesByRegion(region: string): Observable<Country[]> {
        if (!region) return of([]);
        // console.log({srvRegion:region});
        const url = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;
        return this.http.get<Country[]>(url);
    }

    getCountryByAlpahCode(alphaCode:string): Observable<Country> {
        const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;
        return this.http.get<Country>(url);
    }

    getCountryNamesByCodeArray(countryCodes: string[]): Observable<Country[]> {
        if (!countryCodes || countryCodes.length === 0) return of([]);
        const countryRequets: Observable<Country>[] = [];
        countryCodes.forEach( code => {
          const request = this.getCountryByAlpahCode(code);
          countryRequets.push(request);
        });
        return combineLatest(countryRequets);
    }

    
}