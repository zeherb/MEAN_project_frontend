import { DatePipe, DOCUMENT } from "@angular/common";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import { environment } from "../../../environments/environment";
import { user } from "../../models/user";
import { UserService } from "../../services/user.service";
import { navItems } from "../../nav";
import { ConfirmDeleteEventComponent } from "./dialogs/confirm-delete-event/confirm-delete-event.component";
import { EditAvatarComponent } from "./dialogs/edit-avatar/edit-avatar.component";
import { EditProfileComponent } from "./dialogs/edit-profile/edit-profile.component";
import { UpdateEventComponent } from "./dialogs/update-event/update-event.component";
import jwtDecode from "jwt-decode";
import { BookingDialogComponent } from "../home/dialogs/booking-dialog/booking-dialog.component";
import { navAdminItems } from "../../nav-admin";
import { NotificationsService } from "../../services/notifications.service";
import { io } from "socket.io-client";

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.css"],
})
export class MyProfileComponent implements OnInit {
  baseUrl = environment.baseUrl;
  connectedUser: user;
  connectedUserBirthDay: String;
  finishedEvents: any[];
  liveEvents: any[];
  programmedEvents: any[];
  today: any;
  userId: any;
  joinedUsText: String;
  joinedUsNumber: number;
  notifications: any[];
  navItems = navItems;
  socket: any;

  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private userservice: UserService,
    private toaster: ToasterService,
    private notifService: NotificationsService,
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
    this.today = Date.now();
    this.finishedEvents = [];
    this.liveEvents = [];
    this.programmedEvents = [];

    this.userId = jwtDecode<any>(
      JSON.parse(localStorage.getItem("loginToken")).token
    ).userId;
    this.userservice.getUserById(this.userId).subscribe(
      (res) => {
        this.connectedUser = res;
      },
      (err) => {},
      () => {
        this.connectedUserBirthDay = this.datePipe.transform(
          this.connectedUser.birthDate,
          "dd MMMM yyyy"
        );
        let createdAt = new Date(this.connectedUser.createdAt);
        let today = new Date();
        let diff = (today.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
        let diff2 = diff / 30;
        let diff3 = diff2 / 12;
        if (diff3 >= 2) {
          this.joinedUsText = "years ago";
          this.joinedUsNumber = Math.floor(diff3);
        } else if (diff3 >= 1) {
          this.joinedUsText = "year ago";
          this.joinedUsNumber = Math.floor(diff3);
        } else if (diff2 >= 2) {
          this.joinedUsText = "months ago";
          this.joinedUsNumber = Math.floor(diff2);
        } else if (diff2 >= 1) {
          this.joinedUsText = "month ago";
          this.joinedUsNumber = Math.floor(diff2);
        } else {
          this.joinedUsText = "Less than one month";
        }
        this.connectedUser.events.forEach((element) => {
          if (this.today > new Date(element.endDateTime).getTime()) {
            element.startDateTime = this.datePipe.transform(
              element.startDateTime,
              "dd-MMM-yyyy, HH:mm"
            );
            element.endDateTime = this.datePipe.transform(
              element.endDateTime,
              "dd-MMM-yyyy, HH:mm"
            );

            this.finishedEvents.push(element);
          } else if (this.today > new Date(element.startDateTime).getTime()) {
            element.startDateTime = this.datePipe.transform(
              element.startDateTime,
              "dd-MMM-yyyy, HH:mm"
            );
            element.endDateTime = this.datePipe.transform(
              element.endDateTime,
              "dd-MMM-yyyy, HH:mm"
            );

            this.liveEvents.push(element);
          } else if (this.today < new Date(element.startDateTime).getTime()) {
            element.startDateTime = this.datePipe.transform(
              element.startDateTime,
              "dd-MMM-yyyy, HH:mm"
            );
            element.endDateTime = this.datePipe.transform(
              element.endDateTime,
              "dd-MMM-yyyy, HH:mm"
            );

            this.programmedEvents.push(element);
          }
        });
        if (this.connectedUser.role === "admin") {
          this.navItems = navAdminItems;
        } else {
          this.navItems = navItems;
        }
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
          this.notifications.forEach((element) => {
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
    this.showToaster("success", "Success", "Logged out successfully");
    this.router.navigate(["/login"]);
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
  updateAvatar() {
    const dialogRef = this.dialog.open(EditAvatarComponent, {
      height: "fit-content",
      minWidth: "300px",
      width: "70%",
      data: this.userId,
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userservice.getUserById(this.userId).subscribe(
          (res) => {
            this.connectedUser = res;
          },
          (err) => {
            console.log(err);
          },
          () => {}
        );
      }
    });
  }
  updateProfile() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      height: "fit-content",
      minWidth: "300px",
      width: "70%",
      maxHeight: window.innerHeight,
      data: this.connectedUser,
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userservice.getUserById(this.userId).subscribe(
          (res) => {
            this.connectedUser = res;
          },
          (err) => {
            console.log(err);
          },
          () => {
            this.connectedUserBirthDay = this.datePipe.transform(
              this.connectedUser.birthDate,
              "dd MMMM yyyy"
            );
          }
        );
      }
    });
  }
  showToaster(type, title, message) {
    this.toaster.pop(type, title, message);
  }
  openUpdateEventDialog(event) {
    const dialogRef = this.dialog.open(UpdateEventComponent, {
      height: "fit-content",
      minWidth: "300px",
      width: "70%",
      maxHeight: window.innerHeight - 100 + "px",
      data: event,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.finishedEvents = [];
      this.liveEvents = [];
      this.programmedEvents = [];
      this.userservice.getUserById(this.userId).subscribe(
        (res) => {
          this.connectedUser = res;
        },
        (err) => {},
        () => {
          this.connectedUserBirthDay = this.datePipe.transform(
            this.connectedUser.birthDate,
            "dd MMMM yyyy"
          );

          this.connectedUser.events.forEach((element) => {
            if (this.today > new Date(element.endDateTime).getTime()) {
              element.startDateTime = this.datePipe.transform(
                element.startDateTime,
                "dd-MMM-yyyy, HH:mm"
              );
              element.endDateTime = this.datePipe.transform(
                element.endDateTime,
                "dd-MMM-yyyy, HH:mm"
              );

              this.finishedEvents.push(element);
            } else if (this.today > new Date(element.startDateTime).getTime()) {
              element.startDateTime = this.datePipe.transform(
                element.startDateTime,
                "dd-MMM-yyyy, HH:mm"
              );
              element.endDateTime = this.datePipe.transform(
                element.endDateTime,
                "dd-MMM-yyyy, HH:mm"
              );

              this.liveEvents.push(element);
            } else if (this.today < new Date(element.startDateTime).getTime()) {
              element.startDateTime = this.datePipe.transform(
                element.startDateTime,
                "dd-MMM-yyyy, HH:mm"
              );
              element.endDateTime = this.datePipe.transform(
                element.endDateTime,
                "dd-MMM-yyyy, HH:mm"
              );

              this.programmedEvents.push(element);
            }
          });
        }
      );
    });
  }
  confirmDeleteDialog(event) {
    const dialogRef = this.dialog.open(ConfirmDeleteEventComponent, {
      height: "fit-content",
      minWidth: "300px",
      width: "70%",
      data: event,
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.finishedEvents = [];
        this.liveEvents = [];
        this.programmedEvents = [];
        this.userservice.getUserById(this.userId).subscribe(
          (res) => {
            this.connectedUser = res;
          },
          (err) => {},
          () => {
            this.connectedUserBirthDay = this.datePipe.transform(
              this.connectedUser.birthDate,
              "dd MMMM yyyy"
            );

            this.connectedUser.events.forEach((element) => {
              if (this.today > new Date(element.endDateTime).getTime()) {
                element.startDateTime = this.datePipe.transform(
                  element.startDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );
                element.endDateTime = this.datePipe.transform(
                  element.endDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );

                this.finishedEvents.push(element);
              } else if (
                this.today > new Date(element.startDateTime).getTime()
              ) {
                element.startDateTime = this.datePipe.transform(
                  element.startDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );
                element.endDateTime = this.datePipe.transform(
                  element.endDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );

                this.liveEvents.push(element);
              } else if (
                this.today < new Date(element.startDateTime).getTime()
              ) {
                element.startDateTime = this.datePipe.transform(
                  element.startDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );
                element.endDateTime = this.datePipe.transform(
                  element.endDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );

                this.programmedEvents.push(element);
              }
            });
          }
        );
      }
    });
  }
  openBookingDialog(event) {
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      height: "fit-content",
      minWidth: "300px",
      width: "70%",
      maxHeight: window.innerHeight,
      data: { event: event, user: this.connectedUser },
    });
    dialogRef.afterClosed().subscribe((confirmed: Boolean) => {
      if (confirmed) {
        this.finishedEvents = [];
        this.liveEvents = [];
        this.programmedEvents = [];
        this.userservice.getUserById(this.userId).subscribe(
          (res) => {
            this.connectedUser = res;
          },
          (err) => {},
          () => {
            this.connectedUserBirthDay = this.datePipe.transform(
              this.connectedUser.birthDate,
              "dd MMMM yyyy"
            );

            this.connectedUser.events.forEach((element) => {
              if (this.today > new Date(element.endDateTime).getTime()) {
                element.startDateTime = this.datePipe.transform(
                  element.startDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );
                element.endDateTime = this.datePipe.transform(
                  element.endDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );

                this.finishedEvents.push(element);
              } else if (
                this.today > new Date(element.startDateTime).getTime()
              ) {
                element.startDateTime = this.datePipe.transform(
                  element.startDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );
                element.endDateTime = this.datePipe.transform(
                  element.endDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );

                this.liveEvents.push(element);
              } else if (
                this.today < new Date(element.startDateTime).getTime()
              ) {
                element.startDateTime = this.datePipe.transform(
                  element.startDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );
                element.endDateTime = this.datePipe.transform(
                  element.endDateTime,
                  "dd-MMM-yyyy, HH:mm"
                );

                this.programmedEvents.push(element);
              }
            });
          }
        );
      }
    });
  }
}
