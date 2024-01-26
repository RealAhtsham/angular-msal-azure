import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  constructor(private _profileService: ProfileService) { }

  profileData: any = {};

  ngOnInit() {
    this._profileService.getProfile().subscribe(data => {
      this.profileData = data;
    })
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
