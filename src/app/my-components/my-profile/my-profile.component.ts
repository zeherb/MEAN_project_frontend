import { DatePipe, DOCUMENT, formatDate } from "@angular/common";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import { environment } from "../../../environments/environment";
import { event } from "../../models/event";
import { user } from "../../models/user";
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user.service";
import { navItems } from "../../_nav";
import { ConfirmDeleteEventComponent } from "./dialogs/confirm-delete-event/confirm-delete-event.component";
import { EditProfileComponent } from "./dialogs/edit-profile/edit-profile.component";
import { UpdateEventComponent } from "./dialogs/update-event/update-event.component";

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
  todayDay: any;
  todayMonth: any;
  todayYear: any;
  todayHours: any;
  todayMinutes: any;

  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private eventService: EventService,
    private dialog: MatDialog,
    private userservice: UserService,
    private toaster: ToasterService,
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
    this.today = Date.now();
    this.today = formatDate(this.today, "yyyy-MM-dd-HH-mm", "en_Us");
    this.finishedEvents = [];
    this.liveEvents = [];
    this.programmedEvents = [];

    this.userservice
      .getUserById(JSON.parse(localStorage.getItem("loginToken")).userId)
      .subscribe(
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
            if (
              this.today >
              formatDate(element.endDateTime, "yyyy-MM-dd-HH-mm", "en_Us")
            ) {
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
              this.today >
              formatDate(element.startDateTime, "yyyy-MM-dd-HH-mm", "en_Us")
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
              this.today <
              formatDate(element.startDateTime, "yyyy-MM-dd-HH-mm", "en_Us")
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

  logOut() {
    localStorage.removeItem("loginToken");
    this.showToaster("success", "Success", "Logged out successfully");
    this.router.navigate(["/login"]);
  }
  updateAvatar() {}
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
        this.userservice
          .getUserById(JSON.parse(localStorage.getItem("loginToken")).userId)
          .subscribe(
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
      this.programmedEvents = [];
      this.userservice
        .getUserById(JSON.parse(localStorage.getItem("loginToken")).userId)
        .subscribe(
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
              if (
                this.today >
                formatDate(element.endDateTime, "yyyy-MM-dd-HH-mm", "en_Us")
              ) {
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
                this.today >
                formatDate(element.startDateTime, "yyyy-MM-dd-HH-mm", "en_Us")
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
                this.today <
                formatDate(element.startDateTime, "yyyy-MM-dd-HH-mm", "en_Us")
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
        this.programmedEvents = [];
        this.userservice
          .getUserById(JSON.parse(localStorage.getItem("loginToken")).userId)
          .subscribe(
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
                if (
                  this.today >
                  formatDate(element.endDateTime, "yyyy-MM-dd-HH-mm", "en_Us")
                ) {
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
                  this.today >
                  formatDate(element.startDateTime, "yyyy-MM-dd-HH-mm", "en_Us")
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
                  this.today <
                  formatDate(element.startDateTime, "yyyy-MM-dd-HH-mm", "en_Us")
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
