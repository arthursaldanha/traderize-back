// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';
// import { inject, injectable } from 'inversify';
// import { Decimal } from '@prisma/client/runtime/library';

// import { Journal } from '@/core/entities';
// import { ioc } from '@/ioc';

// dayjs.extend(duration);

// // ==================== TYPES ====================
// export interface TradeAnalysis {
//   isWin: boolean;
//   isLoss: boolean;
//   isBreakeven: boolean;
//   result: Decimal;
//   duration: number;
//   hasStrategy: boolean;
// }

// export interface NetPnLResult {
//   total: Decimal;
//   description: string;
// }

// export interface ProfitFactorResult {
//   factor: number;
//   grossProfit: Decimal;
//   grossLoss: Decimal;
//   description: string;
// }

// export interface WinRateResult {
//   winPercentage: number;
//   lossPercentage: number;
//   breakevenPercentage: number;
//   winCount: number;
//   lossCount: number;
//   breakevenCount: number;
//   totalTrades: number;
// }

// export interface AvgTradeResult {
//   avgWin: Decimal;
//   avgLoss: Decimal;
//   avgTrade: Decimal;
//   avgDuration: number;
//   avgDurationFormatted: string;
// }

// export interface AccountBalanceResult {
//   totalPnL: Decimal;
//   totalCommissions: Decimal;
//   totalSwaps: Decimal;
//   totalFees: Decimal;
//   netBalance: Decimal;
// }

// export interface RadarMetrics {
//   consistency: number; // 0-100 baseado na regularidade dos resultados
//   operational: number; // 0-100 baseado na % de trades com estratégia
//   profitFactor: number; // 0-100 normalizado do profit factor
//   winRate: number; // 0-100 da win rate
//   riskManagement: number; // 0-100 baseado no uso de stops
//   discipline: number; // 0-100 baseado na aderência às estratégias
// }

// export interface DailyTradeCount {
//   date: string;
//   count: number;
//   pnl: Decimal;
// }

// export interface CapitalEvolution {
//   date: string;
//   balance: Decimal;
//   cumulativePnL: Decimal;
// }

// export interface DashboardAnalyticsResult {
//   netPnL: NetPnLResult;
//   profitFactor: ProfitFactorResult;
//   winRate: WinRateResult;
//   avgTrades: AvgTradeResult;
//   accountBalance: AccountBalanceResult;
//   radarMetrics: RadarMetrics;
//   recentClosedTrades: Journal[];
//   recentOpenTrades: Journal[];
//   dailyTradeCount: DailyTradeCount[];
//   capitalEvolution?: CapitalEvolution[];
//   drawdown: {
//     maxDrawdown: Decimal;
//     currentDrawdown: Decimal;
//     maxDrawdownPercentage: number;
//   };
// }

// @injectable()
// export class DashboardCalculator {
//   private analyzeBreakevenTrade(journal: Journal): boolean {
//     const details = journal.detailsMetaTrader5 || [];
//     const exitDetail = details.find((d) => d.entry === 'OUT');

//     if (!exitDetail || exitDetail.reason !== 'STOP_LOSS') {
//       return false;
//     }

//     const entryPrice = journal.entryPrice;
//     const stopPrice = exitDetail.stopPrice;
//     const direction = journal.direction;

//     if (direction === 'BUY') {
//       return stopPrice.gt(entryPrice);
//     } else {
//       return stopPrice.lt(entryPrice);
//     }
//   }

//   private analyzeIndividualTrade(journal: Journal): TradeAnalysis {
//     const result = journal.total || new Decimal(0);
//     const isBreakeven = this.analyzeBreakevenTrade(journal);

//     return {
//       isWin: !isBreakeven && result.gt(0),
//       isLoss: !isBreakeven && result.lt(0),
//       isBreakeven,
//       result,
//       duration: journal.tradeDuration || 0,
//       hasStrategy: !!journal.getStrategyId(),
//     };
//   }

//   // 1. Net P&L
//   calculateNetPnL(journals: Journal[]): NetPnLResult {
//     const result = journals.reduce(
//       (acc, journal) => acc.add(journal.result || new Decimal(0)),
//       new Decimal(0),
//     );
//     const commission = journals.reduce(
//       (acc, journal) => acc.add(journal.commission || new Decimal(0)),
//       new Decimal(0),
//     );
//     const total = result.add(commission);

//     return {
//       total,
//       description:
//         'Net P&L representa o lucro ou prejuízo líquido total de todas as operações, considerando comissões, swaps e taxas. É o resultado final real das suas operações.',
//     };
//   }

//   // 2. Profit Factor
//   calculateProfitFactor(journals: Journal[]): ProfitFactorResult {
//     let grossProfit = new Decimal(0);
//     let grossLoss = new Decimal(0);

//     journals.forEach((journal) => {
//       const analysis = this.analyzeIndividualTrade(journal);
//       if (analysis.isWin) {
//         grossProfit = grossProfit.add(analysis.result);
//       } else if (analysis.isLoss) {
//         grossLoss = grossLoss.add(analysis.result.abs());
//       }
//     });

//     const factor = grossLoss.eq(0)
//       ? grossProfit.gt(0)
//         ? 999
//         : 0
//       : grossProfit.div(grossLoss).toNumber();

//     return {
//       factor,
//       grossProfit,
//       grossLoss,
//       description:
//         'Profit Factor é a relação entre lucros brutos e perdas brutas. Valores acima de 1.0 indicam rentabilidade.',
//     };
//   }

//   // 3. Win Rate
//   calculateWinRate(journals: Journal[]): WinRateResult {
//     const analyses = journals.map((j) => this.analyzeIndividualTrade(j));

//     const winCount = analyses.filter((a) => a.isWin).length;
//     const lossCount = analyses.filter((a) => a.isLoss).length;
//     const breakevenCount = analyses.filter((a) => a.isBreakeven).length;
//     const totalTrades = analyses.length;

//     return {
//       winPercentage: totalTrades > 0 ? (winCount / totalTrades) * 100 : 0,
//       lossPercentage: totalTrades > 0 ? (lossCount / totalTrades) * 100 : 0,
//       breakevenPercentage:
//         totalTrades > 0 ? (breakevenCount / totalTrades) * 100 : 0,
//       winCount,
//       lossCount,
//       breakevenCount,
//       totalTrades,
//     };
//   }

//   // 4. Average Win/Loss
//   calculateAvgTrades(journals: Journal[]): AvgTradeResult {
//     const analyses = journals.map((j) => this.analyzeIndividualTrade(j));

//     const wins = analyses.filter((a) => a.isWin);
//     const losses = analyses.filter((a) => a.isLoss);

//     const avgWin =
//       wins.length > 0
//         ? wins
//             .reduce((acc, w) => acc.add(w.result), new Decimal(0))
//             .div(wins.length)
//         : new Decimal(0);

//     const avgLoss =
//       losses.length > 0
//         ? losses
//             .reduce((acc, l) => acc.add(l.result), new Decimal(0))
//             .div(losses.length)
//         : new Decimal(0);

//     const avgTrade =
//       analyses.length > 0
//         ? analyses
//             .reduce((acc, a) => acc.add(a.result), new Decimal(0))
//             .div(analyses.length)
//         : new Decimal(0);

//     const avgDurationMs =
//       analyses.length > 0
//         ? analyses.reduce((acc, a) => acc + a.duration, 0) / analyses.length
//         : 0;

//     const avgDurationFormatted = this.formatDuration(avgDurationMs);

//     return {
//       avgWin,
//       avgLoss,
//       avgTrade,
//       avgDuration: avgDurationMs,
//       avgDurationFormatted,
//     };
//   }

//   // 5. Account Balance
//   calculateAccountBalance(journals: Journal[]): AccountBalanceResult {
//     let totalPnL = new Decimal(0);
//     let totalCommissions = new Decimal(0);
//     let totalSwaps = new Decimal(0);
//     let totalFees = new Decimal(0);

//     journals.forEach((journal) => {
//       totalPnL = totalPnL.add(journal.result || new Decimal(0));
//       totalCommissions = totalCommissions.add(
//         journal.commission || new Decimal(0),
//       );
//       totalSwaps = totalSwaps.add(journal.swap || new Decimal(0));
//       totalFees = totalFees.add(journal.fee || new Decimal(0));
//     });

//     const netBalance = totalPnL
//       .add(totalCommissions)
//       .add(totalSwaps)
//       .add(totalFees);

//     return {
//       totalPnL,
//       totalCommissions,
//       totalSwaps,
//       totalFees,
//       netBalance,
//     };
//   }

//   // Radar Metrics
//   calculateRadarMetrics(journals: Journal[]): RadarMetrics {
//     const analyses = journals.map((j) => this.analyzeIndividualTrade(j));
//     const winRate = this.calculateWinRate(journals);
//     const profitFactor = this.calculateProfitFactor(journals);

//     // Consistência: baseada na variação dos resultados
//     const results = analyses.map((a) => a.result.toNumber());
//     const avgResult = results.reduce((a, b) => a + b, 0) / results.length;
//     const variance =
//       results.reduce((acc, r) => acc + Math.pow(r - avgResult, 2), 0) /
//       results.length;
//     const consistency = Math.max(
//       0,
//       100 - (Math.sqrt(variance) / Math.abs(avgResult)) * 100,
//     );

//     // Operacional: % de trades com estratégia
//     const operational =
//       analyses.length > 0
//         ? (analyses.filter((a) => a.hasStrategy).length / analyses.length) * 100
//         : 0;

//     // Profit Factor normalizado (0-100)
//     const profitFactorNormalized = Math.min(
//       100,
//       (profitFactor.factor / 3) * 100,
//     );

//     // Risk Management: % de trades que usaram stop loss
//     const tradesWithStop = journals.filter(
//       (j) => j.stopPrice && j.stopPrice.gt(0),
//     ).length;
//     const riskManagement =
//       journals.length > 0 ? (tradesWithStop / journals.length) * 100 : 0;

//     // Disciplina: trades com estratégia que deram resultado positivo
//     const strategicTrades = analyses.filter((a) => a.hasStrategy);
//     const strategicWins = strategicTrades.filter((a) => a.isWin).length;
//     const discipline =
//       strategicTrades.length > 0
//         ? (strategicWins / strategicTrades.length) * 100
//         : 0;

//     return {
//       consistency: Math.round(consistency),
//       operational: Math.round(operational),
//       profitFactor: Math.round(profitFactorNormalized),
//       winRate: Math.round(winRate.winPercentage),
//       riskManagement: Math.round(riskManagement),
//       discipline: Math.round(discipline),
//     };
//   }

//   // Daily Trade Count
//   calculateDailyTradeCount(journals: Journal[]): DailyTradeCount[] {
//     const dailyMap = new Map<string, { count: number; pnl: Decimal }>();

//     journals.forEach((journal) => {
//       // Subtrair 3 horas do timeDateStart
//       const adjustedDate = dayjs(journal.timeDateStart).subtract(3, 'hours');
//       const dateKey = adjustedDate.format('YYYY-MM-DD');

//       const existing = dailyMap.get(dateKey) || {
//         count: 0,
//         pnl: new Decimal(0),
//       };
//       existing.count += 1;
//       existing.pnl = existing.pnl.add(journal.total || new Decimal(0));

//       dailyMap.set(dateKey, existing);
//     });

//     return Array.from(dailyMap.entries())
//       .map(([date, data]) => ({
//         date,
//         count: data.count,
//         pnl: data.pnl,
//       }))
//       .sort((a, b) => a.date.localeCompare(b.date));
//   }

//   // Capital Evolution (só para uma conta)
//   calculateCapitalEvolution(journals: Journal[]): CapitalEvolution[] {
//     const sortedJournals = journals
//       .filter((j) => j.timeDateEnd) // Só trades fechados
//       .sort((a, b) => {
//         const dateA = dayjs(a.timeDateEnd!).subtract(3, 'hours');
//         const dateB = dayjs(b.timeDateEnd!).subtract(3, 'hours');
//         return dateA.isBefore(dateB) ? -1 : 1;
//       });

//     const dailyMap = new Map<string, Decimal>();
//     let cumulativePnL = new Decimal(0);

//     sortedJournals.forEach((journal) => {
//       const adjustedDate = dayjs(journal.timeDateEnd!).subtract(3, 'hours');
//       const dateKey = adjustedDate.format('YYYY-MM-DD');

//       cumulativePnL = cumulativePnL.add(journal.total || new Decimal(0));
//       dailyMap.set(dateKey, cumulativePnL);
//     });

//     return Array.from(dailyMap.entries())
//       .map(([date, cumulativePnL]) => ({
//         date,
//         balance: cumulativePnL, // Assumindo saldo inicial como 0
//         cumulativePnL,
//       }))
//       .sort((a, b) => a.date.localeCompare(b.date));
//   }

//   // Drawdown
//   calculateDrawdown(journals: Journal[]) {
//     const sortedJournals = journals
//       .filter((j) => j.timeDateEnd)
//       .sort((a, b) =>
//         dayjs(a.timeDateEnd!).isBefore(dayjs(b.timeDateEnd!)) ? -1 : 1,
//       );

//     let runningBalance = new Decimal(0);
//     let peak = new Decimal(0);
//     let maxDrawdown = new Decimal(0);
//     let currentDrawdown = new Decimal(0);

//     sortedJournals.forEach((journal) => {
//       runningBalance = runningBalance.add(journal.total || new Decimal(0));

//       if (runningBalance.gt(peak)) {
//         peak = runningBalance;
//       }

//       const drawdown = peak.sub(runningBalance);
//       if (drawdown.gt(maxDrawdown)) {
//         maxDrawdown = drawdown;
//       }
//     });

//     // Current drawdown é a diferença entre o último peak e saldo atual
//     currentDrawdown = peak.sub(runningBalance);

//     const maxDrawdownPercentage = peak.gt(0)
//       ? maxDrawdown.div(peak).mul(100).toNumber()
//       : 0;

//     return {
//       maxDrawdown,
//       currentDrawdown,
//       maxDrawdownPercentage,
//     };
//   }

//   private formatDuration(ms: number): string {
//     const duration = dayjs.duration(ms);
//     const days = Math.floor(duration.asDays());
//     const hours = duration.hours();
//     const minutes = duration.minutes();

//     if (days > 0) {
//       return `${days}d ${hours}h ${minutes}m`;
//     } else if (hours > 0) {
//       return `${hours}h ${minutes}m`;
//     } else {
//       return `${minutes}m`;
//     }
//   }
// }

// @injectable()
// export class AnalyzeDashboardDataUseCase {
//   constructor(
//     @inject(ioc.useCases.dashboardCalculator)
//     private calculator: DashboardCalculator,
//   ) {}

//   execute(journals: Journal[], accountCount: number): DashboardAnalyticsResult {
//     // Filtrar apenas trades fechados para a maioria dos cálculos
//     const closedJournals = journals.filter((j) => j.status === 'CLOSED');
//     const openJournals = journals.filter((j) => j.status === 'OPEN');

//     // Cálculos principais
//     const netPnL = this.calculator.calculateNetPnL(closedJournals);
//     const profitFactor = this.calculator.calculateProfitFactor(closedJournals);
//     const winRate = this.calculator.calculateWinRate(closedJournals);
//     const avgTrades = this.calculator.calculateAvgTrades(closedJournals);
//     const accountBalance = this.calculator.calculateAccountBalance(journals);
//     const radarMetrics = this.calculator.calculateRadarMetrics(closedJournals);
//     const dailyTradeCount =
//       this.calculator.calculateDailyTradeCount(closedJournals);
//     const drawdown = this.calculator.calculateDrawdown(closedJournals);

//     // 10 trades mais recentes (fechados e abertos)
//     const recentClosedTrades = closedJournals
//       .sort((a, b) =>
//         dayjs(b.timeDateEnd!).isBefore(dayjs(a.timeDateEnd!)) ? -1 : 1,
//       )
//       .slice(0, 10);

//     const recentOpenTrades = openJournals
//       .sort((a, b) =>
//         dayjs(b.timeDateStart).isBefore(dayjs(a.timeDateStart)) ? -1 : 1,
//       )
//       .slice(0, 10);

//     // Capital evolution só para uma conta
//     const capitalEvolution =
//       accountCount === 1
//         ? this.calculator.calculateCapitalEvolution(closedJournals)
//         : undefined;

//     return {
//       netPnL,
//       profitFactor,
//       winRate,
//       avgTrades,
//       accountBalance,
//       radarMetrics,
//       recentClosedTrades,
//       recentOpenTrades,
//       dailyTradeCount,
//       capitalEvolution,
//       drawdown,
//     };
//   }
// }
