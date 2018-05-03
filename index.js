var express = require('express');
var path = require('path')
var router = express.Router();
var http = require('http');

var formidable = require('formidable'),
    util = require('util'),
    fs   = require('fs-extra');

var app = express();
app.get('/', function(request, response) {
  response.send('Hello World!');
});

var server = http.createServer(function(req, res) { // var server
    res.writeHead(200, {'Content-Type': 'text/html'
    });

  /* Process the form uploads */
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});//plain

      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });
 
    form.on('progress', function(bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log(percent_complete.toFixed(2));
    });
 
    form.on('error', function(err) {
        console.error(err);
    });
 
    form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        
        //console.log("temp path"+ temp_path);
        
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
	
        var new_location = path.resolve(__dirname) +'/'; //'c:/localhost/nodejs/';//
 	
	fs.copy(temp_path, new_location + file_name, function(err) {  
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });
    });

    return;
  }

  /* Display the file upload form. */
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );

  var type = 'standalone_flex_fileH'//yg

  router.get('/', function(req, res) {  //yg
    res.render('primes', {target:type});  //yg
  });

  var exec = require('child_process').exec;
  var execFile = require('child_process').execFile
  var program = "./cpp/standalone_flex_fileH/build/Release/standalone_flex_fileH";

//temp.mkdir('node_example', function(err, dirPath) {
    //  var inputPath = path.join(__dirPath, 'input.txt');
    //  var outputPath = path.join(__dirPath, 'output.txt');
        
    var inputPath = path.join(__dirname, 'input.csv');
    var outputPath = path.join(__dirname, 'output.csv');
        console.log("input File " + inputPath);
 	console.log("output File " + outputPath);
	console.log("Calculation Done! ");

    var primes = execFile(program, [inputPath, outputPath], function(error) {
            if (error ) throw error;
  });
}).listen(8080) //;

module.exports = router;

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080, //;
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'; 
server.listen(port, function() {
  console.log("Listening on " + port);
});