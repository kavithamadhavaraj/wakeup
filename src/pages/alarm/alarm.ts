import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams} from 'ionic-angular';

/**
 * Generated class for the AlarmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html',
})
export class AlarmPage {

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
  }

  ionViewWillLoad() {
    console.log(this.navParams.get("place"));
  }    

  closeModal(){
    this.viewCtrl.dismiss();
  }
  
}
