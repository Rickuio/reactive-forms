import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(this.formUtils.namePattern)]],
    email: [
      '',
      [Validators.required, Validators.pattern(this.formUtils.emailPattern)],
      [this.formUtils.checkingServer]
    ],
    username: ['',
      [
        Validators.required, Validators.minLength(6), this.formUtils.notStrider,
        Validators.pattern(this.formUtils.notOnlySpacesPattern)
      ]
    ],
    password: ['',[Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required]],
  },{
    validators: [
      this.formUtils.validatePassword('password', 'password2')
    ]
  });

  onSubmit():void {
    this.myForm.markAllAsTouched();
    //console.log(this.myForm.value);
  }
  

}
