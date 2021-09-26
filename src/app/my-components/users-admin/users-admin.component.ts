import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import jwtDecode from "jwt-decode";
import { environment } from "../../../environments/environment";
import { UserService } from "../../services/user.service";
import { ConfirmationComponent } from "./dialogs/confirmation/confirmation.component";

@Component({
  selector: "app-users-admin",
  templateUrl: "./users-admin.component.html",
  styleUrls: ["./users-admin.component.css"],
})
export class UsersAdminComponent implements OnInit {
  userId: any;
  connectedUser: any;
  allUsersList: any;
  adminList: any;
  usersList: any;
  baseUrl = environment.baseUrl;
  constructor(
    private userservice: UserService,
    private toaster: ToasterService,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.adminList = [];
    this.usersList = [];
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
    this.userservice.getUsers().subscribe(
      (res) => {
        this.allUsersList = res;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.message);
      },
      () => {
        this.allUsersList.forEach((element) => {
          element.birthDate = this.datePipe.transform(
            element.birthDate,
            "dd MMMM yyyy"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd MMMM yyyy, à HH:mm"
          );
          if (element.role == "admin") {
            this.adminList.push(element);
          } else {
            this.usersList.push(element);
          }
        });
      }
    );
  }
  logOut() {
    localStorage.removeItem("loginToken");
    this.toaster.pop("success", "Success", "Logged out successfully");
    this.router.navigate(["/login"]);
  }
  affectAdmin(user) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      height: "fit-content",
      minWidth: "280px",
      width: "50%",
      data: {
        title: "Affect admin confirmation",
        userFirstName: user.firstName,
        userLastName: user.lastName,
        message: "Are you sure you want to affect admin role to : ",
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userservice.affectAdminRole(user._id).subscribe(
          (res) => {},
          (err) => {
            console.log(err);
            this.toaster.pop("error", "Error", err.message);
          },
          () => {
            this.toaster.pop(
              "success",
              "Success",
              "Admin role affected successfully"
            );
            this.adminList = [];
            this.usersList = [];
            this.userservice.getUsers().subscribe(
              (res) => {
                this.allUsersList = res;
              },
              (err) => {
                console.log(err);
                this.toaster.pop("error", "Error", err.message);
              },
              () => {
                this.allUsersList.forEach((element) => {
                  element.birthDate = this.datePipe.transform(
                    element.birthDate,
                    "dd MMMM yyyy"
                  );
                  element.updatedAt = this.datePipe.transform(
                    element.updatedAt,
                    "dd MMMM yyyy, à HH:mm"
                  );
                  if (element.role == "admin") {
                    this.adminList.push(element);
                  } else {
                    this.usersList.push(element);
                  }
                });
              }
            );
          }
        );
      }
    });
  }
  desaffectAdmin(user) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      height: "fit-content",
      minWidth: "280px",
      width: "50%",
      data: {
        title: "Desaffect admin confirmation",
        userFirstName: user.firstName,
        userLastName: user.lastName,
        message: "Are you sure you want to desaffect admin role from : ",
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userservice.desaffectAdminRole(user._id).subscribe(
          (res) => {},
          (err) => {
            console.log(err);
            this.toaster.pop("error", "Error", err.message);
          },
          () => {
            this.toaster.pop(
              "success",
              "Success",
              "Admin role desaffected successfully"
            );
            this.adminList = [];
            this.usersList = [];
            this.userservice.getUsers().subscribe(
              (res) => {
                this.allUsersList = res;
              },
              (err) => {
                console.log(err);
                this.toaster.pop("error", "Error", err.message);
              },
              () => {
                this.allUsersList.forEach((element) => {
                  element.birthDate = this.datePipe.transform(
                    element.birthDate,
                    "dd MMMM yyyy"
                  );
                  element.updatedAt = this.datePipe.transform(
                    element.updatedAt,
                    "dd MMMM yyyy, à HH:mm"
                  );
                  if (element.role == "admin") {
                    this.adminList.push(element);
                  } else {
                    this.usersList.push(element);
                  }
                });
              }
            );
          }
        );
      }
    });
  }
  deleteUser(user) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      height: "fit-content",
      minWidth: "280px",
      width: "50%",
      data: {
        title: "Delete user",
        userFirstName: user.firstName,
        userLastName: user.lastName,
        message: "Are you sure you want to delete : ",
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userservice.deleteUser(user._id).subscribe(
          (res) => {},
          (err) => {
            console.log(err);
            this.toaster.pop("error", "Error", err.message);
          },
          () => {
            this.toaster.pop("success", "Success", "User deleted successfully");
            this.adminList = [];
            this.usersList = [];
            this.userservice.getUsers().subscribe(
              (res) => {
                this.allUsersList = res;
              },
              (err) => {
                console.log(err);
                this.toaster.pop("error", "Error", err.message);
              },
              () => {
                this.allUsersList.forEach((element) => {
                  element.birthDate = this.datePipe.transform(
                    element.birthDate,
                    "dd MMMM yyyy"
                  );
                  element.updatedAt = this.datePipe.transform(
                    element.updatedAt,
                    "dd MMMM yyyy, à HH:mm"
                  );
                  if (element.role == "admin") {
                    this.adminList.push(element);
                  } else {
                    this.usersList.push(element);
                  }
                });
              }
            );
          }
        );
      }
    });
  }
}
