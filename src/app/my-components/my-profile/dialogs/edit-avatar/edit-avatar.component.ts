import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  DialogRole,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ToasterService } from "angular2-toaster";
import { UserService } from "../../../../services/user.service";

@Component({
  selector: "app-edit-avatar",
  templateUrl: "./edit-avatar.component.html",
  styleUrls: ["./edit-avatar.component.css"],
})
export class EditAvatarComponent implements OnInit {
  avatarForm: FormGroup;
  constructor(
    private toaster: ToasterService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public userId: any,
    private dialogRef: MatDialogRef<EditAvatarComponent>
  ) {}

  ngOnInit(): void {
    this.avatarForm = new FormGroup({
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
      this.avatarForm.controls.readOnlyInput.setValue(roi.value);
      const file = (event.target as HTMLInputElement).files[0];
      this.avatarForm.patchValue({
        fakeImage: file,
      });
      this.avatarForm.get("image").updateValueAndValidity();
    } else {
      roi.value = "";
      this.avatarForm.controls.readOnlyInput.setValue(roi.value);
    }
  }
  submitForm(form) {
    if (form.status === "VALID") {
      let formData = new FormData();
      formData.append("avatar", form.get("fakeImage").value);
      this.userService.updateUsersAvatar(this.userId, formData).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
          if (err.status == 500) {
            this.toaster.pop("error", "Error", "Internal server error");
          } else if (err.status == 401) {
            this.toaster.pop("error", "Error", "Session expired");
            this.dialogRef.close(false);
          } else {
            const errKeys = Object.keys(err.error);
            const errValues: string[] = Object.values(err.error);
            console.log(Object.keys(err.error));
            for (let i = 0; i < errValues.length; i++) {
              const element = errValues[i];
              this.toaster.pop("error", "Error", element);
            }
          }
        },
        () => {
          this.toaster.pop("success", "Success", "Avatar updated seccessfully");
          this.dialogRef.close(true);
        }
      );
    } else {
      this.toaster.pop("error", "Error", "Invalid field");
    }
  }
}
