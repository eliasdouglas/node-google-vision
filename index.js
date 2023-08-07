const http = require('http');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('express'));

const bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({
  
 extended:true
}));

const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/files");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

  const upload = multer({
    storage: multerStorage,
  });

const vision = require('@google-cloud/vision');

CREDENTIALS = JSON.parse(JSON.stringify({
    "type": "service_account",
    "project_id": "PROJECTID",
    "private_key_id": "PRIVATEKEYID",
    "private_key": "-----BEGIN PRIVATE KEY-----\n",
    "client_email": ".iam.gserviceaccount.com",
    "client_id": "CLIENTID",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "httserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  ));

const CONFIG = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
};

const client = new vision.ImageAnnotatorClient(CONFIG);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.post("/detectionLogo", upload.single('myimgfile'), function(request, response){

    console.log(request.file.filename);

    const detectLogo = async (file_path) => {

        let [result] = await client.logoDetection(file_path);
        
        var table = "<table border=1>";
            
            if(result.logoAnnotations.length>0){
                for(var i = 0; i<result.logoAnnotations.length; i++){
                    table += "<tr>";
                        table += "<td>"+result.logoAnnotations[i].description+"</td>";
                    table += "</tr>";
                }
            }else{
                table+= "<tr><td>No logo found</td></tr>";
            }
            

        table += "</table>";
        response.send(table); 
    };

    detectLogo(path.join(__dirname+'/public/files/' + request.file.filename));
    
});

app.post("/detectionLandmark", upload.single('myimgfile'), function(request, response){

    console.log(request.file.filename);

    const detectLandmark = async (file_path) => {

        let [result] = await client.landmarkDetection(file_path);
        
        var table = "<table border=1>";
    
            
            if(result.landmarkAnnotations.length>0){
                for(var i = 0; i<result.landmarkAnnotations.length; i++){
                    table += "<tr>";
                        table += "<td>"+result.landmarkAnnotations[i].description+"</td>";
                    table += "</tr>";
                }
            }else{
                table+= "<tr><td>No landmark found</td></tr>";
            }
            
    
        table += "</table>";
        response.send(table); 
    };

    detectLandmark(path.join(__dirname+'/public/files/' + request.file.filename));
    
});

app.post("/detectionText", upload.single('myimgfile'), function(request, response){

    console.log(request.file.filename);

    const detectLandmark = async (file_path) => {

        let [result] = await client.textDetection(file_path);
        
        var table = "<table border=1>";
    
            
            if(result.textAnnotations.length>0){
                for(var i = 0; i<result.textAnnotations.length; i++){
                    table += "<tr>";
                        table += "<td>"+result.textAnnotations[i].description+"</td>";
                    table += "</tr>";
                }
            }else{
                table+= "<tr><td>No text found</td></tr>";
            }
            
    
        table += "</table>";
        response.send(table); 
    };

    detectLandmark(path.join(__dirname+'/public/files/' + request.file.filename));
    
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});