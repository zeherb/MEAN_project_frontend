import { DatePipe, DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import jwtDecode from "jwt-decode";
import { environment } from "../../../environments/environment";
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user.service";
import { navItems } from "../../nav";
import { ConfirmationComponent } from "../users-admin/dialogs/confirmation/confirmation.component";
import { navAdminItems } from "../../nav-admin";
import { NotificationsService } from "../../services/notifications.service";
import { io } from "socket.io-client";

@Component({
  selector: "app-events-admin",
  templateUrl: "./events-admin.component.html",
  styleUrls: ["./events-admin.component.css"],
})
export class EventsAdminComponent implements OnInit {
  newNotification: number;
  userId: any;
  connectedUser: any;
  allEvents: any[];
  finishedEvents: any[];
  liveEvents: any[];
  programmedEvents: any[];
  today: any;
  searchText: any;
  baseUrl = environment.baseUrl;
  navItems: any;
  notifications: any[];
  socket: any;

  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(
    private userservice: UserService,
    private eventService: EventService,
    private toaster: ToasterService,
    private router: Router,
    private datePipe: DatePipe,
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
    this.today = Date.now();
    this.finishedEvents = [];
    this.liveEvents = [];
    this.programmedEvents = [];
    this.eventService.getAllEvents().subscribe(
      (res) => {
        this.allEvents = res;
      },
      (err) => {},
      () => {
        this.allEvents.forEach((element) => {
          element.createdAt = this.datePipe.transform(
            element.createdAt,
            "dd-MMM-yyyy, HH:mm"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd-MMM-yyyy, HH:mm"
          );
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
  deleteEvent(event) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      height: "fit-content",
      minWidth: "280px",
      width: "50%",
      data: {
        title: "Delete Event",
        userFirstName: event.title,
        userLastName: "",
        message: "Are you sure you want to delete this event : ",
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.eventService.deleteEvent(event._id, event.owner._id).subscribe(
          (res) => {},
          (err) => {
            console.log(err);
            this.toaster.pop("error", "Error", err.error.message);
          },
          () => {
            this.toaster.pop(
              "success",
              "Success",
              "Event deleted successfully"
            );
            this.today = Date.now();
            this.finishedEvents = [];
            this.liveEvents = [];
            this.programmedEvents = [];
            this.eventService.getAllEvents().subscribe(
              (res) => {
                this.allEvents = res;
              },
              (err) => {},
              () => {
                this.allEvents.forEach((element) => {
                  element.createdAt = this.datePipe.transform(
                    element.createdAt,
                    "dd-MMM-yyyy, HH:mm"
                  );
                  element.updatedAt = this.datePipe.transform(
                    element.updatedAt,
                    "dd-MMM-yyyy, HH:mm"
                  );
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
        );
      }
    });
  }
  ascendingPrice() {
    this.programmedEvents.sort(this.dynamicSort("price"));
    this.liveEvents.sort(this.dynamicSort("price"));
    this.finishedEvents.sort(this.dynamicSort("price"));
  }
  decreasingPrice() {
    this.programmedEvents.sort(this.dynamicSort("-price"));
    this.liveEvents.sort(this.dynamicSort("-price"));
    this.finishedEvents.sort(this.dynamicSort("-price"));
  }
  availability() {
    this.programmedEvents.sort(this.dynamicSort("-availableTicketNumber"));
    this.liveEvents.sort(this.dynamicSort("-availableTicketNumber"));
    this.finishedEvents.sort(this.dynamicSort("-availableTicketNumber"));
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
