var fs = require('fs');
var date = new Date();
const archiver = require('archiver');


fs.readFile('main/models.json', (err, data) => {
  let models = JSON.parse(data);
  let zip_name_all = models.logos_zip_file_all;

  var outputAll = fs.createWriteStream('main/' + zip_name_all);
  var archiveAll = archiver('zip', {
    zlib: { level: 9 } 
  });
  archiveAll.pipe(outputAll);

  var logos = [];
  for (index in models.brands) {
    var brand = models.brands[index];
    var path = 'main/logo/' + brand.logo;
    if (fs.existsSync(path)) {
      if (logos[brand.logo] != 1) {
        archiveAll.file(path, { name: brand.logo });
        logos[brand.logo] = 1;
      }
    }
  //  console.log(brand.logo);
  }

  archiveAll.finalize();
});

fs.writeFile('main/update.json', '{"update":"' + date.toISOString() + '"}', function (err) {
  if (err) throw err;
  console.log('Replaced!');
});
