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
import { navItems } from "../../nav";
import { navAdminItems } from "../../nav-admin";
import { NotificationsService } from "../../services/notifications.service";
import { UserService } from "../../services/user.service";
import { ConfirmationComponent } from "../users-admin/dialogs/confirmation/confirmation.component";
import { io } from "socket.io-client";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  newNotification: number;
  passwordRegex = "^(?=.*[0-9])(?=.*[a-zA-Z])[^]*([a-zA-Z0-9]+[^]*)$";
  userId: any;
  connectedUser: any;
  baseUrl = environment.baseUrl;
  resetPasswordForm: FormGroup;
  desactivateForm: FormGroup;
  navItems: any;
  notifications: any[];
  socket: any;

  constructor(
    private userservice: UserService,
    private toaster: ToasterService,
    private router: Router,
    private dialog: MatDialog,
    private notifService: NotificationsService
  ) {
    this.socket = io(environment.baseUrl, { transports: ["websocket"] });
  }

  ngOnInit(): void {
    this.userId = jwtDecode<any>(
      JSON.parse(localStorage.getItem("loginToken")).token
    ).userId;
    this.userservice.getUserById(this.userId).subscribe(
      (res) => {
        this.connectedUser = res;
      },
      (err) => {},
      () => {
        if (this.connectedUser.role === "admin") {
          this.navItems = navAdminItems;
        } else {
          this.navItems = navItems;
        }
      }
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
    this.notifService.getNotifications(this.userId).subscribe(
      (res) => {
        this.notifications = res.reverse();
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.notifications.forEach((element) => {
          if (element.seen == false) {
            this.newNotification++;
          }
          let diffrence = this.transformCreationDate(element);
          if (diffrence[0] > 1) {
            element.time = diffrence[0] + " years ago";
          } else if (diffrence[0] == 1) {
            element.time = diffrence[0] + " year ago";
          } else if (diffrence[1] > 1) {
            element.time = diffrence[1] + " months ago";
          } else if (diffrence[1] == 1) {
            element.time = diffrence[1] + " month ago";
          } else if (diffrence[2] > 1) {
            element.time = diffrence[2] + " days ago";
          } else if (diffrence[2] == 1) {
            element.createdAt = diffrence[2] + " day ago";
          } else if (diffrence[3] > 1) {
            element.time = diffrence[3] + " hours ago";
          } else if (diffrence[3] == 1) {
            element.time = diffrence[3] + " hour ago";
          } else if (diffrence[4] > 1) {
            element.time = diffrence[4] + " minutes ago";
          } else if (diffrence[4] == 1) {
            element.time = diffrence[4] + " minute ago";
          } else {
            element.time = "Just now";
          }
        });
      }
    );
    this.newNotification = 0;
    this.socket.on("notification", (data) => {
      this.toaster.pop("info", "New notificaiotn", data.text);

      this.notifService.getNotifications(this.userId).subscribe(
        (res) => {
          this.notifications = res.reverse();
        },
        (err) => {
          console.log(err);
        },
        () => {
          this.newNotification = 0;
          this.notifications.forEach((element) => {
            if (element.seen == false) {
              this.newNotification++;
            }
            let diffrence = this.transformCreationDate(element);
            if (diffrence[0] > 1) {
              element.time = diffrence[0] + " years ago";
            } else if (diffrence[0] == 1) {
              element.time = diffrence[0] + " year ago";
            } else if (diffrence[1] > 1) {
              element.time = diffrence[1] + " months ago";
            } else if (diffrence[1] == 1) {
              element.time = diffrence[1] + " month ago";
            } else if (diffrence[2] > 1) {
              element.time = diffrence[2] + " days ago";
            } else if (diffrence[2] == 1) {
              element.createdAt = diffrence[2] + " day ago";
            } else if (diffrence[3] > 1) {
              element.time = diffrence[3] + " hours ago";
            } else if (diffrence[3] == 1) {
              element.time = diffrence[3] + " hour ago";
            } else if (diffrence[4] > 1) {
              element.time = diffrence[4] + " minutes ago";
            } else if (diffrence[4] == 1) {
              element.time = diffrence[4] + " minute ago";
            } else {
              element.time = "Just now";
            }
          });
        }
      );
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
  transformCreationDate(element) {
    let diff = new Date().getTime() - new Date(element.createdAt).getTime();
    let daysDifference = Math.floor(diff / 1000 / 60 / 60 / 24);
    diff -= daysDifference * 1000 * 60 * 60 * 24;

    let hoursDifference = Math.floor(diff / 1000 / 60 / 60);
    diff -= hoursDifference * 1000 * 60 * 60;

    let minutesDifference = Math.floor(diff / 1000 / 60);
    diff -= minutesDifference * 1000 * 60;
    let monthsDiff = Math.floor(daysDifference / 30);
    let yearsDiff = Math.floor(monthsDiff / 12);
    return [
      yearsDiff,
      monthsDiff,
      daysDifference,
      hoursDifference,
      minutesDifference,
    ];
  }
  resetNotifications() {
    this.newNotification = 0;
    this.notifService.seeNotifications(this.connectedUser._id).subscribe(
      (res) => {},
      (err) => {},
      () => {}
    );
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
