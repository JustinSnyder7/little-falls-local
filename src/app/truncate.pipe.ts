import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})

export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: 20): string {
    if (value.length > maxLength) {
      return value.substring(0, maxLength) + "..."; // Truncate string if it exceeds maxLength
    } else {
    return value; // Return the original string if it's shorter than maxLength
  }
 }
}