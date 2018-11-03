import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventManagerService, Result } from 'core';
import { HideThrobberEvent, ShowThrobberEvent } from 'material-helpers';
import { EMPTY } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { Config } from '../domain/config';
import { ConfigQuery } from '../domain/config-query.service';
import { ConfigCommand } from '../domain/config-command.service';
import { ExpenseQuery } from '../domain/expense-query.service';

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
    private expenseQuery: ExpenseQuery,
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

    this.expenseQuery.execute(this.model.spreadsheetUrl)
      .subscribe(expenseQueryResult => {
        this.model.expenses = expenseQueryResult[0]['sum Amt'];
        this.currentLimit = this.model.currentLimit();
        console.log(this.model);
      });

    this.expenses = null;
  }

  onSubmit() {
    if (this.expenses === null || Number.isNaN(this.expenses) || this.expenses === 0) {
      return;
    }

    this.eventManagerService.raise(ShowThrobberEvent);

    this.model.expenses += this.expenses;

    this.configCommand.execute(this.model).pipe(
      switchMap(_ => this.configQuery.execute()),
      catchError(_ => this.onError(_)),
      finalize(() => this.eventManagerService.raise(HideThrobberEvent))
    ).subscribe(_ => this.onConfigQuery(_));
  }

  private onError(result: Result) {
    this.errors = result.errors;

    return EMPTY;
  }
}
