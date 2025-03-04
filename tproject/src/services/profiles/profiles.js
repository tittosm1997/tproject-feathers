// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  profilesDataValidator,
  profilesPatchValidator,
  profilesQueryValidator,
  profilesResolver,
  profilesExternalResolver,
  profilesDataResolver,
  profilesPatchResolver,
  profilesQueryResolver
} from './profiles.schema.js'
import { ProfilesService, getOptions } from './profiles.class.js'
import { profilesPath, profilesMethods } from './profiles.shared.js'

export * from './profiles.class.js'
export * from './profiles.schema.js'

import crypto from 'crypto'
import mongoose from 'mongoose'
import multer from 'multer'
import GridFsStorage from 'multer-gridfs-storage'
import path from 'path';
import Grid from 'gridfs-stream'
import { MongoClient, GridFSBucket } from 'mongodb'
import jwt from 'jsonwebtoken';

// A configure function that registers the service and its hooks via `app.configure`
export const profiles = app => {
  // Register our service on the Feathers application
  app.use(profilesPath, new ProfilesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: profilesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(profilesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(profilesExternalResolver),
        schemaHooks.resolveResult(profilesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(profilesQueryValidator),
        schemaHooks.resolveQuery(profilesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(profilesDataValidator),
        schemaHooks.resolveData(profilesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(profilesPatchValidator),
        schemaHooks.resolveData(profilesPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })


  // MongoDB and Postgres setup
  const mongoURL = app.get('mongodb'); // MongoDB URL from Feathers app config

  const conn = mongoose.createConnection(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  let gfs;

  mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  conn.once('open', () => {
    console.log('MongoDB connected');
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('tprojectprofile'); // Set the GridFS collection name
    console.log('GridFS initialized');

  });


  const bucket = new GridFSBucket(conn, { bucketName: 'tprojectprofile' });


  const storage = new GridFsStorage.GridFsStorage({
    url: mongoURL,
    file: (req, file) => {


      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "tprojectprofile"
          };

          const token = req.headers && req.headers.authorization && req.headers.authorization.replace('Bearer ', '')

          const decoded = jwt.decode(token, { complete: true });
          if (decoded.payload.sub) {
            // console.log('User ID:', decoded.payload.sub);

          } else {
            console.log('User ID not found in the token payload.');
          }

          console.log('user id', decoded.payload.sub);


          const customquery = `UPDATE profiles SET "profileImage"= '${fileInfo.filename}' WHERE "userId"= ${decoded.payload.sub}`
          const knex = app.get('postgresqlClient')
          // console.log(knex);
          knex.raw(customquery).then((result) => {
          });

          try {

            resolve(fileInfo);
          } catch (err) {

            console.log(err);

          }
        });
      });
    }
  });

  const upload = multer({
    storage
  });

  app.post('/mongo-uploads', upload.single("file"), (req, res) => {

    return res.status(200).json({
      success: "Successfully uploaded"

    })

  });
  const findFileByFilename = async (filename) => {
    const client = await MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db();
    const filesCollection = db.collection('tprojectprofile.files');

    try {
      const file = await filesCollection.findOne({ filename: filename });
      if (!file) {
        console.log('No file found with filename:', filename);
      } else {
        console.log('File found:');
      }
      return file;
    } catch (err) {
      console.error('Error querying MongoDB directly:', err);
      throw err;
    } finally {
      await client.close();
    }
  };


  app.get("/mongo-files/:filename", async (req, res) => {
    const { filename } = req.params;

    try {

      // Find the file in GridFS
      const file = await findFileByFilename(filename);

      if (!file) {
        return res.status(404).json({ error: 'No file exists' });
      }

      // Set the content type of the response
      res.set('Content-Type', file.contentType);

      if (file.contentType === 'image/jpg' || file.contentType === 'image/png' || file.contentType === 'image/jpeg') {
        // Stream the file

        // const readstream = gfs.createReadStream({ file:file.filename  });

        const readstream = bucket.openDownloadStreamByName(file.filename);
        // console.log(readstream)
        // readstream.pipe(res);

        readstream.on('error', (err) => {
          console.error('Readstream error:', err);
          res.status(500).json({ error: 'Error reading file from GridFS' });
        });

        readstream.pipe(res).on('finish', () => {
          return new Promise((resolve, reject) => {
            const chunks = [];
            readstream.on('data', chunk => chunks.push(chunk));
            readstream.on('end', () => resolve(Buffer.concat(chunks)));
            readstream.on('error', error => {
              console.error(`Error while downloading file with ID ${id}: ${error.message}`);
              reject(error);
            });
          });
        }).on('error', (err) => {
          console.error('Error piping the response:', err);
          res.status(500).json({ error: 'Error piping the response' });
        });
      } else {
        res.status(404).json({ error: 'Not an image' });
      }

    } catch (err) {
      console.error('Error in GET /image:', err);
      res.status(500).json({ error: 'Internal server error' });
    }

  });

  app.post("/mongo-files/del/:id", async (req, res) => {
    try {
      const file = await gfs.files.findOne({ filename: req.params.id });
  
      if (file) {
        await bucket.delete(file._id);
          const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
        if (!token) {
          return res.status(401).send('Authorization token is required.');
        }
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded || !decoded.payload.sub) {
          return res.status(401).send('Invalid token or user not found.');
        }
        const userId = decoded.payload.sub;
        const knex = app.get('postgresqlClient');
        const customquery = `UPDATE profiles SET "profileImage" = '' WHERE "userId" = ${userId}`;
        await knex.raw(customquery);  
  
        res.status(200).send('Deleted successfully');
      } else {
        res.status(404).send('No file found');
      }
    } catch (err) {
      console.error("Error:", err);  // Log error for debugging
      res.status(500).send('Error deleting file: ' + err.message);  // Send error response
    }
  });

}
