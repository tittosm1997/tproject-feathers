// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { UploadsService, getOptions } from './uploads.class.js';
import { uploadsPath, uploadsMethods } from './uploads.shared.js';

export * from './uploads.class.js';
export * from './uploads.schema.js';

import multer from 'multer';
import path from 'path';
import * as filesys from 'fs';

// A configure function that registers the service and its hooks via `app.configure`
export const uploads = app => {
  // Register our service on the Feathers application
  app.use(uploadsPath, new UploadsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: uploadsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  });

// Folder Uploads

  app.use('/finduploads/:file', (req, res) => {

    if (req.method === 'GET') {
      // eslint-disable-next-line no-undef
      const __dirname = process.cwd();
      const UPLOADS_FOLDER = `${path.join(__dirname, '/public/bg_uploads')}`;
      const id = req.params.file;
      if (!id) {
        return res.status(400).send({ success: false, message: 'File ID is required' });
      }
      let FileUrl = '';
      filesys.readdirSync(UPLOADS_FOLDER).forEach(file => {

        if (file == id) {
          FileUrl = `/bg_uploads/${file}`;
        }
      });
      if (FileUrl) {
        // eslint-disable-next-line no-undef
        res.send({ success: true, message: 'FileUrl URL found', url: `${process.env.BASE_API_URL}${FileUrl}` });
      } else {
        res.send({ success: true, message: 'File Not found', url: null });
      }
    }
    else {
      res.status(404).send({
        'name': 'NotFound',
        'message': 'Page not found',
        'code': 404,
        'className': 'not-found'
      });
    }
  });

  //Upload starts
  // eslint-disable-next-line no-undef
  const __dirname = process.cwd();

  // Configure Multer to save uploaded files in the 'uploads' folder
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '/public/bg_uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Use the original file name
    },
  });

  const upload = multer({ storage });

  const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).send({ error: 'Access token not found' });
    }

    // Assuming your token is available in req.feathers.authentication.accessToken
    app.service('authentication').verifyAccessToken(req.feathers.authentication.accessToken)
      .then(payload => {

        // Token is valid, proceed to next middleware (Multer)
        let customquery = '';
        if (req.method == 'DELETE') {
          customquery = `UPDATE profiles SET "profileImage"= '' WHERE "userId"= ${payload.sub}`;
          const knex = app.get('postgresqlClient');
          knex.raw(customquery).then(() => {
          });
        } 
        req.userid = payload.sub; 
        next();
      })
      .catch(error => {
        console.log(error);
        
        // Invalid or expired token
        res.status(401).send({ error: 'Invalid or expired token' });
      });
  };

  // Route for uploading files
  app.post('/postuploads', verifyToken, upload.single('file'), (req, res) => {

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    let customquery = `UPDATE profiles SET "profileImage"= '${req.file.originalname}' WHERE "userId"= ${req.userid}`;

    const knex = app.get('postgresqlClient');
    knex.raw(customquery).then(() => {
    });

    res.send({ 'Success': 'File uploaded successfully' });
  });


  app.delete('/deleteuploads/:file', verifyToken, (req, res) => {
    const filePath = path.join(__dirname, '/public/bg_uploads', req.params.file);

    // Check if the file exists
    filesys.exists(filePath, (exists) => {
      if (!exists) {
        return res.status(404).send({ error: 'File not found' });
      }

      // Delete the file
      filesys.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).send({ error: 'Failed to delete the file' });
        }

        // Return success message
        res.send({ success: `File ${req.params.file} deleted successfully` });
      });
    });
  });


};
