import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToasterService } from "angular2-toaster";
import { AuthentificationService } from "../../services/authentification.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-my-login",
  templateUrl: "./my-login.component.html",
  styleUrls: ["./my-login.component.css"],
})
export class MyLoginComponent implements OnInit {
  loginForm: FormGroup;
  refused: Boolean;
  constructor(
    private toasterService: ToasterService,
    private authService: AuthentificationService,
    private router: Router
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
          localStorage.setItem("loginToken", JSON.stringify(res));
        },
        (err) => {
          console.log("error" + err.message);
          this.refused = true;
        },
        () => {
          this.showSuccess();
          this.refused = false;
          this.router.navigate(["/home"]);
        }
      );
    }
  }

  showSuccess() {
    this.toasterService.pop("success", "Success", "Logged in successfully");
  }
}
