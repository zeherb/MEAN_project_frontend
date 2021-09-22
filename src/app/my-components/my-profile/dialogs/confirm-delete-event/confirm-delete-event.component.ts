import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import { EventService } from "../../../../services/event.service";

@Component({
  selector: "app-confirm-delete-event",
  templateUrl: "./confirm-delete-event.component.html",
  styleUrls: ["./confirm-delete-event.component.css"],
})
export class ConfirmDeleteEventComponent implements OnInit {
  eventId: any;
  ownerId: any;
  event: any;
  constructor(
    private eventService: EventService,
    private toaster: ToasterService,
    @Inject(MAT_DIALOG_DATA) public selectedEvent: any,
    private dialogRef: MatDialogRef<ConfirmDeleteEventComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventService.getEventById(this.selectedEvent._id).subscribe(
      (res) => {
        this.event = res;
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }

  confirm() {
    this.eventService
      .deleteEvent(this.selectedEvent._id, this.event.owner._id)
      .subscribe(
        (res) => {},
        (err) => {
          console.log(err);
          let errorMessage = err.error
            .split("<pre>")
            .pop()
            .split("<br>")
            .shift();
          this.toaster.pop("error", "Error", errorMessage);
        },
        () => {
          this.toaster.pop("success", "Success", "Event deleted successfully");
          this.dialogRef.close(true);
        }
      );
  }
  logout() {
    localStorage.removeItem("loginToken");
    this.router.navigate(["/login"]);
  }
}
