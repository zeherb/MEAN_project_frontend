import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToasterService } from "angular2-toaster";
import { UserService } from "../../../../services/user.service";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.css"],
})
export class EditProfileComponent implements OnInit {
  editProfileForm: FormGroup;
  usersBD: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public user: any,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<EditProfileComponent>,
    private userService: UserService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.usersBD = this.datePipe.transform(this.user.birthDate, "dd-MMM-yyyy");
    this.editProfileForm = new FormGroup({
      firstName: new FormControl(this.user.firstName, [
        Validators.pattern(
          "^[a-zA-Z êëéàÿôöûüçâäîïÂÄÊËÎÏÔÖÛÜ]*[a-zA-Z]+[a-zA-Z]*$"
        ),
        Validators.required,
      ]),
      lastName: new FormControl(this.user.lastName, [
        Validators.pattern(
          "^[a-zA-Z êëéàÿôöûüçâäîïÂÄÊËÎÏÔÖÛÜ]*[a-zA-Z]+[a-zA-Z]*$"
        ),
        Validators.required,
      ]),
      email: new FormControl(this.user.email, [
        Validators.email,
        Validators.required,
      ]),
      birthDate: new FormControl(this.user.birthDate, Validators.required),
      phone: new FormControl(this.user.phone, [
        Validators.pattern("^[0-9 ()+-]+$"),
        Validators.required,
      ]),
      address: new FormControl(this.user.address, Validators.required),
    });
  }
  editProfile(form) {
    // if (form.status == "VALID") {
    this.userService.updateUser(this.user._id, form.value).subscribe(
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
        this.toaster.pop("success", "Success", "Updated successfully");
        this.dialogRef.close(true);
      }
    );
  }
}
