function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("wisata");
  const data = sheet.getDataRange().getValues();

  // Extract headers and rows
  const headers = data[0];
  const rows = data.slice(1);

  // Define the desired order of keys
  const desiredOrder = [
    "place_id", "Nama Desa", "Kategori", "Status", 
    "Alamat Desa", "Deskripsi", 
    "LinkGMaps", "Lattitude", "Longitude", "Provinsi"
  ];

  // Parse rows into JSON and retain only desired keys
  let json = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      if (desiredOrder.includes(header)) {
        obj[header] = row[index];
      }
    });
    return obj;
  });

  // Ensure the keys are ordered according to `desiredOrder`
  json = json.map(row => {
    let sortedObj = {};
    desiredOrder.forEach(key => {
      if (row[key] !== undefined) {
        sortedObj[key] = row[key];
      }
    });
    return sortedObj;
  });

  // Filter data based on query parameters
  if (e && e.parameter) {
    const namaDesa = e.parameter.nama_desa;
    const kategori = e.parameter.kategori;
    const status = e.parameter.status;
    const id = e.parameter.place_id;

    let filteredData = json;

    // Filter by place_id
    if (id) {
      filteredData = filteredData.filter(row => row["place_id"] == id);
    }

    // Filter by nama_desa
    if (namaDesa) {
      filteredData = filteredData.filter(row => row["Nama Desa"].toLowerCase() === namaDesa.toLowerCase());
    }

    // Filter by kategori
    if (kategori) {
      filteredData = filteredData.filter(row => row["Kategori"].toLowerCase() === kategori.toLowerCase());
    }

    // Filter by status
    if (status) {
      filteredData = filteredData.filter(row => row["Status"].toLowerCase() === status.toLowerCase());
    }

    // Return filtered data
    return ContentService.createTextOutput(JSON.stringify(filteredData))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Return all data
  return ContentService.createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}
