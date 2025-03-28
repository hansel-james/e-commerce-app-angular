import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports: [ReactiveFormsModule]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  private queryParamsSub!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // ✅ Always update search bar whenever queryParams change (not just once)
    this.queryParamsSub = this.route.queryParams.subscribe((params) => {
      const currentSearch = params['search'] || '';
      if (this.searchControl.value !== currentSearch) {
        this.searchControl.setValue(currentSearch, { emitEvent: false });
      }
    });

    // ✅ Listen to user input with debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.updateQueryParams(value);
      });
  }

  updateQueryParams(searchTerm: string | null | undefined) {
    this.router.navigate([], {
      queryParams: searchTerm ? { search: searchTerm, page: 1 } : { search: undefined, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy() {
    this.queryParamsSub?.unsubscribe();
  }
}