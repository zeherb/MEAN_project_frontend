import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ToasterService } from "angular2-toaster";
import { AuthentificationService } from "../../services/authentification.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "register.component.html",
  styleUrls: ["register.component.css"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  invalidStatus = false;
  dateRegex = "^[0-3]?[0-9]/[0-3]?[0-9]/(?:[0-9]{2})?[0-9]{2}$";
  passwordRegex = "^(?=.*[0-9])(?=.*[a-zA-Z])[^]*([a-zA-Z0-9]+[^]*)$";

  public dateMask = [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
  constructor(
    private toasterService: ToasterService,
    private authService: AuthentificationService
  ) {}
  ngOnInit(): void {
    this.registerForm = new FormGroup(
      {
        firstName: new FormControl("", [
          Validators.pattern(
            "^[a-zA-Z êëéàÿôöûüçâäîïÂÄÊËÎÏÔÖÛÜ]*[a-zA-Z]+[a-zA-Z]*$"
          ),
          Validators.required,
        ]),
        lastName: new FormControl("", [
          Validators.pattern(
            "^[a-zA-Z êëéàÿôöûüçâäîïÂÄÊËÎÏÔÖÛÜ]*[a-zA-Z]+[a-zA-Z]*$"
          ),
          Validators.required,
        ]),
        email: new FormControl("", [Validators.email, Validators.required]),
        password: new FormControl("", [
          Validators.required,
          Validators.pattern(this.passwordRegex),
          Validators.minLength(4),
        ]),
        repeatPassword: new FormControl("", Validators.required),
        birthDate: new FormControl("", [
          Validators.required,
          Validators.pattern(this.dateRegex),
        ]),
        phone: new FormControl("", [
          Validators.pattern("^[0-9 ()+-]+$"),
          Validators.required,
        ]),
        address: new FormControl("", Validators.required),
        avatar: new FormControl("", Validators.required),
        fakeAvatar: new FormControl(""),
        ROInput: new FormControl(""),
      },
      { validators: [this.checkPasswords] }
    );

    const originFormControlNameNgOnChanges =
      FormControlName.prototype.ngOnChanges;
    FormControlName.prototype.ngOnChanges = function () {
      const result = originFormControlNameNgOnChanges.apply(this, arguments);
      this.control.nativeElement = this.valueAccessor._elementRef.nativeElement;
      return result;
    };
  }
  fileSelected(fi, roi, event) {
    if (fi.value !== null && fi.value !== "" && fi.value !== undefined) {
      roi.value = fi.files[0].name;
      const file = (event.target as HTMLInputElement).files[0];
      this.registerForm.patchValue({
        fakeAvatar: file,
      });
      this.registerForm.get("avatar").updateValueAndValidity();
    } else {
      roi.value = "";
    }
  }
  register(form) {
    if (form.status == "INVALID" || this.checkFile(this.registerForm)) {
      this.invalidStatus = true;
      this.showError("Please fill the form correctly");
    } else {
      let formData = new FormData();
      formData.append("firstName", form.controls.firstName.value.trim());
      formData.append("lastName", form.controls.lastName.value.trim());
      formData.append("email", form.controls.email.value.trim());
      formData.append("password", form.controls.password.value);
      formData.append("birthDate", form.controls.birthDate.value);
      formData.append("phone", form.controls.phone.value);
      formData.append("address", form.controls.address.value.trim());
      formData.append("avatar", form.get("fakeAvatar").value);

      this.authService.register(formData).subscribe(
        (res) => {
          console.log(res.message);
        },
        (err) => {
          if (err.error.includes("<!DOCTYPE html>")) {
            const html = err.error.split("Error: ").pop().split("<br>").shift();
            if (html == "This user exists!!") {
              this.showError(html);
            } else if (html == "Wrong file type!!") {
              this.showError(html);
            }
          }
        },
        () => {
          this.showSuccess();
          this.registerForm.reset();
          this.invalidStatus = false;
        }
      );
    }
  }
  showSuccess() {
    this.toasterService.pop("success", "Success", "Registred successfully");
  }
  showError(err) {
    this.toasterService.pop("error", "Warning", err);
  }
  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get("password").value;
    let confirmPass = group.get("repeatPassword").value;
    return pass === confirmPass ? null : { notSame: true };
  };
  checkFile: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    {
      const fileType = group.get("avatar").value.split(".").pop();
      const allowedFiles = ["png", "jpg", "jpeg"];
      return allowedFiles.includes(fileType) ? null : { notSame: true };
    }
  };
}
export class MyErrorStateMatcher implements MyErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(
      control?.parent?.invalid && control?.parent?.dirty
    );

    return invalidCtrl || invalidParent;
  }
}
