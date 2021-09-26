import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import jwtDecode from "jwt-decode";
import { environment } from "../../../environments/environment";
import { UserService } from "../../services/user.service";
import { ConfirmationComponent } from "../users-admin/dialogs/confirmation/confirmation.component";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  passwordRegex = "^(?=.*[0-9])(?=.*[a-zA-Z])[^]*([a-zA-Z0-9]+[^]*)$";
  userId: any;
  connectedUser: any;
  baseUrl = environment.baseUrl;
  resetPasswordForm: FormGroup;
  desactivateForm: FormGroup;

  constructor(
    private userservice: UserService,
    private toaster: ToasterService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = jwtDecode<any>(
      JSON.parse(localStorage.getItem("loginToken")).token
    ).userId;
    this.userservice.getUserById(this.userId).subscribe(
      (res) => {
        this.connectedUser = res;
      },
      (err) => {},
      () => {}
    );
    this.resetPasswordForm = new FormGroup(
      {
        oldPassword: new FormControl("", Validators.required),
        newPassword: new FormControl("", [
          Validators.required,
          Validators.pattern(this.passwordRegex),
          Validators.minLength(4),
        ]),
        confirmPassword: new FormControl("", Validators.required),
      },
      { validators: [this.checkPasswords] }
    );
    this.desactivateForm = new FormGroup({
      password: new FormControl("", Validators.required),
    });
  }

  logOut() {
    localStorage.removeItem("loginToken");
    this.toaster.pop("success", "Success", "Logged out successfully");
    this.router.navigate(["/login"]);
  }
  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get("newPassword").value;
    let confirmPass = group.get("confirmPassword").value;
    return pass === confirmPass ? null : { notSame: true };
  };
  resetPassword(form) {
    if (this.checkPasswords(form)) {
      this.toaster.pop(
        "error",
        "Error",
        "New password and confirm password does not match"
      );
    } else if (form.status == "INVALID") {
      this.toaster.pop(
        "error",
        "Error",
        "Please fill the form fields correctly"
      );
    } else {
      this.userservice
        .resetPassword(this.connectedUser._id, form.value)
        .subscribe(
          (res) => {},
          (err) => {
            console.log(err);
            this.toaster.pop("error", "Error", err.error.message);
          },
          () => {
            this.toaster.pop(
              "success",
              "Success",
              "Password reset successfully"
            );
            this.formReset(this.resetPasswordForm);
          }
        );
    }
  }
  formReset(form: FormGroup) {
    form.reset();

    Object.keys(form.controls).forEach((key) => {
      form.get(key).setErrors(null);
    });
  }
  desactivateAccount(form) {
    console.log(form.value);

    if (form.status == "INVALID") {
      this.toaster.pop("error", "Error", "Please enter your password");
    } else {
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        height: "fit-content",
        minWidth: "280px",
        width: "50%",
        data: {
          title: "Desactivate account permenantly",
          userFirstName: "",
          userLastName: "",
          message: "Are you sure you want to desactivate your account? ",
        },
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.userservice
            .desactivateAccount(this.connectedUser._id, form.value)
            .subscribe(
              (res) => {},
              (err) => {
                console.log(err);
                this.toaster.pop("error", "Error", err.error.message);
              },
              () => {
                this.toaster.pop(
                  "success",
                  "Success",
                  "Account desactivated successfully"
                ),
                  localStorage.removeItem("loginToken");
                this.router.navigate(["/login"]);
              }
            );
        }
      });
    }
  }
}

// MyErrorStateMatcher (confirm password)
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
