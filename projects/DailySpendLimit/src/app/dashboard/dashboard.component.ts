import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { Config } from '../domain/config';
import { ConfigCommand } from '../domain/config-command.service';
import { ConfigQuery } from '../domain/config-query.service';
import { MonthlyExpenseQuery } from '../domain/monthly-expense-query.service';
import { ExpenseCommand } from '../domain/expense-command.service';

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
    private configCommand: ConfigCommand,
    private configQuery: ConfigQuery,
    private eventManagerService: EventManagerService,
    private monthlyExpenseQuery: MonthlyExpenseQuery,
    private expenseCommand: ExpenseCommand,
    private router: Router,
  ) { }

  ngOnInit() {
    this.eventManagerService.raise(ShowThrobberEvent);

    this.configQuery.execute().pipe(
      catchError(_ => this.onError(_)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onConfigQuery(_));
  }

  private onConfigQuery(configQueryResult: Config) {
    if (configQueryResult.dailyLimit === 0 || configQueryResult.effectiveFrom === null) {
      this.router.navigate(['setup']);
      return;
    }

    this.model = configQueryResult;

    this.monthlyExpenseQuery.execute(this.model.spreadsheetUrl)
      .subscribe((monthlyExpenseQuery: any[]) => this.onMonthlyExpenseQuery(monthlyExpenseQuery));

    this.expenses = null;
  }

  private onMonthlyExpenseQuery(queryResult: any[]) {
    this.model.expenses = queryResult.length === 0 ? 0 : queryResult[0].monthlyAmt;
    this.currentLimit = this.model.currentLimit();
  }

  onSubmit() {
    if (this.expenses === null || Number.isNaN(this.expenses) || this.expenses === 0) {
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.expenseCommand.execute(this.expenses).pipe(
      switchMap(_ => this.monthlyExpenseQuery.execute(this.model.spreadsheetUrl)),
      catchError(_ => this.onError(_)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe((monthlyExpenseQuery: any[]) => this.onMonthlyExpenseQuery(monthlyExpenseQuery));
  }

  private onError(result: Result) {
    this.errors = result.errors;

    return EMPTY;
  }
}
