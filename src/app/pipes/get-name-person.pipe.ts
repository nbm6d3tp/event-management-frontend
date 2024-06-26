import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getNamePerson',
})
export class GetNamePersonPipe implements PipeTransform {
  transform(firstname: string, lastname: string): string {
    return firstname + ' ' + lastname;
  }
}
