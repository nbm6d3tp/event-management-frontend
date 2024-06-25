import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  showToast(icon: 'error' | 'success', title: string) {
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
      icon,
      title,
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
        Swal.fire({
          title: 'Deleted!',
          text: `Your file has been ${
            type === 'delete' ? 'deleted' : 'canceled'
          }.`,
          icon: 'success',
        });
      }
    });
  }
}
