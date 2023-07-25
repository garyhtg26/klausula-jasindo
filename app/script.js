
$(document).ready( function () {

var api = 'http://127.0.0.1:8000/api/'  
var dragSrcRow = null;  // Keep track of the source row
var selectedRows = null;   // Keep track of selected rows in the source table
var srcTable = '';  // Global tracking of table being dragged for 'over' class setting
var rows = [];   // Global rows for #tableGenerateKlausula
var rows2 = [];  // Global rows for #tableSelectedKlausula
var datas = [];

var removeModalId = $('#removeModal');
var removeModalBodyId = $('#removeModalBody');
var confirmRemoveBtn = $('#confirmRemoveBtn');

var klausulaId = $('#klausulaId');
var formKlausulaModal = $('#formKlausulaModal');
var klausula_title = $('#klausula_title');
var klausula_subtitle = $('#klausula_subtitle');
var klausula_cob = $('#klausula_cob');
var klausula_category= $('#klausula_category');
var klausula_file = $('klausula_file');
var attachbase64 = '';
var uploadPdf = $('#uploadPdf');
var uploadPdfLabel = $('#uploadPdfLabel');
var attachPreview = $('#attachPreview');
var submitBtn = $('#submitBtn');

$('#generateKlausula').click(function(e) {  
    window.location.href = "generateKlausula.html";
});

$('#tableKlausula').click(function(e) {  
    window.location.href = "tableKlausula.html";
});

    var dataLoad = function () {
      var defer = $.Deferred();
      getDataKlausa()
      setTimeout(function () {
          defer.resolve();
      }, 500);

      return defer;
  };

  var loadThis = function () {

    var table = $('#tableGenerateKlausula').DataTable({
      // ajax: {
      //   url: api + 'data_klausula',
      //   type: 'GET'
      // },
      data: datas,
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
            data: 'klausula_subtitle',
            title: 'Klausula Subtitle',
            className: 'exportable'
        },
        {
            //4
            data: 'klausula_cob',
            title: 'Cob',
            className: 'exportable'
        },
        {
            //5
            data: 'klausula_category',
            title: 'Category',
            className: 'exportable'
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
      }
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
      window.open(data.klausula_file, '_blank').focus();
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
            data: 'klausula_subtitle',
            title: 'Klausula Subtitle',
            className: 'exportable'
        },
        {
            //4
            data: 'klausula_cob',
            title: 'Cob',
            className: 'exportable'
        },
        {
            //5
            data: 'klausula_category',
            title: 'Category',
            className: 'exportable'
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
      }  
    });
    
    table2.on('order.dt search.dt', function () {
      table2.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
          cell.innerHTML = i + 1;
      });
    }).draw();

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
        data: 'klausula_subtitle',
        title: 'Klausula Subtitle',
        className: 'exportable'
    },
    {
        //4
        data: 'klausula_cob',
        title: 'Cob',
        className: 'exportable'
    },
    {
        //5
        data: 'klausula_category',
        title: 'Category',
        className: 'exportable'
    },
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
        removeModalBodyId.html(`Are you sure you want to remove <b>${data.klausula_title}</b> kalusula from  <b>${data.klausula_category}</b> in <b>${data.klausula_cob}</b> CoB?`);
        removeModalId.modal('toggle');

        confirmRemoveBtn.click(function () {
            deleteUser(data.UserRoleId);
        });
    });
    $('#tableMasterKlausula tbody').on('click', 'tr > td:not(.select-checkbox)', function (e) {
      e.stopPropagation();

      var data = table3.row($(this).parents('tr')).data();
      console.log(data);
      klausula_title.val(data.klausula_title);
      klausula_subtitle.val(data.klausula_subtitle)
      klausulaId.val(data.id);
      klausula_cob.val(data.klausula_cob).trigger('change');

      setTimeout(function () {
        klausula_category.val(data.klausula_category).trigger('change');
      }, 250);
      if (data.klausula_file != null) {
          attachPreview.attr('hidden', false);
          attachPreview.html(`<a href=${data.klausula_file} target=_blank> preview file attachment</a>`);
      } else {
          attachPreview.attr('hidden', false);
          attachPreview.html(`<p>No File Attachment</p>`);
      }
      if (data) {
        formKlausulaModal.modal('show'); 
          console.log('masuk')
      }
  });

  uploadPdf.change(function (e) {
    readMultipleFiles(this);
    var fileName = e.target.files[0].name;
    var files = URL.createObjectURL(this.files[0]);
    $(this).next('#uploadPdfLabel').html(fileName);
    document.getElementById('attachPreview').files = files;
    attachPreview.attr('hidden', false);
    attachPreview.html(`<a href=${files} target=_blank>preview</a>`);
});
klausula_cob.on('change', function() {
  getCategoryDropdown();
});
function getCategoryDropdown() {
  if (klausula_cob.find(":selected").val()  == 'Marine') {
    klausula_category.html('');
    klausula_category.attr('disabled', false);
    klausula_category.append('<option value="Deductible Clause" disabled selected>Deductible Clause</option>');
    klausula_category.append('<option value="Charge Clause" disabled selected>Charge Clause</option>');
    
  } else if (klausula_cob.find(":selected").val() == 'Fire') {
    klausula_category.html('');
  klausula_category.attr('disabled', false);
    klausula_category.append('<option value="Agreement Clause" disabled selected>Agreement Clause</option>');
    klausula_category.append('<option value="Accountant Clause" disabled selected>Accountant Clause</option>');
  } else if (klausula_cob.find(":selected").val()  == 'KBM') {
    klausula_category.html('');
  klausula_category.attr('disabled', false);
    klausula_category.append('<option value="Arbitrase" disabled selected>Arbitrase</option>');
    klausula_category.append('<option value="Abandoment or Wreckage" disabled selected>Abandoment or Wreckage</option>');
  } 
 
}
function saveKlausa() {

  var request = {
      visitorTrafficData: {
          VisitorTrafficId: visitorTrafficId.val(),
          Month: visitorMonth.val(),
          Year: visitorYear.val(),
          DataAttach: attachbase64
      }
  }

  console.log(request);

  var btnText = submitBtn.text();

  submitBtn.attr('disabled', true);
  submitBtn.text('Loading..');

  $.post(baseUrl + 'Tenant/SaveVisitorTraffic', request, function (data) {
      console.log(data);

      if (data != null) {
          if (data.Code == 0) {

              submitBtn.text(btnText);
              submitBtn.attr('disabled', false);

              visitorFormModal.modal('toggle');

              customAlert(data.Code, data.Message);

          } else {
              customAlert(data.Code, data.Message);

              submitBtn.text(btnText);
              submitBtn.attr('disabled', false);
          }
      } else {
          customAlert(1, 'Unexpected Error');

          submitBtn.text(btnText);
          submitBtn.attr('disabled', false);
      }
  });
}
  function deleteUser(userRoleId) {

    var request = {
        UserRoleId: userRoleId
    }

    console.log(request);

    $.post(baseUrl + 'User/DeleteUser', request, function (data) {
        console.log(data);

        if (data != null) {
            if (data.Code == 0) {
                customAlert(data.Code, data.Message);
            } else {
                customAlert(data.Code, data.Message);
            }
        } else {
            customAlert(1, 'Unexpected Error');
        }
    });
}
function formValidation() {
  if (yearDropdownId.val() == null) {
      customAlert(1, "Visitor year must selected");
      return false;
  }

  if (visitorMonth.val() == null) {
      customAlert(1, "Visitor month must selected");
      return false;
  }

  return true;
}

function readMultipleFiles(element) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
      attachbase64 = reader.result.split(',')[1];
  }
  reader.readAsDataURL(file);

}
function clearData() {
  visitorTrafficId.val('');
  //visitorYear.val(null).trigger('change');
  visitorMonth.val(null).trigger('change');
  uploadPdfLabel.html('-- Choose File --');
  uploadPdf.val('');
  attachPreview.attr('hidden', true);
}
  
  });