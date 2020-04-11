import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bookingStatus'
})
export class BookingStatusPipe implements PipeTransform {

  transform(value: string, args: 'inbound' | 'outbound'): string {
    let retStr = 'Order placed';
    if (value == 'review-by-sp' && args == 'inbound') retStr = 'Your concern required';
    if (value == 'review-by-sp' && args == 'outbound') retStr = 'Waiting for confirmation';
    if (value == 'review-by-payer' && args == 'inbound') retStr = 'Waiting for confirmation';
    if (value == 'review-by-payer' && args == 'outbound') retStr = 'Your concern required';
    if (value == 'reject-by-sp' && args == 'outbound') retStr = 'Booking cancelled by SP';
    if (value == 'cancel-by-py') retStr = 'Cancellation requested';
    if (value == 'cancel-acpt-by-sp') retStr = 'Cancellation accepted';
    if (value == 'reject-by-sp' && args == 'inbound') retStr = 'Cancelled';
    if (value == 'confirm-by-sp') retStr = 'Confirmed';
    if (value == 'confirmed') retStr = 'Confirmed';
    if (value == 'completed') retStr = 'Completed';
    // if (value == 'others') retStr = '';
    return retStr;
  }
}
