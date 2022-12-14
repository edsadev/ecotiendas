export const exportTableToExcel = (tableID, filename = '') =>{
  var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  
  // Specify file name
  filename = filename?filename+new Date().toLocaleDateString("en-GB", {year: 'numeric', month: 'numeric', day: 'numeric' })+'.xls':`Reporte.xls`;
  
  // Create download link element
  downloadLink = document.createElement("a");
  
  document.body.appendChild(downloadLink);
  
  if(navigator.msSaveOrOpenBlob){
    var blob = new Blob(['ufeff', tableHTML], {
        type: dataType
    });
    navigator.msSaveOrOpenBlob( blob, filename);
  }else{
    // Create a link to the file
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

    // Setting the file name
    downloadLink.download = filename;
    
    //triggering the function
    downloadLink.click();
  }
}

export function renderSemaforo(semaforo){
  const total = Math.floor(semaforo * 100)
  if (total >= 0 && total < 50){
    return (
      <span>🟢</span>
    )
  } else if (total >= 50 && total < 70){
    return (
      <span>🟡</span>
    )
  } else if (total >= 70 ){
    return (
      <span>🔴</span>
    )
  }
}

export function _setLabels(ids, data, tipo_producto = '1'){
  return ids.map((id) => {
    return data[id].tipo_producto.toString() === tipo_producto && data[id].nombre
  }).filter(index => index !== false)
}  

export function _setData(ids, data, tipo_producto = '1'){
  return ids.map((id) => {
    return data[id].tipo_producto.toString() === tipo_producto && data[id].peso
  }).filter(index => index !== false)
}

export function _actualDate(){
  return `${new Date().getFullYear()}-${(new Date().getMonth() + 1) < 10 ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1) }-${new Date().getDate()}`
}