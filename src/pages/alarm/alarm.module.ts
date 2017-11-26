import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlarmPage } from './alarm';

@NgModule({
  declarations: [
    AlarmPage,
  ],
  imports: [
    IonicPageModule.forChild(AlarmPage),
  ],
})
export class AlarmPageModule {}
