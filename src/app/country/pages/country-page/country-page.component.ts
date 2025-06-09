import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {

  fb = inject(FormBuilder);
  countryService = inject(CountryService);
  regions = this.countryService.regions;
  countriesByRegion = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  onFormChanged = effect( (cleanUp) => {
    
    const regionSubscription = this.onRegionChanged();
    const countrySubscription = this.onCountryChanged();

    cleanUp(() => {
      console.log('limpiando efecto!');
      regionSubscription.unsubscribe();
      countrySubscription.unsubscribe();
    });
  });

  onRegionChanged() {
    return this.myForm.get('region')!.valueChanges
      .pipe(
        // tap( (region) => console.log({region}))
        tap( () => this.myForm.get('country')!.setValue('')),
        tap( () => this.myForm.get('border')!.setValue('')),
        tap( () => {
          this.borders.set([]);
          this.countriesByRegion.set([]);
        }),
        switchMap( region => this.countryService.getCountriesByRegion(region ?? '') )
      )
      .subscribe( (countries) => {
        this.countriesByRegion.set(countries);
        // this.countryService.getCountriesByRegion(region!).subscribe((dataC) => console.log({countries: dataC}))
      });
  }

  onCountryChanged() {
    return this.myForm.get('country')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('border')!.setValue('')),
      filter( value => value!.length > 0),
      switchMap( (code) => this.countryService.getCountryByAlpahCode(code ?? '') ),
      switchMap( c => this.countryService.getCountryNamesByCodeArray(c.borders))
    )
    .subscribe( (borders) => {
      console.log({borders});
      this.borders.set(borders);
    })

  }

}
