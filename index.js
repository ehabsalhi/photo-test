const express = require('express')
const app = express()
const port = 4001
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
     destination: './public/uploads/' ,
     filename:(req, file , cb) =>{
          console.log(file);


          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));

     }
})


const upload = multer({storage : storage,
     limits:{fileSize: 100000000},
     fileFilter: function(req, file, cb){
       checkFileType(file, cb);
     }
})


function checkFileType(file, cb){
     // Allowed ext
     const filetypes = /jpeg|jpg|png|gif/;
     // Check ext
     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
     // Check mime
     const mimetype = filetypes.test(file.mimetype);
   
     if(mimetype && extname){
       return cb(null,true);
     }else {
       cb('Error: Images Only!');
     }
}



app.set('view engine' , 'ejs')
app.use(express.static('./public'));



app.get('/upload' , (req,res) =>{
     res.render('upload')
})

app.post('/upload' ,upload.single('image'), (req,res) =>{
     console.log(req.file.filename);
     res.render('upload', {
          message : 'uploaded',
          file: `uploads/${req.file.filename}`
     });
})



app.listen(port , () =>{
     console.log('up and running on port :' , port);
})