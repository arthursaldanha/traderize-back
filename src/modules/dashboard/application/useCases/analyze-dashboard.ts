/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { inject, injectable } from 'inversify';
import { Decimal } from '@prisma/client/runtime/library';

import { Journal } from '@/core/entities';
import { ioc } from '@/ioc';

dayjs.extend(duration);

// ==================== TYPES ====================
export interface TradeAnalysis {
  isWin: boolean;
  isLoss: boolean;
  isBreakeven: boolean;
  result: Decimal;
  duration: number;
  hasStrategy: boolean;
}

export interface NetPnLResult {
  total: Decimal;
  description: string;
}

export interface ProfitFactorResult {
  factor: number;
  grossProfit: Decimal;
  grossLoss: Decimal;
  description: string;
}

export interface WinRateResult {
  winPercentage: number;
  lossPercentage: number;
  breakevenPercentage: number;
  winCount: number;
  lossCount: number;
  breakevenCount: number;
  totalTrades: number;
}

export interface AvgTradeResult {
  avgWin: Decimal;
  avgLoss: Decimal;
  avgTrade: Decimal;
  avgDuration: number;
  avgDurationFormatted: string;
}

export interface AccountBalanceResult {
  totalPnL: Decimal;
  totalCommissions: Decimal;
  totalSwaps: Decimal;
  totalFees: Decimal;
  netBalance: Decimal;
}

export interface RadarMetrics {
  consistency: number; // 0-100 baseado na regularidade dos resultados
  operational: number; // 0-100 baseado na % de trades com estratégia
  profitFactor: number; // 0-100 normalizado do profit factor
  winRate: number; // 0-100 da win rate
  riskManagement: number; // 0-100 baseado no uso de stops
  discipline: number; // 0-100 baseado na aderência às estratégias
}

export interface DailyTradeCount {
  date: string;
  count: number;
  pnl: Decimal;
}

export interface CapitalEvolution {
  date: string;
  balance: Decimal;
  cumulativePnL: Decimal;
}

export interface DashboardAnalyticsResult {
  netPnL: NetPnLResult;
  profitFactor: ProfitFactorResult;
  winRate: WinRateResult;
  avgTrades: AvgTradeResult;
  accountBalance: AccountBalanceResult;
  radarMetrics: RadarMetrics;
  recentClosedTrades: Journal[];
  recentOpenTrades: Journal[];
  dailyTradeCount: DailyTradeCount[];
  capitalEvolution?: CapitalEvolution[];
  drawdown: {
    maxDrawdown: Decimal;
    currentDrawdown: Decimal;
    maxDrawdownPercentage: number;
  };
}

// Interface para dados agregados em uma única passada
interface AggregatedData {
  // Totais
  totalPnL: Decimal;
  totalCommissions: Decimal;
  totalSwaps: Decimal;
  totalFees: Decimal;
  netBalance: Decimal;

  // Análises de trades
  analyses: TradeAnalysis[];

  // Contadores
  winCount: number;
  lossCount: number;
  breakevenCount: number;
  totalTrades: number;
  tradesWithStrategy: number;
  tradesWithStop: number;

  // Somas para médias
  grossProfit: Decimal;
  grossLoss: Decimal;
  totalWinAmount: Decimal;
  totalLossAmount: Decimal;
  totalDuration: number;

  // Para consistência
  resultNumbers: number[];

  // Daily data
  dailyMap: Map<string, { count: number; pnl: Decimal }>;
}

@injectable()
export class DashboardCalculator {
  private analyzeBreakevenTrade(journal: Journal): boolean {
    const details = journal.detailsMetaTrader5 || [];
    const exitDetail = details.find((d) => d.entry === 'OUT');

    if (!exitDetail || exitDetail.reason !== 'STOP_LOSS') {
      return false;
    }

    const entryPrice = journal.entryPrice;
    const stopPrice = exitDetail.stopPrice;
    const direction = journal.direction;

    if (direction === 'BUY') {
      return stopPrice.gt(entryPrice);
    } else {
      return stopPrice.lt(entryPrice);
    }
  }

  private analyzeIndividualTrade(journal: Journal): TradeAnalysis {
    const result = journal.total || new Decimal(0);
    const isBreakeven = this.analyzeBreakevenTrade(journal);

    return {
      isWin: !isBreakeven && result.gt(0),
      isLoss: !isBreakeven && result.lt(0),
      isBreakeven,
      result,
      duration: journal.tradeDuration || 0,
      hasStrategy: !!journal.getStrategies().length,
    };
  }

  // Método principal que agrega todos os dados em uma única passada O(n)
  private aggregateData(journals: Journal[]): AggregatedData {
    const data: AggregatedData = {
      totalPnL: new Decimal(0),
      totalCommissions: new Decimal(0),
      totalSwaps: new Decimal(0),
      totalFees: new Decimal(0),
      netBalance: new Decimal(0),
      analyses: [],
      winCount: 0,
      lossCount: 0,
      breakevenCount: 0,
      totalTrades: 0,
      tradesWithStrategy: 0,
      tradesWithStop: 0,
      grossProfit: new Decimal(0),
      grossLoss: new Decimal(0),
      totalWinAmount: new Decimal(0),
      totalLossAmount: new Decimal(0),
      totalDuration: 0,
      resultNumbers: [],
      dailyMap: new Map(),
    };

    for (const journal of journals) {
      // Análise do trade
      const analysis = this.analyzeIndividualTrade(journal);
      data.analyses.push(analysis);

      // Contadores básicos
      data.totalTrades++;
      if (analysis.isWin) data.winCount++;
      else if (analysis.isLoss) data.lossCount++;
      else if (analysis.isBreakeven) data.breakevenCount++;

      // Strategy e Stop
      if (analysis.hasStrategy) data.tradesWithStrategy++;
      if (journal.stopPrice && journal.stopPrice.gt(0)) data.tradesWithStop++;

      // Valores financeiros
      data.totalPnL = data.totalPnL.add(journal.result || new Decimal(0));
      data.totalCommissions = data.totalCommissions.add(
        journal.commission || new Decimal(0),
      );
      data.totalSwaps = data.totalSwaps.add(journal.swap || new Decimal(0));
      data.totalFees = data.totalFees.add(journal.fee || new Decimal(0));

      // Profit/Loss para profit factor e médias
      if (analysis.isWin) {
        data.grossProfit = data.grossProfit.add(analysis.result);
        data.totalWinAmount = data.totalWinAmount.add(analysis.result);
      } else if (analysis.isLoss) {
        data.grossLoss = data.grossLoss.add(analysis.result.abs());
        data.totalLossAmount = data.totalLossAmount.add(analysis.result);
      }

      // Duração
      data.totalDuration += analysis.duration;

      // Para consistência (radar metrics)
      data.resultNumbers.push(analysis.result.toNumber());

      // Daily data
      const adjustedDate = dayjs(journal.timeDateStart).subtract(3, 'hours');
      const dateKey = adjustedDate.format('YYYY-MM-DD');
      const existing = data.dailyMap.get(dateKey) || {
        count: 0,
        pnl: new Decimal(0),
      };
      existing.count += 1;
      existing.pnl = existing.pnl.add(journal.total || new Decimal(0));
      data.dailyMap.set(dateKey, existing);
    }

    // Calcular net balance
    data.netBalance = data.totalPnL
      .add(data.totalCommissions)
      .add(data.totalSwaps)
      .add(data.totalFees);

    return data;
  }

  // Métodos que agora usam dados pré-agregados
  calculateNetPnL(aggregatedData: AggregatedData): NetPnLResult {
    return {
      total: aggregatedData.netBalance,
      description:
        'Net P&L representa o lucro ou prejuízo líquido total de todas as operações, considerando comissões, swaps e taxas. É o resultado final real das suas operações.',
    };
  }

  calculateProfitFactor(aggregatedData: AggregatedData): ProfitFactorResult {
    const { grossProfit, grossLoss } = aggregatedData;

    const factor = grossLoss.eq(0)
      ? grossProfit.gt(0)
        ? 999
        : 0
      : grossProfit.div(grossLoss).toNumber();

    return {
      factor,
      grossProfit,
      grossLoss,
      description:
        'Profit Factor é a relação entre lucros brutos e perdas brutas. Valores acima de 1.0 indicam rentabilidade.',
    };
  }

  calculateWinRate(aggregatedData: AggregatedData): WinRateResult {
    const { winCount, lossCount, breakevenCount, totalTrades } = aggregatedData;

    return {
      winPercentage: totalTrades > 0 ? (winCount / totalTrades) * 100 : 0,
      lossPercentage: totalTrades > 0 ? (lossCount / totalTrades) * 100 : 0,
      breakevenPercentage:
        totalTrades > 0 ? (breakevenCount / totalTrades) * 100 : 0,
      winCount,
      lossCount,
      breakevenCount,
      totalTrades,
    };
  }

  calculateAvgTrades(aggregatedData: AggregatedData): AvgTradeResult {
    const {
      winCount,
      lossCount,
      totalWinAmount,
      totalLossAmount,
      totalTrades,
      totalDuration,
      analyses,
    } = aggregatedData;

    const avgWin = winCount > 0 ? totalWinAmount.div(winCount) : new Decimal(0);
    const avgLoss =
      lossCount > 0 ? totalLossAmount.div(lossCount) : new Decimal(0);

    const avgTrade =
      totalTrades > 0
        ? analyses
            .reduce((acc, a) => acc.add(a.result), new Decimal(0))
            .div(totalTrades)
        : new Decimal(0);

    const avgDurationMs = totalTrades > 0 ? totalDuration / totalTrades : 0;
    const avgDurationFormatted = this.formatDuration(avgDurationMs);

    return {
      avgWin,
      avgLoss,
      avgTrade,
      avgDuration: avgDurationMs,
      avgDurationFormatted,
    };
  }

  calculateAccountBalance(
    aggregatedData: AggregatedData,
  ): AccountBalanceResult {
    return {
      totalPnL: aggregatedData.totalPnL,
      totalCommissions: aggregatedData.totalCommissions,
      totalSwaps: aggregatedData.totalSwaps,
      totalFees: aggregatedData.totalFees,
      netBalance: aggregatedData.netBalance,
    };
  }

  calculateRadarMetrics(
    aggregatedData: AggregatedData,
    journals: Journal[],
  ): RadarMetrics {
    const {
      winCount,
      totalTrades,
      tradesWithStrategy,
      tradesWithStop,
      resultNumbers,
    } = aggregatedData;

    const profitFactor = this.calculateProfitFactor(aggregatedData);

    // Consistência: baseada na variação dos resultados
    const avgResult =
      resultNumbers.reduce((a, b) => a + b, 0) / resultNumbers.length;
    const variance =
      resultNumbers.reduce((acc, r) => acc + Math.pow(r - avgResult, 2), 0) /
      resultNumbers.length;
    const consistency = Math.max(
      0,
      100 - (Math.sqrt(variance) / Math.abs(avgResult)) * 100,
    );

    // Operacional: % de trades com estratégia
    const operational =
      totalTrades > 0 ? (tradesWithStrategy / totalTrades) * 100 : 0;

    // Profit Factor normalizado (0-100)
    const profitFactorNormalized = Math.min(
      100,
      (profitFactor.factor / 3) * 100,
    );

    // Risk Management: % de trades que usaram stop loss
    const riskManagement =
      journals.length > 0 ? (tradesWithStop / journals.length) * 100 : 0;

    // Disciplina: trades com estratégia que deram resultado positivo
    const strategicWins = aggregatedData.analyses.filter(
      (a) => a.hasStrategy && a.isWin,
    ).length;
    const discipline =
      tradesWithStrategy > 0 ? (strategicWins / tradesWithStrategy) * 100 : 0;

    return {
      consistency: Math.round(consistency),
      operational: Math.round(operational),
      profitFactor: Math.round(profitFactorNormalized),
      winRate: Math.round((winCount / totalTrades) * 100),
      riskManagement: Math.round(riskManagement),
      discipline: Math.round(discipline),
    };
  }

  calculateDailyTradeCount(aggregatedData: AggregatedData): DailyTradeCount[] {
    return Array.from(aggregatedData.dailyMap.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        pnl: data.pnl,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Capital Evolution e Drawdown permanecem iguais pois precisam de ordenação temporal
  calculateCapitalEvolution(journals: Journal[]): CapitalEvolution[] {
    const sortedJournals = journals
      .filter((j) => j.timeDateEnd)
      .sort((a, b) => {
        const dateA = dayjs(a.timeDateEnd!).subtract(3, 'hours');
        const dateB = dayjs(b.timeDateEnd!).subtract(3, 'hours');
        return dateA.isBefore(dateB) ? -1 : 1;
      });

    const dailyMap = new Map<string, Decimal>();
    let cumulativePnL = new Decimal(0);

    for (const journal of sortedJournals) {
      const adjustedDate = dayjs(journal.timeDateEnd!).subtract(3, 'hours');
      const dateKey = adjustedDate.format('YYYY-MM-DD');

      cumulativePnL = cumulativePnL.add(journal.total || new Decimal(0));
      dailyMap.set(dateKey, cumulativePnL);
    }

    return Array.from(dailyMap.entries())
      .map(([date, cumulativePnL]) => ({
        date,
        balance: cumulativePnL,
        cumulativePnL,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  calculateDrawdown(journals: Journal[]) {
    const sortedJournals = journals
      .filter((j) => j.timeDateEnd)
      .sort((a, b) =>
        dayjs(a.timeDateEnd!).isBefore(dayjs(b.timeDateEnd!)) ? -1 : 1,
      );

    let runningBalance = new Decimal(0);
    let peak = new Decimal(0);
    let maxDrawdown = new Decimal(0);
    let currentDrawdown = new Decimal(0);

    for (const journal of sortedJournals) {
      runningBalance = runningBalance.add(journal.total || new Decimal(0));

      if (runningBalance.gt(peak)) {
        peak = runningBalance;
      }

      const drawdown = peak.sub(runningBalance);
      if (drawdown.gt(maxDrawdown)) {
        maxDrawdown = drawdown;
      }
    }

    currentDrawdown = peak.sub(runningBalance);
    const maxDrawdownPercentage = peak.gt(0)
      ? maxDrawdown.div(peak).mul(100).toNumber()
      : 0;

    return {
      maxDrawdown,
      currentDrawdown,
      maxDrawdownPercentage,
    };
  }

  private formatDuration(ms: number): string {
    const duration = dayjs.duration(ms);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}

@injectable()
export class AnalyzeDashboardDataUseCase {
  constructor(
    @inject(ioc.useCases.dashboardCalculator)
    private calculator: DashboardCalculator,
  ) {}

  execute(journals: Journal[], accountCount: number): DashboardAnalyticsResult {
    // Separar trades fechados e abertos
    const closedJournals = journals.filter((j) => j.status === 'CLOSED');
    const openJournals = journals.filter((j) => j.status === 'OPEN');

    // Agregação única dos dados O(n) em vez de múltiplos O(n)
    const aggregatedData = (this.calculator as any).aggregateData(
      closedJournals,
    );

    // Todos os cálculos agora são O(1) ou muito eficientes
    const netPnL = this.calculator.calculateNetPnL(aggregatedData);
    const profitFactor = this.calculator.calculateProfitFactor(aggregatedData);
    const winRate = this.calculator.calculateWinRate(aggregatedData);
    const avgTrades = this.calculator.calculateAvgTrades(aggregatedData);
    const accountBalance =
      this.calculator.calculateAccountBalance(aggregatedData);
    const radarMetrics = this.calculator.calculateRadarMetrics(
      aggregatedData,
      journals,
    );
    const dailyTradeCount =
      this.calculator.calculateDailyTradeCount(aggregatedData);
    const drawdown = this.calculator.calculateDrawdown(closedJournals);

    // Trades recentes - otimizado com slice após sort
    const recentClosedTrades = closedJournals
      .sort((a, b) =>
        dayjs(b.timeDateEnd!).isBefore(dayjs(a.timeDateEnd!)) ? -1 : 1,
      )
      .slice(0, 10);

    const recentOpenTrades = openJournals
      .sort((a, b) =>
        dayjs(b.timeDateStart).isBefore(dayjs(a.timeDateStart)) ? -1 : 1,
      )
      .slice(0, 10);

    // Capital evolution só para uma conta
    const capitalEvolution =
      accountCount === 1
        ? this.calculator.calculateCapitalEvolution(closedJournals)
        : undefined;

    return {
      netPnL,
      profitFactor,
      winRate,
      avgTrades,
      accountBalance,
      radarMetrics,
      recentClosedTrades,
      recentOpenTrades,
      dailyTradeCount,
      capitalEvolution,
      drawdown,
    };
  }
}
