import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports: [ReactiveFormsModule]
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Initialize search field from URL query params
    this.route.queryParams.subscribe((params) => {
      if (params['search']) {
        this.searchControl.setValue(params['search'], { emitEvent: false });
      }
    });

    // Listen to input changes with debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged()) // Debounce to limit updates
      .subscribe((value) => {
        this.updateQueryParams(value);
      });
  }

  updateQueryParams(searchTerm: string | null | undefined) {
    this.router.navigate([], {
      queryParams: searchTerm ? { search: searchTerm } : { search: undefined }, // ✅ Removes search if undefined/null/empty
      queryParamsHandling: 'merge',
    });
  }
}
