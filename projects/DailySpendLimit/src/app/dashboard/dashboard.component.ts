import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '@app/domain/config';
import { ConfigQuery } from '@app/domain/config-query.service';
import { ExpenseCommand } from '@app/domain/expense-command.service';
import { MonthlyExpenseQuery } from '@app/domain/monthly-expense-query.service';
import { EventManagerService, Result, AuthTokenService } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'mh-throbber';
import { EMPTY } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentLimit: number;
  errors: any;
  expenses: number;
  private model: Config;

  constructor(
    private authTokenService: AuthTokenService,
    private configQuery: ConfigQuery,
    private eventManagerService: EventManagerService,
    private expenseCommand: ExpenseCommand,
    private monthlyExpenseQuery: MonthlyExpenseQuery,
    private router: Router,
  ) { }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.configQuery.execute().pipe(
      switchMap(_ => this.onConfigQuery(_)),
      catchError(_ => this.onError(_)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe();
  }

  @HostListener('document:visibilitychange')
  onVisibilitychange() {
    if (document.hidden) {
      return;
    }

    if (String.isNullOrWhitespace(this.authTokenService.getAuthToken())) {
      this.router.navigate(['sign-in'], { replaceUrl: true });
    } else {
      this.ngOnInit();
    }
  }

  private onConfigQuery(configQueryResult: Config) {
    if (this.notSetup(configQueryResult)) {
      return this.goToSetup();
    }

    this.model = configQueryResult;
    this.model.expenses = 0;
    this.currentLimit = this.model.currentLimit();

    return this.getMonthlyExpenses();
  }

  private notSetup(configQueryResult: Config) {
    return configQueryResult.dailyLimit === 0 || configQueryResult.effectiveFrom === null;
  }

  private goToSetup() {
    this.router.navigate(['setup']);
    return EMPTY;
  }

  private getMonthlyExpenses() {
    return this.monthlyExpenseQuery.execute(this.model.spreadsheetUrl).pipe(
      tap((queryResult: any[]) => this.model.expenses = queryResult.length === 0 ? 0 : queryResult[0].monthlyAmt),
      tap(_ => this.currentLimit = this.model.currentLimit())
    );
  }

  onSubmit() {
    if (this.expenses === null || Number.isNaN(this.expenses) || this.expenses === 0) {
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.expenseCommand.execute(this.expenses).pipe(
      tap(_ => this.expenses = null),
      switchMap(_ => this.getMonthlyExpenses()),
      catchError(_ => this.onError(_)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe();
  }

  private onError(result: Result) {
    this.errors = result.errors;

    return EMPTY;
  }
}
