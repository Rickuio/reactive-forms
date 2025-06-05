import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";

export class FormUtils {

  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static getTextError(errors: ValidationErrors): string | null {
    console.log({validate: errors})
    for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Minimo de ${ errors['minlength'].requiredLength} caracteres`
        case 'min':
          return `Valor minimo de ${ errors['min'].min}`
        case 'email':
          return `El valor ingresado no es un correo valido.`
        case 'pattern':
          let patternText = '';
          if (errors['pattern'].requiredPattern == FormUtils.emailPattern) {
            patternText = 'El valor ingresado no tiene un formato de correo electronico';
          }
          return patternText;
        default:
          return `Error de valición no controlado "${key}"`
      }
    }
    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
      return (!!form.controls[fieldName].errors && form.controls[fieldName].touched);
  } 

  static getFieldError(form:FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;
    const errors = form.controls[fieldName].errors ?? {};
    return FormUtils.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return(
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    if (formArray.controls.length === 0) return null;
    const errors = formArray.controls[index].errors ?? {};
    return this.getTextError(errors);
  }

  static validatePassword(field1: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const val1 = formGroup.get(field1)?.value;
      const val2 = formGroup.get(field2)?.value;
      return val1 === val2 ? null : { passwordsNotEqual: true};
    }
  }

}