import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '@app/app.service';
import { I<%= classify(fileName) %> } from '../models/<%= dasherize(fileName) %>.model';
import { <%= classify(fileName) %>Service } from '../services/<%= dasherize(fileName) %>.service';
import { first } from 'rxjs/operators';
import { TableUtilityService } from '@app/shared/+utilities/services/table-utility.service';
import * as _ from 'lodash';
import { ActiveFilterStatusOptions } from '@app/shared/constants/active-filter-options.const';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-<%= dasherize(fileName) %>-list',
  templateUrl: './<%= dasherize(fileName) %>-list.component.html',
  styleUrls: ['./<%= dasherize(fileName) %>-list.component.scss']
})
export class <%= classify(fileName) %>ListComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject < boolean > = new ReplaySubject(1);

  loading: boolean;
  allItems: I<%= classify(fileName) %>[];
  displayedItems: I<%= classify(fileName) %>[];

  searchKeys = ['id'];
  perPage = 20;

  filterVal = '';
  currentPage = 1;

  totalItems: number;
  totalPages: number;

  sortByKey: string;
  sortDesc: boolean;

  filterStatusValue: boolean;
  filterStatusOptions = ActiveFilterStatusOptions;

  queryList: IFirestoreQueryParam[];

  constructor(private appService: AppService, private tableUtilityService: TableUtilityService, private <%= camelize(fileName) %>Service: <%= classify(fileName) %>Service) {
    this.appService.pageTitle = '<%= classify(fileName) %> List';
    this.loading = true;

    this.sortByKey = 'id';
    this.sortDesc = false;

    this.filterStatusValue = true;
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


  /**
   * Build query and search collection for results
   */
  loadData() {
    this.buildQuery();

    this.<%= camelize(fileName) %> Service.query(this.queryList).pipe(takeUntil(this.destroyed$)).subscribe(
      (items) => {
        this.allItems = items;

        this.update();
      }
    );
  }

  /**
   * Apply all table operations for filter, sorting, and paging.
   */
  update() {
    this.displayedItems = this.tableUtilityService.applyAllUpdates(this.allItems, this.filterVal, this.searchKeys, this.sortByKey, this.sortDesc, this.perPage, this.currentPage);

    this.totalItems = this.allItems.length;
    this.totalPages = this.tableUtilityService.getTotalPages(this.totalItems, this.perPage);
    this.loading = false;

  }

  /**
   * Archive a record by setting the isActive bool to false
   */
  onArchive(item: I<%= classify(fileName) %>) {
    const itemIndex = _.findIndex(this.allItems, item);

    if (itemIndex > -1) {
      item.isActive = false;
      this.<%= camelize(fileName) %>Service.update(item.id, item).then(
        () => {
          this.allItems[itemIndex] = item;
          this.update();
        }
      );
    }
  }

  /**
   * Recover an archived record by setting the isActive bool to true
   */
  onRecover(item: I<%= classify(fileName) %>) {
    const itemIndex = _.findIndex(this.allItems, item);

    if (itemIndex > -1) {
      item.isActive = true;
      this.<%= camelize(fileName) %>Service.update(item.id, item).then(
        () => {
          this.allItems[itemIndex] = item;
          this.update();
        }
      );
    }
  }

  //#region Private Fx

  /**
   * Conditionally check for applied query parameters and include in
   * firestore query.
   * ! Note all included params are AND not OR
   */
  private buildQuery(): void {
    this.queryList = [
      { field: 'isActive', operator: '==', value: this.filterStatusValue }
    ]
  }
  //#endregion


}
