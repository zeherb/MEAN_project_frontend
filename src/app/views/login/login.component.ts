import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToasterService } from "angular2-toaster";
import { from } from "rxjs";
import { AuthentificationService } from "../../services/authentification.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "login.component.html",
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  refused: Boolean;
  constructor(
    private toasterService: ToasterService,
    private authService: AuthentificationService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required),
    });
  }
  login(form) {
    if ((form.status = "VALID")) {
      const body = {
        email: form.controls.email.value.trim(),
        password: form.controls.password.value,
      };
      this.authService.login(body).subscribe(
        (res) => {
          console.log("result" + res.token);
          localStorage.setItem("loginToken", res.token);
        },
        (err) => {
          console.log("error" + err.message);
          this.refused = true;
        },
        () => {
          this.showSuccess();
          this.refused = false;
        }
      );
    }
  }

  showSuccess() {
    this.toasterService.pop("success", "Success", "Logged in successfully");
  }
}
