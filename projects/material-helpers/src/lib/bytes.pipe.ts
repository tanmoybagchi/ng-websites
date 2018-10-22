import { Pipe, PipeTransform } from '@angular/core';
/*
 * Converts a number to 'bytes', 'KB', 'MB', 'GB', 'TB', or 'PB'.
 * Takes an precision argument that defaults to 1.
 * Usage:
 *   value | bytes:precesion
 * Example:
 *   {{ 2048 | bytes:10 }}
 *   formats to: 2kB
*/
@Pipe({ name: 'bytes' })
export class BytesPipe implements PipeTransform {
  transform(bytes: any, precision: number): string {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
      return '-';
    }

    if (typeof precision === 'undefined') {
      precision = 1;
    }

    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const exponent = Math.floor(Math.log(bytes) / Math.log(1024));

    return (bytes / Math.pow(1024, exponent)).toFixed(precision) + ' ' + units[exponent];
  }
}
