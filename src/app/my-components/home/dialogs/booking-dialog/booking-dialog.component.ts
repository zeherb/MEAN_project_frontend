import { Component, HostListener, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ToasterService } from "angular2-toaster";
import { environment } from "../../../../../environments/environment";
import { ReservationService } from "../../../../services/reservation.service";
import { ConfirmBookingComponent } from "../confirm-booking/confirm-booking.component";

@Component({
  selector: "app-booking-dialog",
  templateUrl: "./booking-dialog.component.html",
  styleUrls: ["./booking-dialog.component.css"],
})
export class BookingDialogComponent implements OnInit {
  baseUrl = environment.baseUrl;
  event: any;
  user: any;
  handler: StripeCheckoutHandler;
  confirmation: any;
  loading = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private toaster: ToasterService,
    private reservationService: ReservationService,
    private bookDialogRef: MatDialogRef<BookingDialogComponent>
  ) {}

  ngOnInit(): void {
    this.event = this.data.event;
    this.user = this.data.user;
    this.handler = StripeCheckout.configure({
      key: "pk_test_51JYDDVGaogjNa9eaoy0DUtEd1pCQe5DW75SQJIzZsO3Gfnk7tOK4opNONx51cU7A1bFlMlnMHvwXqrTG8BFF3ljx00VxesgiNb",
      image: "../../../../../assets/img/stripe.png",
      locale: "auto",
      currency: "usd",
      source: async (source) => {
        this.loading = true;
        this.reservationService
          .reservation(this.event._id, this.user._id)
          .subscribe(
            (res) => {
              console.log(res);
            },
            (err) => {
              console.log(err);
              this.toaster.pop("error", "Error", err.message);
            },
            () => {
              this.toaster.pop("success", "Success", "Booking success");
              this.bookDialogRef.close(true);
            }
          );
      },
    });
  }
  openConfirmation(event, user) {
    const dialogRef = this.dialog.open(ConfirmBookingComponent, {
      height: "fit-content",
      minWidth: "300px",
      width: "70%",
      maxHeight: window.innerHeight,
      data: { event: event, user: user },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.bookDialogRef.close(true);
      }
    });
  }
  openStripe(e) {
    this.handler.open({
      name: this.event.title,
      amount: this.event.price * 100,
      email: this.user.email,
    });
    e.preventDefault();
  }

  @HostListener("window:popstate")
  onPopstate() {
    this.handler.close();
  }
}
