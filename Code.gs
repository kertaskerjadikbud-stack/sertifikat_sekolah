const SPREADSHEET_ID="1BbyPo4NmYdOlOW1JYr5yMSXxsrdNT0zW6KP4u2xa7v8";
const API_TOKEN="TOKEN_RAHASIA_123";

function doGet(e){
  if(e.parameter.token!==API_TOKEN) return json({status:"error",message:"Unauthorized"});
  const sheetName=e.parameter.sheet||"SD NEGERI";
  const sh=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data=sh.getDataRange().getValues();
  const header=data.shift();
  return json(data.map(r=>{ let o={}; header.forEach((h,i)=>o[h]=r[i]); return o; }));
}

function doPost(e){
  const data=JSON.parse(e.postData.contents);
  if(data.token!==API_TOKEN) return json({status:"error",message:"Unauthorized"});
  if(data.action==="upload"){
    const blob=Utilities.newBlob(Utilities.base64Decode(data.base64),data.mimeType,data.name);
    const file=DriveApp.createFile(blob);
    const fileUrl=file.getUrl();
    const sheet=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(data.sheet);
    const header=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    const colIndex=header.indexOf("Sertifikat")+1;
    sheet.getRange(data.rowIndex+2,colIndex).setValue(fileUrl);
    return json({status:"ok",url:fileUrl});
  }
  return json({status:"invalid request"});
}

function json(obj){ return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
