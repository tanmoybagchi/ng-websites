import { AnnouncementContent } from '@app/announcement/announcement';
import { RuleBuilder, RulesEngine } from 'core';
import { AdminAnnouncement } from './admin-announcement';

export class AdminAnnouncementApprovalRules {
  private readonly rulesEngine: RulesEngine;

  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const contentRules = RuleBuilder.for<AnnouncementContent>()
      .property(x => x.title).required('Please enter something.')
      .property(x => x.description).required('Please enter something.')
      .build();

    const dateMsg = 'Please enter a valid date today or in the future.';

    const rules = RuleBuilder.for<AdminAnnouncement>()
      .property(x => x.effectiveFrom).date(dateMsg).required(dateMsg).minDate(today, dateMsg)
      .property(x => x.effectiveTo).date(dateMsg).required(dateMsg).minDate(today, dateMsg)
      .property(x => x.content).object(contentRules)
      .build();

    this.rulesEngine = RulesEngine.create(rules);
  }

  check(model: AdminAnnouncement) {
    const res = this.rulesEngine.check(model);

    if (!res.hasErrors && model.effectiveTo.valueOf() < model.effectiveFrom.valueOf()) {
      res.addError('must be greater than Effective From', 'effectiveTo');
    }

    return res;
  }
}
