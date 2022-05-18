var multer = require("multer")
var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,"./client/public/uploads/posts");
  },
  filename :function(req, file, cb){
    cb(null,file.fieldname+ "_" + Date.now() + "_" + file.originalname);
  },
});
// the parameter is the name of input tag (in html view: <input type="file" id="files">) will store the files in req.file
var upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
    }).array("files",12);



module.exports = upload;