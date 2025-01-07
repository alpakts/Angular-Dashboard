import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'dynamicMessage',
  standalone: true,
})
export class DynamicMessagePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    value: any,
    message: string,
    color: string,
    conditionFn: (value: any) => boolean
  ): SafeHtml {
    if (conditionFn(value)) {
      const styledMessage = `<span style="background: ${color};color:white;padding:5px;border-radius:5px;margin-left:5px; font-weight: bold;">${message}</span>`;
      return this.sanitizer.bypassSecurityTrustHtml(styledMessage);
    }
    return '';
  }
}
