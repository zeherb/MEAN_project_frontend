import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToasterService } from "angular2-toaster";
import { TagsService } from "../../../../services/tags.service";

@Component({
  selector: "app-update-tag",
  templateUrl: "./update-tag.component.html",
  styleUrls: ["./update-tag.component.css"],
})
export class UpdateTagComponent implements OnInit {
  tagForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public tag: any,
    private dialogRef: MatDialogRef<UpdateTagComponent>,
    private toaster: ToasterService,
    private tagService: TagsService
  ) {}

  ngOnInit(): void {
    this.tagForm = new FormGroup({
      name: new FormControl(this.tag.name, Validators.required),
      description: new FormControl(this.tag.description, Validators.required),
    });
  }
  updateTag(form) {
    if (form.status == "INVALID") {
      this.toaster.pop("error", "Error", "Emplty field");
    } else {
      this.tagService.updateTag(this.tag._id, form.value).subscribe(
        (res) => {},
        (err) => {
          console.log(err);
          this.toaster.pop("error", "Error", err.error.message);
        },
        () => {
          this.toaster.pop("success", "Success", "Tag updated Successfully");
          this.dialogRef.close(true);
        }
      );
    }
  }
}
