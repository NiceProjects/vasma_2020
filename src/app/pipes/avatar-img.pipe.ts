import { Pipe, PipeTransform } from '@angular/core';
import { AppDefService } from '../services/app-def.service';

@Pipe({
  name: 'avatarImg'
})
export class AvatarImgPipe implements PipeTransform {
  constructor(
    private ads: AppDefService
  ) {}
  transform(url: any): any {
    return url || this.ads.appDefs.userAvatar;
  }

}
