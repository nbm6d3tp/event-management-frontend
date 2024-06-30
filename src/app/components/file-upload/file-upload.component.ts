import { Component, HostListener, model } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

function requiredFileType(types: string[]) {
  return function (control: FormControl) {
    const file = control.value;
    if (file) {
      const extension = file.split('.')[1].toLowerCase();
      if (
        !types
          .map((type) => type.toLowerCase())
          .includes(extension.toLowerCase())
      ) {
        return {
          requiredFileType: true,
        };
      }
      return null;
    }
    return null;
  };
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  file = model<File>();

  constructor(private fb: FormBuilder) {}
  form = this.fb.group({
    image: [
      null,
      {
        validators: [requiredFileType(['jpg', 'png', 'jpeg'])],
      },
    ],
  });

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const targetFile = event.item(0);
    if (targetFile !== null) {
      this.file.set(targetFile);
    }
  }

  get image() {
    return this.form.controls['image'];
  }
}
