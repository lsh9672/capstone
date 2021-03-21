$(function () {
    var obj = $("#dropzone");

     obj.on("dragenter", function(e){
          e.preventDefault();
          e.stopPropagation();
     }).on("dragover", function(e){
          e.preventDefault();
          e.stopPropagation();
          $(this).css("background-color", "#FFD8D8");
     }).on("dragleave", function(e){
          e.preventDefault();
          e.stopPropagation();
          $(this).css("background-color", "#FFF");
     }).on("drop", function(e){
          e.preventDefault();

          var files = e.originalEvent.dataTransfer.files;
          if(files != null && files != undefined){
          var tag = "";
          for(i=0; i<files.length; i++){
               var f = files[i];
               fileList.push(f);
               var fileName = f.name;
               var fileSize = f.size / 1024 / 1024;
               fileSize = fileSize < 1 ? fileSize.toFixed(3) : fileSize.toFixed(1);
               tag += 
                         "<div class='fileList'>" +
                              "<span class='fileName'>"+fileName+"</span>" +
                              "<span class='fileSize'>"+fileSize+" MB</span>" +
                              "<span class='clear'></span>" +
                         "</div>";
          }
          $(this).append(tag);
          }

          $(this).css("background-color", "#FFF");
     });
});