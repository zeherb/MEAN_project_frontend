import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToasterService } from "angular2-toaster";
import { ReservationService } from "../../../../services/reservation.service";

@Component({
  selector: "app-confirm-booking",
  templateUrl: "./confirm-booking.component.html",
  styleUrls: ["./confirm-booking.component.css"],
})
export class ConfirmBookingComponent implements OnInit {
  event: any;
  user: any;
  constructor(
    private dialogRef: MatDialogRef<ConfirmBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToasterService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.event = this.data.event;
    this.user = this.data.user;
    console.log(this.data);
  }
  confirm(event, user) {
    this.reservationService.reservation(event._id, user._id).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.message);
      },
      () => {
        this.toaster.pop("success", "Success", "Booking success");
        this.dialogRef.close(true);
      }
    );
  }
}
