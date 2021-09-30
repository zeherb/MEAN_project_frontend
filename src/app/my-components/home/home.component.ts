import { Component, Inject, OnInit } from "@angular/core";
import { DatePipe, DOCUMENT } from "@angular/common";
import { navItems } from "../../nav";
import { navAdminItems } from "../../nav-admin";
import { EventService } from "../../services/event.service";
import { event } from "../../models/event";
import { user } from "../../models/user";
import { environment } from "../../../environments/environment";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import jwtDecode from "jwt-decode";
import { MatDialog } from "@angular/material/dialog";
import { BookingDialogComponent } from "./dialogs/booking-dialog/booking-dialog.component";
import { NotificationsService } from "../../services/notifications.service";
import { io } from "socket.io-client";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  eventList: event[];
  baseUrl = environment.baseUrl;
  connectedUser: user;
  userId: any;
  searchText: any;
  navItems: any;
  socket: any;
  socketData: any;
  notifications: any[];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private eventService: EventService,
    private userservice: UserService,
    private toaster: ToasterService,
    private dialog: MatDialog,
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
    this.eventService.getAllEvents().subscribe(
      (res) => {
        this.eventList = res;
      },
      (err) => {
        console.log(err);
      },
      () => {
        for (let i = 0; i < this.eventList.length; i++) {
          const element = this.eventList[i];
          if (
            new Date(element.startDateTime).getTime() < new Date().getTime()
          ) {
            this.eventList.splice(i, 1);
            i--;
          }
        }

        this.eventList.forEach((element) => {
          element.startDateTime = this.datePipe.transform(
            element.startDateTime,
            "dd-MMM-yyyy, HH:mm"
          );
          element.endDateTime = this.datePipe.transform(
            element.endDateTime,
            "dd-MMM-yyyy, HH:mm"
          );
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
  showToaster(type, title, message) {
    this.toaster.pop(type, title, message);
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
        this.eventService.getAllEvents().subscribe(
          (res) => {
            this.eventList = res;
          },
          (err) => {
            console.log(err);
          },
          () => {
            for (let i = 0; i < this.eventList.length; i++) {
              const element = this.eventList[i];
              if (
                new Date(element.startDateTime).getTime() < new Date().getTime()
              ) {
                this.eventList.splice(i, 1);
                i--;
              }
            }

            this.eventList.forEach((element) => {
              element.startDateTime = this.datePipe.transform(
                element.startDateTime,
                "dd-MMM-yyyy, HH:mm"
              );
              element.endDateTime = this.datePipe.transform(
                element.endDateTime,
                "dd-MMM-yyyy, HH:mm"
              );
            });
          }
        );
      }
    });
  }
  profile(id) {
    if (id == this.connectedUser._id) {
      this.router.navigate(["/profile"]);
    } else {
      localStorage.setItem("selectedUserId", id);
      this.router.navigate(["/user-profile"]);
    }
  }
  ascendingPrice() {
    this.eventList.sort(this.dynamicSort("price"));
  }
  decreasingPrice() {
    this.eventList.sort(this.dynamicSort("-price"));
  }
  availability() {
    this.eventList.sort(this.dynamicSort("-availableTicketNumber"));
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
}
