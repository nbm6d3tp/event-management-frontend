import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateName',
})
export class TruncateNamePipe implements PipeTransform {
  transform(
    value: string,
    maxLength: number = 16,
    ellipsis: string = '...'
  ): unknown {
    if (value.length > maxLength) {
      return value.slice(0, maxLength) + ellipsis;
    }

    return value;
  }
}
