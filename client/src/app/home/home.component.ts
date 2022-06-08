import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { Club } from '@app/_models/club';
import { AccountService } from '@app/_services';
import { ClubService } from '@app/_services/club.service';
import { Observable } from 'rxjs';

@Component({ templateUrl: 'home.component.html', styleUrls: ['home.component.scss'] })
export class HomeComponent implements OnInit {
    user: User;
    clubs$: Observable<Club[]>

    constructor(private accountService: AccountService, private clubService: ClubService) {
        this.user = this.accountService.userValue;
    }

    ngOnInit(): void {
        this.getClubs();
    }
    logout() {
        this.accountService.logout();
    }
    
    private getClubs() {
        this.clubs$ = this.clubService.getClubs();
    }
}