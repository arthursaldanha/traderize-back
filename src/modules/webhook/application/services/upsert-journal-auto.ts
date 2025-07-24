import dayjs from 'dayjs';
import { inject, injectable } from 'inversify';

import { ioc } from '@/ioc';
import { IJournalRepository } from '@/repositories/journal';
import { UpsertupsertJournalAutoDTO } from '@/modules/webhook/application/DTOs';

@injectable()
export class UpsertJournalByExternalTradeIdService {
  constructor(
    @inject(ioc.repositories.journalRepository)
    private journalRepository: IJournalRepository,
  ) {}

  async execute(data: UpsertupsertJournalAutoDTO) {
    // const accountId = String(data[0]?.accountId);

    const filtered = data.filter(
      (deal) => deal.symbol && deal.symbol.trim() !== '',
    );

    const grouped = new Map<number, typeof data>();

    for (const deal of filtered) {
      const group = grouped.get(deal.positionId) ?? [];
      group.push(deal);
      grouped.set(deal.positionId, group);
    }

    const journals = [];

    for (const [positionId, deals] of grouped.entries()) {
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
      const lots = entry.lots;
      const entryPrice = entry.entryPrice;
      const stopPrice = exit ? exit.stopPrice : entry.stopPrice;
      const takePrices = exit ? exit.takePrice : entry.takePrice;
      const investment = entry.investment;
      const riskRewardRatio = entry.riskRewardRatio;
      const fee = exit?.fee ?? 0;
      const swap = exit?.swap ?? 0;
      const commission = entry.commission;
      const result = exit?.result ?? 0;
      const total =
        (result ?? 0) + (commission ?? 0) + (swap ?? 0) + (fee ?? 0);
      const timeDateStart = dayjs(entry.time, 'YYYY.MM.DD HH:mm:ss').toDate();
      const timeDateEnd = exit
        ? dayjs(exit.time, 'YYYY.MM.DD HH:mm:ss').toDate()
        : undefined;
      const tradeDuration = timeDateEnd
        ? timeDateEnd.getTime() - timeDateStart.getTime()
        : 0;

      journals.push({
        externalTradeId: positionId.toString(),
        symbol,
        direction,
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
        timeDateStart,
        timeDateEnd,
        tradeDuration,
        tradeDetails: sortedDetails,
      });
    }

    return journals;
  }
}
