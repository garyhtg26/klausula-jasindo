
$(document).ready( function () {
new DataTable('#example');


$('#generateKlausula').click(function(e) {  
    window.location.href = "generateKlausula.html";
});

$('#tableKlausula').click(function(e) {  
    window.location.href = "tableKlausula.html";
});
    var dragSrcRow = null;  // Keep track of the source row
    var selectedRows = null;   // Keep track of selected rows in the source table
    var srcTable = '';  // Global tracking of table being dragged for 'over' class setting
    var rows = [];   // Global rows for #example
    var rows2 = [];  // Global rows for #example2
    
    var data =  [
      [
        "",
        "Tiger Nixon",
        "System Architect",
        "Edinburgh",
        "5421",
        "2011/04/25",
        "$320,800"
      ],
      [
        "",
        "Garrett Winters",
        "Accountant",
        "Tokyo",
        "8422",
        "2011/07/25",
        "$170,750"
      ],
      [
        "",
        "Ashton Cox",
        "Junior Technical Author",
        "San Francisco",
        "1562",
        "2009/01/12",
        "$86,000"
      ],
      [
        "",
        "Cedric Kelly",
        "Senior Javascript Developer",
        "Edinburgh",
        "6224",
        "2012/03/29",
        "$433,060"
      ],
  ];
    
  var data2 = [
        []
  ]
    
    var table = $('#tableGenerateKlausula').DataTable({
      data: data,
      paging: false,
      order: [[1, 'asc']],
      columnDefs: [ 
        {
          orderable: false,
          className: 'select-checkbox',
          targets:   0
        },
        {
          orderable: false,
          data: null,
            defaultContent: `<div class="d-flex">
            <a type="button" class="btn btn-sm btn-primary" title="Download" id="downloadPdf">
                <i class="fas fa-file-pdf mr-2"></i>Download
            </a>
        </div>`,
            targets: -1
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
        rows = document.querySelectorAll('#example tbody tr');
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
    
    
    
    var table2 = $('#example2').DataTable({
      data: data2,
      paging: false,
      order: [[1, 'asc']],
      
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
        rows2 = document.querySelectorAll('#example2 tbody tr');
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
      if (selectedRows.count() > 0 && $(dragSrcRow).hasClass('selected')) {
  
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
  
  
  
  } );