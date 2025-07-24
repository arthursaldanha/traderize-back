#property script_show_inputs
#property strict

string DealTypeToString(long type) {
  switch (type) {
  case 0:
    return "BUY";
  case 1:
    return "SELL";
  case 2:
    return "BALANCE";
  case 3:
    return "CREDIT";
  case 4:
    return "ADDITIONAL_CHARGE";
  case 5:
    return "CORRECTION";
  case 6:
    return "BONUS";
  case 7:
    return "COMMISSION";
  case 8:
    return "COMMISSION_DAILY";
  case 9:
    return "COMMISSION_MONTHLY";
  case 10:
    return "AGENT_DAILY";
  case 11:
    return "AGENT_MONTHLY";
  case 12:
    return "INTEREST";
  case 13:
    return "BUY_CANCELED";
  case 14:
    return "SELL_CANCELED";
  case 15:
    return "DIVIDEND";
  case 16:
    return "DIVIDEND_FRANKED";
  case 17:
    return "TAX";
  default:
    return "UNKNOWN";
  }
}

string DealEntryToString(long entry) {
  switch (entry) {
  case 0:
    return "IN";
  case 1:
    return "OUT";
  case 2:
    return "INOUT";
  case 3:
    return "OUT_BY";
  default:
    return "UNKNOWN";
  }
}

string DealReasonToString(long reason) {
  switch (reason) {
  case 0:
    return "CLIENT";
  case 1:
    return "EXPERT";
  case 2:
    return "WEB";
  case 3:
    return "MOBILE";
  case 4:
    return "STOP_LOSS";
  case 5:
    return "TAKE_PROFIT";
  case 6:
    return "STOP_OUT";
  case 7:
    return "ROLLOVER";
  case 8:
    return "VMARGIN";
  case 9:
    return "SPLIT";
  case 10:
    return "CORPORATE_ACTION";
  default:
    return "UNKNOWN";
  }
}

void OnStart() {
  const string url =
      "https://webhook.site/d634ece9-ebeb-45a2-8235-a4977277c48f";
  string headers = "Content-Type: application/json\r\n";

  datetime from = D '2010.01.01 00:00:00';
  datetime to = TimeCurrent();

  if (!HistorySelect(from, to)) {
    Print("❌ Erro ao selecionar histórico.");
    return;
  }

  int totalDeals = HistoryDealsTotal();
  PrintFormat("📊 Total de deals encontrados: %d", totalDeals);

  string json = "[";

  for (int i = 0; i < totalDeals; i++) {
    ulong ticket = HistoryDealGetTicket(i);
    if (ticket == 0)
      continue;

    string symbol = HistoryDealGetString(ticket, DEAL_SYMBOL);
    string comment = HistoryDealGetString(ticket, DEAL_COMMENT);
    double volume = HistoryDealGetDouble(ticket, DEAL_VOLUME);
    double price = HistoryDealGetDouble(ticket, DEAL_PRICE);
    double profit = HistoryDealGetDouble(ticket, DEAL_PROFIT);
    double stopLoss = HistoryDealGetDouble(ticket, DEAL_SL);
    double takeProfit = HistoryDealGetDouble(ticket, DEAL_TP);
    double commission = HistoryDealGetDouble(ticket, DEAL_COMMISSION);
    double swap = HistoryDealGetDouble(ticket, DEAL_SWAP);
    double fee = HistoryDealGetDouble(ticket, DEAL_FEE);
    datetime time = (datetime)HistoryDealGetInteger(ticket, DEAL_TIME);
    long type = HistoryDealGetInteger(ticket, DEAL_TYPE);
    long entry = HistoryDealGetInteger(ticket, DEAL_ENTRY);
    long reason = HistoryDealGetInteger(ticket, DEAL_REASON);
    ulong orderId = (ulong)HistoryDealGetInteger(ticket, DEAL_ORDER);
    ulong positionId = (ulong)HistoryDealGetInteger(ticket, DEAL_POSITION_ID);
    long magic = HistoryDealGetInteger(ticket, DEAL_MAGIC);

    double contractSize = 0;
    if (!SymbolInfoDouble(symbol, SYMBOL_TRADE_CONTRACT_SIZE, contractSize)) {
      contractSize = 100000;
    }

    double slDiff = MathAbs(price - stopLoss);
    double tpDiff = MathAbs(takeProfit - price);
    double investment = 0.0;
    double riskRewardRatio = 0.0;

    if (entry == DEAL_ENTRY_IN) {
      double contractSize = 0;
      if (!SymbolInfoDouble(symbol, SYMBOL_TRADE_CONTRACT_SIZE, contractSize) ||
          contractSize <= 0) {
        contractSize = 100000; // fallback padrão Forex
      }

      double rawInvestment = slDiff * volume * contractSize;
      investment = rawInvestment;

      // Ajusta para pares com JPY na cotação (ex: USDJPY)
      if (StringFind(symbol, "JPY") == 3) { // ex: "USDJPY"
        double rate = 0;
        if (SymbolInfoDouble(symbol, SYMBOL_BID, rate) && rate > 0) {
          investment = rawInvestment / rate;
        }
      }

      riskRewardRatio = slDiff > 0 ? tpDiff / slDiff : 0;
    }

    string dealJson = StringFormat(
        "{" + "\"ticket\":%I64u," + "\"symbol\":\"%s\"," +
            "\"comment\":\"%s\"," + "\"volume\":%.2f," + "\"price\":%.5f," +
            "\"stopLoss\":%.5f," + "\"takeProfit\":%.5f," +
            "\"investment\":%.2f," + "\"riskRewardRatio\":%.2f," +
            "\"profit\":%.2f," + "\"commission\":%.2f," + "\"swap\":%.2f," +
            "\"fee\":%.2f," + "\"time\":\"%s\"," + "\"type\":\"%s\"," +
            "\"entry\":\"%s\"," + "\"reason\":\"%s\"," + "\"orderId\":%I64u," +
            "\"positionId\":%I64u," + "\"magic\":%d" + "}",
        ticket, symbol, comment, volume, price, stopLoss, takeProfit,
        investment, riskRewardRatio, profit, commission, swap, fee,
        TimeToString(time, TIME_DATE | TIME_MINUTES), DealTypeToString(type),
        DealEntryToString(entry), DealReasonToString(reason), orderId,
        positionId, magic);

    if (i > 0)
      json += ",";
    json += dealJson;
  }

  json += "]";

  // Enviar o JSON
  uchar postData[];
  StringToCharArray(json, postData);
  uchar response[];
  string result_headers;

  ResetLastError();
  int res =
      WebRequest("POST", url, headers, 10, postData, response, result_headers);

  if (res == -1) {
    Print("❌ WebRequest falhou: ", GetLastError());
    return;
  }

  string responseText = CharArrayToString(response);
  Print("✅ Enviado com sucesso. Resposta:");
  Print(responseText);
}
