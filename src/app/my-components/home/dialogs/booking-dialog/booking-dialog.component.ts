import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { environment } from "../../../../../environments/environment";
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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private bookDialogRef: MatDialogRef<BookingDialogComponent>
  ) {}

  ngOnInit(): void {
    this.event = this.data.event;
    this.user = this.data.user;
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
}
