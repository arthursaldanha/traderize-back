import dayjs from 'dayjs';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Decimal } from '@prisma/client/runtime/library';

import { ioc } from '@/ioc';
import { CustomError } from '@/errors';
import { IJournalRepository } from '@/repositories/journal';
import { IAccountRepository } from '@/repositories/account';
import { IJournalDetailMT5Repository } from '@/repositories/journal-detail-mt5';
import { UpsertupsertJournalAutoDTO } from '@/modules/webhook/application/DTOs';
import { Journal, JournalDetailMT5 } from '@/core/entities';

@injectable()
export class UpsertJournalByExternalTradeIdService {
  constructor(
    @inject(ioc.repositories.accountRepository)
    private accountRepository: IAccountRepository,

    @inject(ioc.repositories.journalRepository)
    private journalRepository: IJournalRepository,

    @inject(ioc.repositories.journalDetailMt5Repository)
    private journalDetailMt5Repository: IJournalDetailMT5Repository,
  ) {}

  async execute({
    userId,
    accountId,
    data,
  }: {
    userId: string;
    accountId: string;
    data: UpsertupsertJournalAutoDTO;
  }) {
    const account = await this.accountRepository.findByUserIdAndExternalId({
      userId,
      externalId: accountId,
    });

    if (!account) {
      throw new CustomError({
        message: `Esta conta com o ID ${accountId} não foi encontrada.`,
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const filtered = data.filter(
      (deal) => deal.symbol && deal.symbol.trim() !== '',
    );

    const existingTickets = new Set(
      filtered.map((d) => d.positionId).map(String),
    );

    const existentJournalsWithDetails =
      await this.journalRepository.listByAccountIdAndExternalTradeIds({
        accountId: account.id.getValue(),
        externalTradeIds: Array.from(existingTickets),
      });

    const allExistingTickets = new Set<string>();
    existentJournalsWithDetails?.forEach((journal) => {
      journal.detailsMetaTrader5?.forEach((detail) => {
        allExistingTickets.add(detail.ticket);
      });
    });

    const grouped = new Map<string, typeof data>();

    for (const deal of filtered) {
      const group = grouped.get(deal.positionId) ?? [];
      group.push(deal);
      grouped.set(deal.positionId, group);
    }

    const journalsToCreate: Journal[] = [];
    const journalsToUpdate: Journal[] = [];
    const allDetailsToCreate: JournalDetailMT5[] = [];

    for (const [positionId, deals] of grouped.entries()) {
      const existentJournal = existentJournalsWithDetails
        ? existentJournalsWithDetails.find(
            (j) => j.externalTradeId === positionId.toString(),
          )
        : null;

      const sortedDetails = [...deals].sort((a, b) => {
        if (a.entry === 'IN') return -1;
        if (b.entry === 'IN') return 1;
        return 0;
      });

      const entry = sortedDetails.find((d) => d.entry === 'IN');
      const exit = sortedDetails.find((d) => d.entry !== 'IN');

      if (!entry) continue;

      const symbol = entry.symbol;
      const direction = entry.type;
      const lots = new Decimal(entry.lots);
      const entryPrice = new Decimal(entry.entryPrice);
      const stopPrice = new Decimal(entry.stopPrice);
      const takePrices = [entry.takePrice];
      const investment = new Decimal(entry.investment ?? 0);
      const riskRewardRatio = entry.riskRewardRatio;
      const fee = new Decimal(exit?.fee ?? 0);
      const swap = new Decimal(exit?.swap ?? 0);
      const commission = new Decimal(entry.commission);
      const result = new Decimal(exit?.result ?? 0);
      const total = [result, commission, swap, fee]
        .map((v) => new Decimal(v ?? 0))
        .reduce((acc, cur) => acc.add(cur), new Decimal(0));
      const timeDateStart = dayjs(entry.time, 'YYYY.MM.DD HH:mm:ss').toDate();
      const timeDateEnd = exit
        ? dayjs(exit.time, 'YYYY.MM.DD HH:mm:ss').toDate()
        : undefined;
      const tradeDuration = timeDateEnd
        ? timeDateEnd.getTime() - timeDateStart.getTime()
        : 0;

      let status: 'OPEN' | 'CLOSED' = 'OPEN';
      if (exit) status = 'CLOSED';

      const newDealsToCreate = sortedDetails.filter(
        (deal) => !allExistingTickets.has(deal.ticket),
      );

      const detailsInEntityToCreate = newDealsToCreate.map((sd) =>
        JournalDetailMT5.create({
          accountId: account.id.getValue(),
          externalTradeId: sd.positionId.toString(),
          ticket: sd.ticket,
          symbol: sd.symbol,
          comment: sd.comment,
          lots: sd.lots,
          entryPrice: sd.entryPrice,
          stopPrice: sd.stopPrice,
          takePrice: sd.takePrice,
          investment: sd.investment ?? 0,
          riskRewardRatio: sd.riskRewardRatio ?? 0,
          result: sd.result,
          commission: sd.commission,
          swap: sd.swap,
          fee: sd.fee,
          time: sd.time,
          type: sd.type,
          entry: sd.entry,
          reason: sd.reason,
          orderId: sd.orderId,
          positionId: sd.positionId,
          magic: sd.magic,
        }),
      );

      allDetailsToCreate.push(...detailsInEntityToCreate);

      if (!existentJournal) {
        const journalToCreate = Journal.create({
          accountId: account.id.getValue(),
          externalTradeId: positionId.toString(),
          symbol,
          direction,
          status: status,
          lots,
          entryPrice,
          stopPrice,
          takePrices,
          investment,
          riskRewardRatio,
          fee,
          swap,
          commission,
          result,
          total,
          imageUrls: [],
          timeDateStart,
          timeDateEnd,
          tradeDuration,
        });
        journalsToCreate.push(journalToCreate);
      } else {
        const imageUrls = existentJournal.imageUrls || [];
        const notes = existentJournal.notes || '';
        const strategyId = existentJournal.getStrategyId()?.getValue();

        const journalToUpdate = Journal.restore({
          id: existentJournal.id.getValue(),
          accountId: existentJournal.accountId.getValue(),
          externalTradeId: existentJournal.externalTradeId,
          strategyId,
          symbol,
          direction,
          status,
          lots,
          entryPrice,
          stopPrice,
          takePrices,
          investment,
          riskRewardRatio,
          fee,
          swap,
          commission,
          result,
          total,
          imageUrls,
          notes,
          timeDateStart,
          timeDateEnd,
          tradeDuration,
        });
        journalsToUpdate.push(journalToUpdate);
      }
    }

    await this.journalRepository.createMany(journalsToCreate);
    await this.journalDetailMt5Repository.createMany(allDetailsToCreate);
    await this.journalRepository.updateMany(journalsToUpdate);
  }
}
