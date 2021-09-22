import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import { RestePasswordService } from "../../services/reset-password.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  constructor(
    private router: Router,
    private toaster: ToasterService,
    private resetService: RestePasswordService
  ) {}

  ngOnInit(): void {
    this.forgotForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
    });
  }
  submitForm(form) {
    if (form.status == "VALID") {
      this.resetService.forgotPasswordRequest(form.value).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
          this.toaster.pop("error", "Error", err.error.message);
        },
        () => {
          this.toaster.pop(
            "success",
            "Email sent successfully",
            "Please check your email"
          );
        }
      );
    } else {
      this.toaster.pop("error", "Error", "Invalid field");
    }
  }
}
