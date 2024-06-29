import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  showToast(
    data:
      | {
          icon: 'success';
          title: string;
        }
      | { icon: 'error'; title?: never }
  ) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: data.icon,
      title:
        data.icon == 'success'
          ? data.title
          : 'There was an error. Please try again later',
    });
  }

  showToastWithConfirm(type: 'cancel' | 'delete', onDelete: () => void) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${type} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete();
      }
    });
  }
}
