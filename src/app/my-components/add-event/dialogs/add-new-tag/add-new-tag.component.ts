import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToasterService } from "angular2-toaster";
import { TagsService } from "../../../../services/tags.service";

@Component({
  selector: "app-add-new-tag",
  templateUrl: "./add-new-tag.component.html",
  styleUrls: ["./add-new-tag.component.css"],
})
export class AddNewTagComponent implements OnInit {
  tagForm: FormGroup;

  constructor(
    private tagService: TagsService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.tagForm = new FormGroup({
      name: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
    });
  }
  addTag(form) {
    if (form.status == "VALID") {
      this.tagService.addTag(form.value).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
          this.showToaster("error", "Error", err.error.message);
        },
        () => {
          this.showToaster("success", "Success", "Tag added successfully");
        }
      );
    } else {
      this.showToaster("error", "Tag was not added", "Please fill the fields");
    }
  }
  showToaster(type, title, err) {
    this.toaster.pop(type, title, err);
  }
}
