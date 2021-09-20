import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import { EventService } from "../../../../services/event.service";

@Component({
  selector: "app-update-event-image",
  templateUrl: "./update-event-image.component.html",
  styleUrls: ["./update-event-image.component.css"],
})
export class UpdateEventImageComponent implements OnInit {
  imageForm: FormGroup;
  constructor(
    private eventService: EventService,
    private router: Router,
    private dialogRef: MatDialogRef<UpdateEventImageComponent>,
    private toaster: ToasterService,
    @Inject(MAT_DIALOG_DATA) public eventId: any
  ) {}

  ngOnInit(): void {
    this.imageForm = new FormGroup({
      image: new FormControl("", Validators.required),
      fakeImage: new FormControl("", Validators.required),
      readOnlyInput: new FormControl("", [
        Validators.required,
        Validators.pattern("[^\\s]+(.*?)\\.(jpg|jpeg|png)$"),
      ]),
    });
  }
  fileSelected(fi, roi, event) {
    if (fi.value !== null && fi.value !== "" && fi.value !== undefined) {
      roi.value = fi.files[0].name;
      this.imageForm.controls.readOnlyInput.setValue(roi.value);
      const file = (event.target as HTMLInputElement).files[0];
      this.imageForm.patchValue({
        fakeImage: file,
      });
      this.imageForm.get("image").updateValueAndValidity();
    } else {
      roi.value = "";
      this.imageForm.controls.readOnlyInput.setValue(roi.value);
    }
  }
  submitForm(form) {
    if (form.status == "VALID") {
      let formData = new FormData();
      formData.append("image", form.get("fakeImage").value);
      this.eventService.updateEventImage(this.eventId, formData).subscribe(
        (res) => {},
        (err) => {
          console.log(err);
          let errorMessage = err.error
            .split("<pre>")
            .pop()
            .split("<br>")
            .shift();
          this.toaster.pop("error", "Error", errorMessage);
          if (errorMessage.includes("jwt expired")) {
            this.logout();
            this.dialogRef.close(false);
          }
        },
        () => {
          this.dialogRef.close(true);
          this.toaster.pop(
            "success",
            "Success",
            "Event image updated successfully "
          );
        }
      );
    }
  }
  logout() {
    localStorage.removeItem("loginToken");
    this.router.navigate(["/login"]);
  }
}
