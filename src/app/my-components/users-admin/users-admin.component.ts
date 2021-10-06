import { DatePipe, DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import jwtDecode from "jwt-decode";
import { environment } from "../../../environments/environment";
import { UserService } from "../../services/user.service";
import { navItems } from "../../nav";
import { ConfirmationComponent } from "./dialogs/confirmation/confirmation.component";
import { navAdminItems } from "../../nav-admin";
import { NotificationsService } from "../../services/notifications.service";
import { io } from "socket.io-client";

@Component({
  selector: "app-users-admin",
  templateUrl: "./users-admin.component.html",
  styleUrls: ["./users-admin.component.css"],
})
export class UsersAdminComponent implements OnInit {
  newNotification: number;
  userId: any;
  connectedUser: any;
  allUsersList: any;
  adminList: any;
  usersList: any;
  searchText: any;
  baseUrl = environment.baseUrl;
  navItems: any;
  notifications: any[];
  socket: any;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(
    private notifService: NotificationsService,
    private userservice: UserService,
    private toaster: ToasterService,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    @Inject(DOCUMENT) _document?: any
  ) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized =
        _document.body.classList.contains("sidebar-minimized");
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ["class"],
    });
    this.socket = io(environment.baseUrl, { transports: ["websocket"] });
  }

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
      () => {
        if (this.connectedUser.role === "admin") {
          this.navItems = navAdminItems;
        } else {
          this.navItems = navItems;
        }
      }
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
          element.createdAt = this.datePipe.transform(
            element.createdAt,
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
      if (data.to == this.userId) {
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
      }
    });
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
                  element.createdAt = this.datePipe.transform(
                    element.createdAt,
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
                  element.createdAt = this.datePipe.transform(
                    element.createdAt,
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
                  element.createdAt = this.datePipe.transform(
                    element.createdAt,
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
  AtoZ() {
    this.adminList.sort(this.dynamicSort("firstName"));
    this.usersList.sort(this.dynamicSort("firstName"));
  }
  ZtoA() {
    this.adminList.sort(this.dynamicSort("-firstName"));
    this.usersList.sort(this.dynamicSort("-firstName"));
  }
  creationUp() {
    this.userservice.getUsers().subscribe(
      (res) => {
        this.allUsersList = res;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.message);
      },
      () => {
        this.adminList = [];
        this.usersList = [];
        this.allUsersList.forEach((element) => {
          element.createdAt = new Date(element.createdAt).getTime();
        });
        this.allUsersList.sort(this.dynamicSort("createdAt"));
        this.allUsersList.forEach((element) => {
          element.birthDate = this.datePipe.transform(
            element.birthDate,
            "dd MMMM yyyy"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd MMMM yyyy, à HH:mm"
          );
          element.createdAt = this.datePipe.transform(
            element.createdAt,
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
  creationDown() {
    this.userservice.getUsers().subscribe(
      (res) => {
        this.allUsersList = res;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.message);
      },
      () => {
        this.adminList = [];
        this.usersList = [];
        this.allUsersList.forEach((element) => {
          element.createdAt = new Date(element.createdAt).getTime();
        });
        this.allUsersList.sort(this.dynamicSort("-createdAt"));
        this.allUsersList.forEach((element) => {
          element.birthDate = this.datePipe.transform(
            element.birthDate,
            "dd MMMM yyyy"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd MMMM yyyy, à HH:mm"
          );
          element.createdAt = this.datePipe.transform(
            element.createdAt,
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
  updateUp() {
    this.userservice.getUsers().subscribe(
      (res) => {
        this.allUsersList = res;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.message);
      },
      () => {
        this.adminList = [];
        this.usersList = [];
        this.allUsersList.forEach((element) => {
          element.updatedAt = new Date(element.updatedAt).getTime();
        });
        this.allUsersList.sort(this.dynamicSort("updatedAt"));
        this.allUsersList.forEach((element) => {
          element.birthDate = this.datePipe.transform(
            element.birthDate,
            "dd MMMM yyyy"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd MMMM yyyy, à HH:mm"
          );
          element.createdAt = this.datePipe.transform(
            element.createdAt,
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
  updateDown() {
    this.userservice.getUsers().subscribe(
      (res) => {
        this.allUsersList = res;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.message);
      },
      () => {
        this.adminList = [];
        this.usersList = [];
        this.allUsersList.forEach((element) => {
          element.updatedAt = new Date(element.updatedAt).getTime();
        });
        this.allUsersList.sort(this.dynamicSort("-updatedAt"));
        this.allUsersList.forEach((element) => {
          element.birthDate = this.datePipe.transform(
            element.birthDate,
            "dd MMMM yyyy"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd MMMM yyyy, à HH:mm"
          );
          element.createdAt = this.datePipe.transform(
            element.createdAt,
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
  ageUp() {
    this.userservice.getUsers().subscribe(
      (res) => {
        this.allUsersList = res;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.message);
      },
      () => {
        this.adminList = [];
        this.usersList = [];
        this.allUsersList.forEach((element) => {
          element.birthDate = new Date(element.birthDate).getTime();
        });
        this.allUsersList.sort(this.dynamicSort("-birthDate"));
        this.allUsersList.forEach((element) => {
          element.birthDate = this.datePipe.transform(
            element.birthDate,
            "dd MMMM yyyy"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd MMMM yyyy, à HH:mm"
          );
          element.createdAt = this.datePipe.transform(
            element.createdAt,
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
  ageDown() {
    this.userservice.getUsers().subscribe(
      (res) => {
        this.allUsersList = res;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.message);
      },
      () => {
        this.adminList = [];
        this.usersList = [];
        this.allUsersList.forEach((element) => {
          element.birthDate = new Date(element.birthDate).getTime();
        });
        this.allUsersList.sort(this.dynamicSort("birthDate"));
        this.allUsersList.forEach((element) => {
          element.birthDate = this.datePipe.transform(
            element.birthDate,
            "dd MMMM yyyy"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd MMMM yyyy, à HH:mm"
          );
          element.createdAt = this.datePipe.transform(
            element.createdAt,
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
  eventsUp() {
    let adminsClone = this.adminList;
    let usersClone = this.usersList;
    adminsClone.forEach((element) => {
      element.eventNum = element.events.length;
    });
    usersClone.forEach((element) => {
      element.eventNum = element.events.length;
    });

    adminsClone.sort(this.dynamicSort("eventNum"));
    usersClone.sort(this.dynamicSort("eventNum"));
    this.adminList = adminsClone;
    this.usersList = usersClone;
  }
  eventsDown() {
    let adminsClone = this.adminList;
    let usersClone = this.usersList;
    adminsClone.forEach((element) => {
      element.eventNum = element.events.length;
    });
    usersClone.forEach((element) => {
      element.eventNum = element.events.length;
    });

    adminsClone.sort(this.dynamicSort("-eventNum"));
    usersClone.sort(this.dynamicSort("-eventNum"));
    this.adminList = adminsClone;
    this.usersList = usersClone;
  }
  dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      let result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
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
