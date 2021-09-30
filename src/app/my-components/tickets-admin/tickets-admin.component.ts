import { DatePipe, DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import jwtDecode from "jwt-decode";
import { environment } from "../../../environments/environment";
import { TicketService } from "../../services/ticket.service";
import { UserService } from "../../services/user.service";
import { navItems } from "../../nav";
import { ConfirmationComponent } from "../users-admin/dialogs/confirmation/confirmation.component";
import { navAdminItems } from "../../nav-admin";
import { NotificationsService } from "../../services/notifications.service";
import { io } from "socket.io-client";

@Component({
  selector: "app-tickets-admin",
  templateUrl: "./tickets-admin.component.html",
  styleUrls: ["./tickets-admin.component.css"],
})
export class TicketsAdminComponent implements OnInit {
  userId: any;
  connectedUser: any;
  baseUrl = environment.baseUrl;
  searchText: any;
  ticketList: any;
  navItems: any;
  notifications: any[];
  socket: any;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(
    private userservice: UserService,
    private toaster: ToasterService,
    private router: Router,
    private datePipe: DatePipe,
    private ticketService: TicketService,
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
    this.ticketList = [];
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
    this.ticketService.getAllTickets().subscribe(
      (res) => {
        this.ticketList = res.allTickets;
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.ticketList.forEach((element) => {
          element.createdAt = this.datePipe.transform(
            element.createdAt,
            "dd/MM/yyyy, HH:mm"
          );
          element.event.startDateTime = this.datePipe.transform(
            element.event.startDateTime,
            "dd/MM/yyyy, HH:mm"
          );
          element.event.endDateTime = this.datePipe.transform(
            element.event.endDateTime,
            "dd/MM/yyyy, HH:mm"
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
    this.toaster.pop("success", "Success", "Logged out successfully");
    this.router.navigate(["/login"]);
  }
  downloadTicket(ticket) {
    window.open(ticket);
  }
  deleteTicket(ticket) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      height: "fit-content",
      minWidth: "280px",
      width: "50%",
      data: {
        title: "Delete user",
        userFirstName: ticket._id,
        userLastName: "",
        message: "Are you sure you want to delete this ticket : ",
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.ticketService.deleteTicket(ticket._id).subscribe(
          (res) => {},
          (err) => {
            console.log(err);
            this.toaster.pop("error", "Error", err.message);
          },
          () => {
            this.toaster.pop(
              "success",
              "Success",
              "Ticket deleted successfully"
            );
            this.ticketService.getAllTickets().subscribe(
              (res) => {
                this.ticketList = res.allTickets;
              },
              (err) => {
                console.log(err);
              },
              () => {
                this.ticketList.forEach((element) => {
                  element.createdAt = this.datePipe.transform(
                    element.createdAt,
                    "dd/MM/yyyy, HH:mm"
                  );
                  element.event.startDateTime = this.datePipe.transform(
                    element.event.startDateTime,
                    "dd/MM/yyyy, HH:mm"
                  );
                  element.event.endDateTime = this.datePipe.transform(
                    element.event.endDateTime,
                    "dd/MM/yyyy, HH:mm"
                  );
                });
              }
            );
          }
        );
      }
    });
  }

  creationUp() {
    this.ticketService.getAllTickets().subscribe(
      (res) => {
        this.ticketList = res.allTickets;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.message);
      },
      () => {
        this.ticketList.forEach((element) => {
          element.createdAt = new Date(element.createdAt).getTime();
        });
        this.ticketList.sort(this.dynamicSort("createdAt"));
        this.ticketList.forEach((element) => {
          element.createdAt = this.datePipe.transform(
            element.createdAt,
            "dd/MM/yyyy, HH:mm"
          );
          element.event.startDateTime = this.datePipe.transform(
            element.event.startDateTime,
            "dd/MM/yyyy, HH:mm"
          );
          element.event.endDateTime = this.datePipe.transform(
            element.event.endDateTime,
            "dd/MM/yyyy, HH:mm"
          );
        });
      }
    );
  }
  creationDown() {
    this.ticketService.getAllTickets().subscribe(
      (res) => {
        this.ticketList = res.allTickets;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.message);
      },
      () => {
        this.ticketList.forEach((element) => {
          element.createdAt = new Date(element.createdAt).getTime();
        });
        this.ticketList.sort(this.dynamicSort("-createdAt"));
        this.ticketList.forEach((element) => {
          element.createdAt = this.datePipe.transform(
            element.createdAt,
            "dd/MM/yyyy, HH:mm"
          );
          element.event.startDateTime = this.datePipe.transform(
            element.event.startDateTime,
            "dd/MM/yyyy, HH:mm"
          );
          element.event.endDateTime = this.datePipe.transform(
            element.event.endDateTime,
            "dd/MM/yyyy, HH:mm"
          );
        });
      }
    );
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
