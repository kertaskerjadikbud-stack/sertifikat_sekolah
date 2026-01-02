const API = "https://script.google.com/macros/s/AKfycbyUW1M5hxUwESlWC2ftrIRRt9ccc-xzDXN7mY1tkKiKdhP2rYKhl3l0Z56piRkIRLQjSg/exec"; // token keamanan
let allData = [], filteredData = [], currentPage = 1, rowsPerPage = 10;

// CEK LOGIN
if (!localStorage.getItem("role")) location.href = "login.html";

function logout() { localStorage.clear(); location.href = "login.html"; }

function load() {
  showLoading();
  fetch(API + "&sheet=" + sheet.value)
    .then(r => r.json())
    .then(d => { hideLoading(); allData = d; populateKecamatan(d); applyFilter(); });
}

// FILTER & SEARCH
function populateKecamatan(d) {
  kecamatan.innerHTML = '<option value="">Semua Kecamatan</option>';
  [...new Set(d.map(x => x.Kecamatan))].forEach(k => { if(k) kecamatan.innerHTML += `<option>${k}</option>`; });
}
kecamatan.onchange = applyFilter;
sheet.onchange = load;
search.onkeyup = applyFilter;

function applyFilter() {
  const key = search.value.toLowerCase();
  const kec = kecamatan.value;
  filteredData = allData.filter(d => {
    const text = `${d.NPSN} ${d["Nama Satuan Pendidikan"]} ${d.Kecamatan}`.toLowerCase();
    return text.includes(key) && (kec ? d.Kecamatan === kec : true);
  });
  currentPage = 1;
  renderTable(filteredData);
  updateDashboard(filteredData);
  updateRekap(filteredData);
}

// PAGINATION & RENDER
function renderTable(data) {
  tb.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const pageData = data.slice(start, start + rowsPerPage);
  pageData.forEach((x,i)=> {
    tb.innerHTML += `
      <tr class="hover:bg-gray-50">
        <td class="td">${x.No}</td>
        <td class="td">${x.NPSN}</td>
        <td class="td font-medium">${x["Nama Satuan Pendidikan"]}</td>
        <td class="td">${x.Kecamatan}</td>
        <td class="td"><input type="file" class="text-xs" onchange="uploadFile(this, ${i})"></td>
        <td class="td text-center">
          ${x.Sertifikat
            ? `<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✔ Ada</span>
               <button onclick="openPDF('${x.Sertifikat}')" class="btn-view ml-2">👁</button>`
            : `<span class="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">✖ Belum</span>`}
        </td>
      </tr>`;
  });
  page.innerText = currentPage;
  info.innerText = `Menampilkan ${start+1}–${Math.min(start+rowsPerPage,data.length)} dari ${data.length} data`;
}

function nextPage(){ if(currentPage*rowsPerPage<filteredData.length){ currentPage++; renderTable(filteredData); } }
function prevPage(){ if(currentPage>1){ currentPage--; renderTable(filteredData); } }

// DASHBOARD & REKAP
function updateDashboard(data){
  const total = data.length;
  const done = data.filter(d=>d.Sertifikat).length;
  const percent = total?Math.round((done/total)*100):0;
  progressBar.style.width = percent+"%";
  progressBar.innerText = percent+"%";
  progressText.innerText = `${done} dari ${total} sekolah sudah memiliki sertifikat.`;
}
function updateRekap(data){
  const kecamatans = [...new Set(data.map(d=>d.Kecamatan))];
  rekap.innerHTML="";
  kecamatans.forEach(kec=>{
    const rows=data.filter(d=>d.Kecamatan===kec);
    const done = rows.filter(r=>r.Sertifikat).length;
    rekap.innerHTML+=`<tr>
      <td class="px-3 py-2">${kec}</td>
      <td class="px-3 py-2">${rows.length}</td>
      <td class="px-3 py-2 text-green-700">${done}</td>
      <td class="px-3 py-2 text-red-600">${rows.length-done}</td>
    </tr>`;
  });
}

// MODAL PREVIEW
function openPDF(url){ modal.style.display="flex"; viewer.src=url; dl.href=url; }
function closeModal(){ modal.style.display="none"; viewer.src=""; }

// EXPORT EXCEL
function exportExcel(){
  let csv="No,NPSN,Nama Sekolah,Kecamatan,Sertifikat\n";
  filteredData.forEach(d=>{ csv+=`"${d.No}","${d.NPSN}","${d["Nama Satuan Pendidikan"]}","${d.Kecamatan}","${d.Sertifikat?"Ada":"Belum"}"\n`; });
  const blob=new Blob([csv],{type:"text/csv"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="sertifikat-gedung.csv"; a.click();
}

// UPLOAD FILE
function uploadFile(input,index){
  const file=input.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{ fetch(API,{
    method:"POST",
    body:JSON.stringify({action:"upload",base64:reader.result.split(",")[1],name:file.name,mimeType:file.type,rowIndex:index,sheet:sheet.value,token:"TOKEN_RAHASIA_123"})
  }).then(r=>r.json()).then(res=>{ alert("Upload berhasil"); load(); }); };
  reader.readAsDataURL(file);
}

// PAGINATION LOADING
function showLoading(){ tb.innerHTML='<tr><td colspan="6" class="p-4 animate-pulse bg-gray-100"></td></tr>'; }
function hideLoading(){ tb.innerHTML=""; }

load();
