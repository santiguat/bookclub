import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { Club } from '@app/_models/club';
import { AccountService, AlertService } from '@app/_services';
import { ClubService } from '@app/_services/club.service';
import { ToastService } from '@app/_services/toast.service';
import { ApiResponse, PaginationResponse } from '@app/_shared';
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
  userClubs = [];
  currentPage = 1;
  total: number;
  isCollapsed: boolean;

  constructor(
    private accountService: AccountService,
    private clubService: ClubService,
    private scroller: ViewportScroller,
    private toastService: ToastService
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
    const subscriptionChange$ = isAlreadyFollowed
      ? this.clubService.unsubscribeUser(id)
      : this.clubService.subscribeUser(id);

    subscriptionChange$.subscribe(({ message }: ApiResponse) => {
      this.toastService.show(message, { delay: 3000 });
    });

    const clubIndex = this.clubs.map((c: Club) => c._id).indexOf(id);

    const scrollPosition = this.scroller.getScrollPosition();

    // update both club arrays
    if(this.clubs[clubIndex]) {
      this.clubs[clubIndex].isFollowed = !isAlreadyFollowed;
    } else {
      this.userClubs.filter((uc: Club) => uc._id !== id);
    }

    if (isAlreadyFollowed) {
      this.userClubs = this.userClubs.filter((c: Club) => c._id !== id);
    } else {
      this.userClubs.push(this.clubs.find((c: Club) => c._id === id));
    }

    // workaround to keep scroll fixed when mutating
    // this.clubs, after chaning follow state
    setTimeout(() => {
      this.scroller.scrollToPosition(scrollPosition);
    });
  }

  private getClubs(): void {
    forkJoin([
      this.clubService.getClubs(this.currentPage, 20),
      this.clubService.getClubsByUser(),
    ]).subscribe(
      ([{ data, totalRecords }, userClubs]: [
        PaginationResponse<Club[]>,
        Club[]
      ]) => {
        // Adding isFollowing prop to identify each
        data = this.parseClubs(data, userClubs);
        this.total = totalRecords;
        this.clubs = data;
        this.userClubs = this.parseClubs(userClubs, [], true);
      }
    );
  }

  private parseClubs(clubs: Club[], userClubs: Club[], isUserClub = false): Club[] {
    return clubs.map((club: Club) => ({
      ...club,
      isFollowed: isUserClub || !!userClubs.find((clubId: Club) => clubId._id === club._id),
    }));
  }
}
