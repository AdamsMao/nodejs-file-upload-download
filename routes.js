var fs = require('fs');
var path = require('path');
var file_read = require('./list_files');
var domain = require('domain');

module.exports = function (app) {
		app.get('/', function(req, res, next) {
				res.render('index');
		});

		app.get('/upload', function(req, res, next) {
				res.render('upload');
		});

		app.post('/file-upload', function(req, res, next) {
			//console.log(req.body);
			//get the temp path
			var d = domain.create();
			d.on('error', console.error);
			d.run(function() {
				var tmp_path = req.files.thumbnail.path;			
				//specific the upload to path
				var target_path = path.join('public', 'upload', req.files.thumbnail.name);
				var source = fs.createReadStream(tmp_path);
			 	var dest = fs.createWriteStream(target_path)
				source.pipe(dest);
				res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + 'bytes' + '<br><br><a class="btn btn-primary" href="/upload" id="home" > Upload again </a>');	
				//move the file
				/*fs.rename(tmp_path, target_path, function(err) {
					if(err) {
						//console.log('maybe you should select a file at first?');
						return;
					}
					//delete 
					fs.unlink(tmp_path, function() {
						if (err) throw err;
						res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + 'bytes' + '<br><br><a class="btn btn-primary" href="/upload" id="home" > Upload again </a>');								
					});
				});*/
				//console.log('size:' + req.files.thumbnail.size);
				//console.log('file type:' + req.files.thumbnail.type);
				//console.log('name:' + req.files.thumbnail.name);
				//console.log('path:' + req.files.thumbnail.path);
				//res.end('thanks for upload');
			});
		});

		app.get('/image', function(req, res) {
			   fs.readFile('./logo.png', function(err, data) {
						if (err) throw err;
						//res.writeHead(200, {'Content-Type' : 'image/png' });
						//res.write(data, 'binary');
						res.writeHead(200, {'Content-Type': 'text/html'});
						res.write('<html><body>Image Server<br><img src="data:image/jpeg;base64,')
						res.write(new Buffer(data).toString('base64'));
						res.write('"/>');
						res.write('<br><p>New line</p></body></html>');
				});
		});

		app.get('/download_page', function(req, res, next) {
				res.render('download');
		});

		app.get( '/get_files', file_read.get_lists );
		
		app.get('/download/*', function (req, res, next) {
				target_file = path.join(__dirname, 'public', 'upload', req.params[0]);
				var f = target_file;
				f = path.resolve(f);
				res.download(f);
		});

}


