import { DatePipe, DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import jwtDecode from "jwt-decode";
import { environment } from "../../../environments/environment";
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user.service";
import { navItems } from "../../_nav";
import { ConfirmationComponent } from "../users-admin/dialogs/confirmation/confirmation.component";

@Component({
  selector: "app-events-admin",
  templateUrl: "./events-admin.component.html",
  styleUrls: ["./events-admin.component.css"],
})
export class EventsAdminComponent implements OnInit {
  userId: any;
  connectedUser: any;
  allEvents: any[];
  finishedEvents: any[];
  liveEvents: any[];
  programmedEvents: any[];
  today: any;
  searchText: any;
  baseUrl = environment.baseUrl;
  public navItems = navItems;
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
      () => {}
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
  }
  logOut() {
    localStorage.removeItem("loginToken");
    this.toaster.pop("success", "Success", "Logged out successfully");
    this.router.navigate(["/login"]);
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
}
