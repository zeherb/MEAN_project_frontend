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
        this.notifications = res;
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
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
