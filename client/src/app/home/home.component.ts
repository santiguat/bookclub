import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { Club } from '@app/_models/club';
import { AccountService, AlertService } from '@app/_services';
import { ClubService } from '@app/_services/club.service';
import { ApiResponse } from '@app/_shared';
import { forkJoin, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: User;
  clubs$: Observable<Club[]>;
  clubs = [];
  currentPage = 1;

  constructor(
    private accountService: AccountService,
    private clubService: ClubService,
    private scroller: ViewportScroller,
    private alertService: AlertService,
  ) {
    this.user = this.accountService.userValue;
  }

  ngOnInit(): void {
    this.getClubs();
  }

  logout() {
    this.accountService.logout();
  }

  onLoadMore() {
    this.currentPage = this.currentPage + 1;
    this.getClubs();
  }

  onFollowChange(id: string, isAlreadyFollowed: boolean) {
    if (isAlreadyFollowed) {
      this.clubService.unsubscribeUser(id).subscribe(({message}: ApiResponse) => {
         this.alertService.success(message, {autoClose: true});
      });
    } else {
      this.clubService.subscribeUser(id).subscribe(({message}: ApiResponse) => {
         this.alertService.success(message, {autoClose: true});
      });
    }

    const clubIndex = this.clubs.map((c: Club) => c._id).indexOf(id);

    const scrollPosition = this.scroller.getScrollPosition()
    this.clubs[clubIndex].isFollowed = !isAlreadyFollowed; 

    // workaround to keep scroll fixed when mutating
    // this.clubs, after chaning follow state
    setTimeout(() => {
        this.scroller.scrollToPosition(scrollPosition);
    });
  }

  private getClubs(): void {
    forkJoin([this.clubService.getClubs(this.currentPage, 15), this.clubService.getClubsByUser()])
      .subscribe(([clubs, userClubs]: [Club[], string[]]) => {
        this.clubs = clubs.map((club: Club) => ({
          ...club,
          isFollowed: !!userClubs.find(
            (clubId: string) => clubId === club._id
          ),
        }));
      });
  }
}
