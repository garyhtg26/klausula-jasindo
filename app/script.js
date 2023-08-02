
$(document).ready( function () {

var api = 'https://laraveltest.jhonyfsimbolon.com/api/'  
var dragSrcRow = null;  // Keep track of the source row
var selectedRows = null;   // Keep track of selected rows in the source table
var srcTable = '';  // Global tracking of table being dragged for 'over' class setting
var rows = [];   // Global rows for #tableGenerateKlausula
var rows2 = [];  // Global rows for #tableSelectedKlausula
var datas = [];
var selectedKlausula = []; //
var tableSelectedKlausula = $('#tableSelectedKlausula')
var removeModalId = $('#removeModal');
var removeModalBodyId = $('#removeModalBody');
var confirmRemoveBtn = $('#confirmRemoveBtn');

var klausulaId = $('#klausulaId');
var formKlausulaModal = $('#formKlausulaModal');
var klausula_title = $('#klausula_title');
var klausula_deskripsi = $('#klausula_deskripsi');

var klausula_cob = $('#klausula_cob').select2();
var klausula_category= $('#klausula_category').select2();
var attachbase64 = ''; //klausula_file
var uploadPdf = $('#uploadPdf');
var uploadPdfLabel = $('#uploadPdfLabel');
var attachPreview = $('#attachPreview');
var submitBtn = $('#submitBtn');

var myTextarea = $('#myTextarea');
var tempContent;
var klausulaWording = $('#klausulaWording')

$('#generateKlausula').click(function(e) {  
    window.location.href = "generateKlausula.html";
});

$('#tableKlausula').click(function(e) {  
    window.location.href = "tableKlausula.html";
});

$('#generateBtn').click(function(e){
      e.preventDefault()
      if(table2 .rows().count() === 0){
        customAlert(1,'Please select klausula')
      } else {
        $('#tableSelectedKlausula > tbody > tr:nth-child(n) > td:nth-child(6)').each(function() {
        
          selectedKlausula.push($(this).html());
          console.log(selectedKlausula)
          sessionStorage.setItem('selectedKlausulaArray', selectedKlausula);
          window.location.href = "printKlausula.html";
     
        });
      }

});
submitBtn.click(function () {
  if(klausulaId.val() == null || klausulaId.val() == ''){
    if (formValidation()) {
      saveKlausa();
    }
  } else {
    editKlausula(klausulaId.val());
  }
 
});
$('body').on('shown.bs.modal', '.modal', function() {
  $(this).find('select').each(function() {
    var dropdownParent = $(document.body);
    if ($(this).parents('.modal.in:first').length !== 0)
      dropdownParent = $(this).parents('.modal.in:first');
    $(this).select2({
      dropdownParent: dropdownParent
      // ...
    });
  });
});
formKlausulaModal.on('hidden.bs.modal', function () {
  clearData();
});

    var dataLoad = function () {
      $('#loading').attr('hidden',false);
      var defer = $.Deferred();
      getDataKlausa()
      setTimeout(function () {
          defer.resolve();
      }, 1000);

      return defer;
  };

  var loadThis = function () {
    $('#loading').attr('hidden',true)
    var table = $('#tableGenerateKlausula').DataTable({
      ajax: {
        url: api + 'data_klausula',
        type: 'GET'
      },
      //data: datas,
      pageLength: 5,
      lengthMenu: [ 5, 10, 25, 50, 100],
      order: [[1, 'asc']],
      columns: [
        {
            //0
            data: null,
            defaultContent: "",
            orderable: false,
            className: 'select-checkbox'
        },
        {
            //1
            data: null,
            title: 'No',
            orderable: false,
            searchable: false
        },
        {
            //2
            data: 'klausula_title',
            title: 'Klausula Title',
            className: 'exportable'

        }, 
        {
            //3
            data: 'klausula_deskripsi',
            title: 'Klausula Description',
            className: 'exportable'
        },
        {
            //4
            data: 'klausula_cob',
            title: 'Cob',
            className: 'exportable'
        },
        // {
        //     //5
        //     data: 'klausula_category',
        //     title: 'Category',
        //     className: 'exportable'
        // },
        {
          //6
          data: 'klausula_wording',
          className: 'hidden'
      },
        {
          data: null,
          title: '',
          orderable: false,
          searchable: false,
          defaultContent: `<div class="d-flex">
                   <a type="button" class="btn btn-sm btn-primary" title="Download" id="downloadPdf">
                       <i class="fas fa-file-pdf mr-2"></i>Download
                   </a>
              </div>`
      }
    ],
      select: {
        style:    'os',
        selector: 'td:first-child'
      },
      

      
      // Add HTML5 draggable class to each row
      createdRow: function ( row, data, dataIndex, cells ) {
        $(row).attr('draggable', 'true');
      },
      
      drawCallback: function () {
        // Add HTML5 draggable event listeners to each row
        rows = document.querySelectorAll('#tableGenerateKlausula tbody tr');
          [].forEach.call(rows, function(row) {
            row.addEventListener('dragstart', handleDragStart, false);
            row.addEventListener('dragenter', handleDragEnter, false)
            row.addEventListener('dragover', handleDragOver, false);
            row.addEventListener('dragleave', handleDragLeave, false);
            row.addEventListener('drop', handleDrop, false);
            row.addEventListener('dragend', handleDragEnd, false);
          });
      },
      retrieve: true,
    });
    table.on('order.dt search.dt', function () {
      table.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
          cell.innerHTML = i + 1;
      });
    }).draw();

    $('#tableGenerateKlausula tbody').on('click', '#downloadPdf', function (e) {
      e.stopPropagation();

      var data = table.row($(this).parents('tr')).data();
      console.log(data);
      const contentType = 'application/pdf';
          const b64Data = data.klausula_file;
          
          const blob = b64toBlob(b64Data, contentType);
          const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank').focus();
  });

  };

  dataLoad().then(loadThis);


    function getDataKlausa() { 
      $.getJSON(api +'data_klausula', function(data) {
      console.log(data)
      //table.clear();
      if (data != null) {
        if (data.status) {
            if (data.data.length > 0) {
               // table.rows.add(data.data);
               
               datas = data.data;
               console.log(datas)
            } else {
               /* customAlert(data.Code, data.Message);*/
            }
        } else {
          alert('Uncexpected Error');
        }
        //table.draw();
        }
        });
      }
    
    var table2 = $('#tableSelectedKlausula').DataTable({
      paging: false,
      order: [[1, 'asc']],
      columns: [
        {
            //0
            data: null,
            defaultContent: "",
            orderable: false,
            className: 'select-checkbox'
        },
        {
            //1
            data: null,
            title: 'No',
            orderable: false,
            searchable: false
        },
        {
            //2
            data: 'klausula_title',
            title: 'Klausula Title',
            className: 'exportable'

        }, 
        {
            //3
            data: 'klausula_deskripsi',
            title: 'Klausula Description',
            className: 'exportable'
        },
        {
            //4
            data: 'klausula_cob',
            title: 'Cob',
            className: 'exportable'
        },
        // {
        //     //5
        //     data: 'klausula_category',
        //     title: 'Category',
        //     className: 'exportable'
        // },
        {
          //6
          data: 'klausula_wording',
          className: 'hidden'
      },
        {
          data: null,
          title: '',
          orderable: false,
          searchable: false,
          defaultContent: `<div class="d-flex">
                   <button type="button" class="btn btn-sm btn-primary" title="Download" disabled id="downloadPdf2">
                       <i class="fas fa-file-pdf mr-2"></i>Download
                   </button>
              </div>`
      }
    ],
      columnDefs: [ 
        {
          orderable: false,
          className: 'select-checkbox',
          targets: 0 
        }
     ],
      select: {
        style:    'os',
        selector: 'td:first-child'
      },
          
      // Add HTML5 draggable class to each row
      createdRow: function ( row, data, dataIndex, cells ) {
        $(row).attr('draggable', 'true');
      },
  
      drawCallback: function () {
        // Add HTML5 draggable event listeners to each row
        rows2 = document.querySelectorAll('#tableSelectedKlausula tbody tr');
          [].forEach.call(rows2, function(row) {
            row.addEventListener('dragstart', handleDragStart, false);
            row.addEventListener('dragenter', handleDragEnter, false)
            row.addEventListener('dragover', handleDragOver, false);
            row.addEventListener('dragleave', handleDragLeave, false);
            row.addEventListener('drop', handleDrop, false);
            row.addEventListener('dragend', handleDragEnd, false);
          });
      }  ,
      retrieve: true,
    });
    
    table2.on('order.dt search.dt', function () {
      table2.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
          cell.innerHTML = i + 1;
      });
    }).draw();
    $('#tableSelectedKlausula tbody').on('click', '#downloadPdf2', function (e) {
      e.stopPropagation();

      var data = table2.row($(this).parents('tr')).data();
      console.log(data);
      
      window.open(data.klausula_file, '_blank').focus();
  });

  function handleDragStart(e) {
    // this / e.target is the source node.
    
    // Set the source row opacity
    this.style.opacity = '0.4';
    
    // Keep track globally of the source row and source table id
    dragSrcRow = this;
    srcTable = this.parentNode.parentNode.id
    
    // Keep track globally of selected rows
    selectedRows = $('#' + srcTable).DataTable().rows( { selected: true } );
  
    // Allow moves
    e.dataTransfer.effectAllowed = 'move';
    
    // Save the source row html as text
    e.dataTransfer.setData('text/plain', e.target.outerHTML);
    
  }
    
  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }
  
    // Allow moves
    e.dataTransfer.dropEffect = 'move'; 
  
    return false;
  }
  
  function handleDragEnter(e) {
    // this / e.target is the current hover target.  
    
    // Get current table id
    var currentTable = this.parentNode.parentNode.id
    
    // Don't show drop zone if in source table
    if (currentTable !== srcTable) {
      this.classList.add('over');
    }
  }
  
  function handleDragLeave(e) {
    // this / e.target is previous target element.
    
    // Remove the drop zone when leaving element
    this.classList.remove('over');  
  }
    
  function handleDrop(e) {
    // this / e.target is current target element.
  
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }
  
    // Get destination table id, row
    var dstTable = $(this.closest('table')).attr('id');
  
    // No need to process if src and dst table are the same
    if (srcTable !== dstTable) {
      
      // If selected rows and dragged item is selected then move selected rows
      // if (selectedRows.count() > 0 && $(dragSrcRow).hasClass('selected')) {
        if ($(dragSrcRow).hasClass('selected')) {
        // Add row to destination Datatable
        $('#' + dstTable).DataTable().rows.add(selectedRows.data()).draw();
  
        // Remove row from source Datatable
        $('#' + srcTable).DataTable().rows(selectedRows.indexes()).remove().draw();
        
      } else {  // Otherwise move dragged row
  
        // Get source transfer data
        var srcData = e.dataTransfer.getData('text/plain');
        
        // Add row to destination Datatable
        $('#' + dstTable).DataTable().row.add($(srcData)).draw();
  
        // Remove row from source Datatable
        $('#' + srcTable).DataTable().row(dragSrcRow).remove().draw();
      }
  
    }
    return false;
  }
  
  function handleDragEnd(e) {
    // this/e.target is the source node.
    
    // Reset the opacity of the source row
    this.style.opacity = '1.0';
  
    // Clear 'over' class from both tables
    // and reset opacity
    [].forEach.call(rows, function (row) {
      row.classList.remove('over');
      row.style.opacity = '1.0';
    });
  
    [].forEach.call(rows2, function (row) {
      row.classList.remove('over');
      row.style.opacity = '1.0';
    });
  }
  
//data master

var table3 = $('#tableMasterKlausula').DataTable({
  ajax: {
    url: api + 'data_klausula',
    type: 'GET'
  },
  pageLength: 10,
  lengthMenu: [ 5, 10, 25, 50, 100],
  order: [[1, 'asc']],
  columns: [
    {
        //0
        data: null,
        defaultContent: "",
        orderable: false,
        className: 'select-checkbox'
    },
    {
        //1
        data: null,
        title: 'No',
        orderable: false,
        searchable: false
    },
    {
        //2
        data: 'klausula_title',
        title: 'Klausula Title',
        className: 'exportable'

    }, 
    {
        //3
        data: 'klausula_deskripsi',
        title: 'Klausula Description',
        className: 'exportable'
    },
    {
        //4
        data: 'klausula_cob',
        title: 'Cob',
        className: 'exportable'
    },
    // {
    //     //5
    //     data: 'klausula_category',
    //     title: 'Category',
    //     className: 'exportable'
    // },
    {
      data: null,
      title: '',
      orderable: false,
      searchable: false,
      defaultContent: `<div class="d-flex justify-content-center">
                                            <button type="button" class="btn btn-danger btn-sm" title="Delete" id="removeBtn">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>`
  }
],
  select: {
    style:    'os',
    selector: 'td:first-child'
  }
});
  
table3.on('order.dt search.dt', function () {
      table3.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
          cell.innerHTML = i + 1;
      });
    }).draw();

     $('#tableMasterKlausula tbody').on('click', '#removeBtn', function (e) {
        e.stopPropagation();

        var data = table3.row($(this).parents('tr')).data();
        console.log(data);
        removeModalBodyId.html(`Are you sure you want to remove <b>${data.klausula_title}</b> kalusula from <b>${data.klausula_cob}</b> CoB?`);
        removeModalId.modal('toggle');

        confirmRemoveBtn.click(function () {
            deleteKlausula(data.id);
        });
    });
    $('#tableMasterKlausula tbody').on('click', 'tr > td:not(.select-checkbox)', function (e) {
      e.stopPropagation();

      var data = table3.row($(this).parents('tr')).data();
      console.log(data);
      klausula_title.val(data.klausula_title);
      klausula_deskripsi.val(data.klausula_deskripsi)
      klausulaId.val(data.id);
      klausula_cob.val(data.klausula_cob).trigger('change');
      tinymce.activeEditor.setContent(data.klausula_wording, {format: 'raw'})
      // setTimeout(function () {
      //   klausula_category.val(data.klausula_category).trigger('change');
      // }, 250);
      if (data.klausula_file != null) {
          
          attachPreview.attr('hidden', false);
          const contentType = 'application/pdf';
          const b64Data = data.klausula_file;
          
          const blob = b64toBlob(b64Data, contentType);
          const blobUrl = URL.createObjectURL(blob);
          attachPreview.html(`<a href=${blobUrl} target=_blank> preview file attachment</a>`);
      } else {
          attachPreview.attr('hidden', false);
          attachPreview.html(`<p>No File Attachment</p>`);
      }
      if (data) {
        formKlausulaModal.modal('show'); 
          console.log('masuk')
      }
  });
  const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
  
  uploadPdf.change(function (e) {
    readMultipleFiles(this);
    var fileName = e.target.files[0].name;
    var files = URL.createObjectURL(this.files[0]);
    $(this).next('#uploadPdfLabel').html(fileName);
    document.getElementById('attachPreview').files = files;
    attachPreview.attr('hidden', false);
    attachPreview.html(`<a href=${files} target=_blank>preview</a>`);
});
// klausula_category.append('<option value="" selected>Select CoB First</option>');
// klausula_cob.on('change', function() {
//   getCategoryDropdown();
// });
function getCategoryDropdown() {
  klausula_category.html('');
  klausula_category.attr('disabled', false);
  if (klausula_cob.val()  == 'Marine') {
    klausula_category.append('  <option value="" selected>Choose...</option>');
    klausula_category.append('<option value="Deductible Clause" >Deductible Clause</option>');
    klausula_category.append('<option value="Charge Clause">Charge Clause</option>');
  } else if (klausula_cob.val() == 'Fire') {
    klausula_category.append('  <option value="" selected>Choose...</option>');
    klausula_category.append('<option value="Agreement Clause" >Agreement Clause</option>');
    klausula_category.append('<option value="Accountant Clause" >Accountant Clause</option>');
  } else if (klausula_cob.val()  == 'KBM') {
    klausula_category.append('  <option value="" selected>Choose...</option>');
    klausula_category.append('<option value="Arbitrase" >Arbitrase</option>');
    klausula_category.append('<option value="Abandoment or Wreckage" >Abandoment or Wreckage</option>');
  } 
 
}
function saveKlausa() {

  var request = {
          id: klausulaId.val(),
          klausula_title: klausula_title.val(),
          klausula_deskripsi: klausula_deskripsi.val(),
          klausula_cob: klausula_cob.val(),
          // klausula_category: klausula_category.val(),
          klausula_file: attachbase64,
          klausula_wording: tinyMCE.activeEditor.getContent()
      
  }

  console.log(request);

  var btnText = submitBtn.text();

  submitBtn.attr('disabled', true);
  submitBtn.text('Loading..');
  
  $.post(api + 'data_klausula', request, function (data) {
      console.log(data);

      if (data != null) {
          if (data.status) {

              submitBtn.text(btnText);
              submitBtn.attr('disabled', false);

              formKlausulaModal.modal('toggle');

              customAlert(0, data.message, true);
              

          } else {
              customAlert(1, data.message);
              formKlausulaModal.modal('toggle');
              submitBtn.text(btnText);
              submitBtn.attr('disabled', false);
          }
      } else {
        customAlert(1, 'Unexpected error');

          submitBtn.text(btnText);
          submitBtn.attr('disabled', false);
      }
  });
}
  function deleteKlausula(id) {

    $.ajax({
      type: "GET",
      url: api + "data_klausula_delete/"+id,
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      success: function (data, status, jqXHR) {

        customAlert(0, 'Data berhasil di delete', true);

      },

      error: function (jqXHR, status) {
          // error handler
          console.log(jqXHR);
          customAlert(1, 'Unexpected error');
      }
   });
}
function editKlausula(id) {

  var request = {
          klausula_title: klausula_title.val(),
          klausula_deskripsi: klausula_deskripsi.val(),
          klausula_cob: klausula_cob.val(),
          klausula_file: attachbase64,
          klausula_wording: tinyMCE.activeEditor.getContent()
      
  }

  console.log(request);

  var btnText = submitBtn.text();

  submitBtn.attr('disabled', true);
  submitBtn.text('Loading..');
  
  $.post(api + 'data_klausula/'+id, request, function (data) {
      console.log(data);

      if (data != null) {
          if (data.status) {

              submitBtn.text(btnText);
              submitBtn.attr('disabled', false);

              formKlausulaModal.modal('toggle');

              customAlert(0, data.message , true);
              

          } else {
              customAlert(1, data.message);
              formKlausulaModal.modal('toggle');
              submitBtn.text(btnText);
              submitBtn.attr('disabled', false);
          }
      } else {
          alert('unexpected error');

          submitBtn.text(btnText);
          submitBtn.attr('disabled', false);
      }
  });
}
function formValidation() {

  if (klausula_title.val() == null || klausula_title.val() == '') {
     customAlert(1, "Klausula title must be fill");
      return false;
  }
  if (klausula_deskripsi.val() == null || klausula_deskripsi.val() == '') {
    customAlert(1, "Klausula Description must be fill");
    return false;
}
if (klausula_cob.val() == null || klausula_cob.val() == '') {
  customAlert(1, "Class of Bussiness must selected");
  return false;
}

  // if (klausula_category.val() == null || klausula_category.val() == '') {
  //     customAlert(1, "Category must selected");
  //     return false;
  // }
//   if (uploadPdf.val() == null || uploadPdf.val() == '') {
//     customAlert(1, "File PDF cannot be empty");
//     return false;
// }
  if (tinyMCE.activeEditor.getContent() == null || tinyMCE.activeEditor.getContent() == ''){
    customAlert(1, "Wording cannot be empty");
    return false
  }
  return true;
}

function readMultipleFiles(element) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
      attachbase64 = reader.result.split(',')[1];
  }
  console.log(reader)
  reader.readAsDataURL(file);

}
function clearData() {
  klausula_title.val('');
  klausula_deskripsi.val('');
  klausula_cob.val(null).trigger('change');
  // klausula_category.append(' <option value="" selected>Select CoB First</option>');
  // klausula_category.val(null).trigger('change');
  // klausula_category.attr('disabled',true);
  uploadPdfLabel.html('-- Choose File --');
  uploadPdf.val('');
  attachPreview.attr('hidden', true);
}

function customAlert(i,text,reload){
  var icon = 'error';

    if (i == 0) {
        icon = 'success';
    } else if (i == 2) {
        icon = 'warning';
    }

  Swal.fire({
    title: text,
    icon: icon,
    confirmButtonText: 'ok'
  }).then((result) => {
    // Reload the Page
    if(reload){
      location.reload();
    }
  });
}

//editor

tinymce.init({
  selector: 'textarea',
  height : "500",
  plugins: 'save tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
  toolbar: ' undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
  tinycomments_mode: 'embedded',
  tinycomments_author: 'Author name',
  mergetags_list: [
    { value: 'First.Name', title: 'First Name' },
    { value: 'Email', title: 'Email' },
  ],
});
var myContent = tinymce.get("myTextarea").getContent();
console.log(myContent)

$('#submitWording').click(function(e){
  // $('#containerGenerate').attr('src',)
 // tinymce.activeEditor.execCommand('mceSave');

  tempContent = tinyMCE.activeEditor.getContent();
  console.log(tempContent)
  localStorage.setItem("content", tempContent);
  
});

});
