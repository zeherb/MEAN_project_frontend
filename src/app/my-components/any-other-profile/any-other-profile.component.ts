import { DatePipe } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import jwtDecode from "jwt-decode";
import { environment } from "../../../environments/environment";
import { UserService } from "../../services/user.service";
import { BookingDialogComponent } from "../home/dialogs/booking-dialog/booking-dialog.component";

@Component({
  selector: "app-any-other-profile",
  templateUrl: "./any-other-profile.component.html",
  styleUrls: ["./any-other-profile.component.css"],
})
export class AnyOtherProfileComponent implements OnInit {
  baseUrl = environment.baseUrl;
  today: any;
  finishedEvents: any[];
  liveEvents: any[];
  programmedEvents: any[];
  userId: any;
  selectedUserId: any;
  selectedUser: any;
  joinedUsText: String;
  joinedUsNumber: Number;
  connectedUser: any;
  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private datePipe: DatePipe,
    private toaster: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.today = Date.now();
    this.finishedEvents = [];
    this.liveEvents = [];
    this.programmedEvents = [];
    this.userId = jwtDecode<any>(
      JSON.parse(localStorage.getItem("loginToken")).token
    ).userId;
    this.userService.getUserById(this.userId).subscribe(
      (res) => {
        this.connectedUser = res;
      },
      (err) => {},
      () => {}
    );
    this.selectedUserId = localStorage.getItem("selectedUserId");
    this.userService.getUserById(this.selectedUserId).subscribe(
      (res) => {
        this.selectedUser = res;
      },
      (err) => {},
      () => {
        this.selectedUser.birthDate = this.datePipe.transform(
          this.selectedUser.birthDate,
          "dd MMMM yyyy"
        );
        let createdAt = new Date(this.selectedUser.createdAt);
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
        this.selectedUser.events.forEach((element) => {
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
  ngOnDestroy(): void {
    localStorage.removeItem("selectedUserId");
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
        this.userService.getUserById(this.selectedUserId).subscribe(
          (res) => {
            this.selectedUser = res;
          },
          (err) => {},
          () => {
            this.selectedUser.birthDate = this.datePipe.transform(
              this.selectedUser.birthDate,
              "dd MMMM yyyy"
            );

            this.selectedUser.events.forEach((element) => {
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
  logOut() {
    localStorage.removeItem("loginToken");
    this.toaster.pop("success", "Success", "Logged out successfully");
    this.router.navigate(["/login"]);
  }
}
