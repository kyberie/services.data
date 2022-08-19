var fs = require('fs');
var date = new Date();
const archiver = require('archiver');


fs.readFile('main/data.json', (err, data) => {
  let json = JSON.parse(data);
  let zip_name_all = json.logos_zip_file_all;

  var outputAll = fs.createWriteStream('main/' + zip_name_all);
  var archiveAll = archiver('zip', {
    zlib: { level: 9 } 
  });
  archiveAll.pipe(outputAll);

  var logos = [];
  for (index in json.services) {
    var service = json.services[index];
    var path = 'main/logo/' + service.logo;
    if (fs.existsSync(path)) {
      if (logos[service.logo] != 1) {
        archiveAll.file(path, { name: service.logo });
        logos[service.logo] = 1;
      }
    }
  //  console.log(brand.logo);
  }
  if (logos.length == 0){
	archiveAll.file('main/logo/no_logos.txt', { name: 'no_logos' });
  }

  archiveAll.finalize();
});

fs.writeFile('main/update.json', '{"update":"' + date.toISOString() + '"}', function (err) {
  if (err) throw err;
  console.log('Replaced!');
});
