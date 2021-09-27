import { Component, Inject, OnInit } from "@angular/core";
import { DatePipe, DOCUMENT } from "@angular/common";
import { navItems } from "../../_nav";
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
  public navItems = navItems;
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
    localStorage.setItem("selectedUserId", id);
    this.router.navigate(["/user-profile"]);
  }
}
