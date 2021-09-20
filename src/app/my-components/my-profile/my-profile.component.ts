import { DatePipe, DOCUMENT, formatDate } from "@angular/common";
import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import { environment } from "../../../environments/environment";
import { event } from "../../models/event";
import { user } from "../../models/user";
import { EventService } from "../../services/event.service";
import { UserService } from "../../services/user.service";
import { navItems } from "../../_nav";

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
  updateProfile() {}
  showToaster(type, title, message) {
    this.toaster.pop(type, title, message);
  }
}
