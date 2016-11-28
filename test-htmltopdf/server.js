var HTMLToPDF = require ('html5-to-pdf');
var htmlToPDF = new HTMLToPDF {
  inputPath: './testing.html',
  outputPath: './testing.pdf',
}
 
htmlToPDF.build (error) =>
  if(err) throw error;