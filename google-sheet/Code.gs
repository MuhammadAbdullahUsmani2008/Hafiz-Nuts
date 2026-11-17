/**
 * HAFIZ NUTS - order sheet receiver (Google Apps Script).
 *
 * Paste this whole file into the script editor of the order Google Sheet
 * (Extensions -> Apps Script), set SECRET below, then Deploy -> New deployment
 * -> Web app (Execute as: Me, Who has access: Anyone). Full steps: SETUP.md.
 *
 * - doPost: the website sends each new order here; it becomes one sheet row.
 * - doGet : the admin page asks for the dashboard numbers (counts, sales,
 *           latest orders). The counting happens here, next to the data, so the
 *           website only passes a small result through.
 *
 * Both reject any request that does not carry the SECRET.
 */

// Must be identical to the ORDERS_SECRET secret set on Cloudflare.
var SECRET = "PASTE_THE_SECRET_HERE";

var SHEET_NAME = "Orders";
var TZ = "Asia/Karachi";
var HEADERS = [
  "Date", "Order No", "Name", "Phone", "City", "Address",
  "Items", "Total (PKR)", "Payment", "Notes", "Status",
];
var STATUSES = ["New", "Confirmed", "Shipped", "Delivered", "Cancelled"];
var RECENT_COUNT = 30;

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.getRange("K2:K").setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build()
    );
  }
  return sheet;
}

function json_(object) {
  return ContentService.createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}

function text_(value, max) {
  return String(value == null ? "" : value).slice(0, max);
}

// ---- Website -> sheet: save one order -------------------------------------
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.secret !== SECRET) return json_({ ok: false, error: "unauthorized" });

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = getSheet_();

      // Admin page: change one order's Status.
      if (body.action === "setStatus") {
        if (STATUSES.indexOf(body.status) === -1) return json_({ ok: false, error: "bad status" });
        var last = sheet.getLastRow();
        var numbers = last > 1 ? sheet.getRange(2, 2, last - 1, 1).getValues() : [];
        for (var i = 0; i < numbers.length; i++) {
          if (String(numbers[i][0]) === String(body.orderNo)) {
            sheet.getRange(i + 2, 11).setValue(body.status);
            return json_({ ok: true });
          }
        }
        return json_({ ok: false, error: "order not found" });
      }

      var orderNo = "HN-" + ("0000" + sheet.getLastRow()).slice(-4); // header row = 1
      var row = sheet.getLastRow() + 1;

      // Plain-text cells keep "0300..." phone numbers intact and stop any
      // customer-typed "=..." from being run as a spreadsheet formula.
      sheet.getRange(row, 2, 1, 10).setNumberFormat("@");
      sheet.getRange(row, 1).setNumberFormat("dd mmm yyyy, hh:mm");
      sheet.getRange(row, 8).setNumberFormat("#,##0");

      sheet.getRange(row, 1, 1, HEADERS.length).setValues([[
        new Date(),
        orderNo,
        text_(body.name, 100),
        text_(body.phone, 30),
        text_(body.city, 60),
        text_(body.address, 300),
        text_(body.items, 1000),
        Number(body.total) || 0,
        text_(body.payment, 40),
        text_(body.notes, 300),
        "New",
      ]]);
      sheet.getRange(row, 8).setNumberFormat("#,##0");
      return json_({ ok: true, orderNo: orderNo });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// ---- Admin page -> dashboard numbers --------------------------------------
function doGet(e) {
  try {
    if (!e.parameter || e.parameter.key !== SECRET) {
      return json_({ ok: false, error: "unauthorized" });
    }
    if (e.parameter.action !== "stats") return json_({ ok: false, error: "unknown action" });

    var sheet = getSheet_();
    var last = sheet.getLastRow();
    var rows = last > 1 ? sheet.getRange(2, 1, last - 1, HEADERS.length).getValues() : [];

    var now = new Date();
    var today = Utilities.formatDate(now, TZ, "yyyy-MM-dd");
    var month = Utilities.formatDate(now, TZ, "yyyy-MM");
    var weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

    var counts = { total: rows.length, today: 0, last7Days: 0, thisMonth: 0 };
    var byStatus = {};
    var revenue = { allTime: 0, thisMonth: 0 };

    rows.forEach(function (r) {
      var date = r[0] instanceof Date ? r[0] : new Date(r[0]);
      var status = String(r[10] || "New");
      var total = Number(r[7]) || 0;
      var day = Utilities.formatDate(date, TZ, "yyyy-MM-dd");
      var inMonth = Utilities.formatDate(date, TZ, "yyyy-MM") === month;

      byStatus[status] = (byStatus[status] || 0) + 1;
      if (day === today) counts.today++;
      if (date.getTime() >= weekAgo) counts.last7Days++;
      if (inMonth) counts.thisMonth++;
      if (status !== "Cancelled") {
        revenue.allTime += total;
        if (inMonth) revenue.thisMonth += total;
      }
    });

    var recent = rows.slice(-RECENT_COUNT).reverse().map(function (r) {
      var date = r[0] instanceof Date ? r[0] : new Date(r[0]);
      return {
        date: date.toISOString(),
        orderNo: String(r[1]),
        name: String(r[2]),
        phone: String(r[3]),
        city: String(r[4]),
        items: String(r[6]),
        total: Number(r[7]) || 0,
        payment: String(r[8]),
        status: String(r[10] || "New"),
      };
    });

    return json_({ ok: true, counts: counts, byStatus: byStatus, revenue: revenue, recent: recent });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
