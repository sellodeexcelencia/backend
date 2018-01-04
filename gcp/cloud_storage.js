// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict'

const Storage = require('@google-cloud/storage')
const config = require('../config.json')


const CLOUD_BUCKET = config.gcloud.CLOUD_BUCKET

const storage = Storage({
  projectId: config.gcloud.GCLOUD_PROJECT
})
const bucket = storage.bucket(CLOUD_BUCKET)


function generateUUID () {
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
  return uuid
}

// Returns the public, anonymously accessable URL to a given Cloud Storage
// object.
// The object's ACL has to be set to public read.
// [START public_url]
function getPublicUrl (filename) {
  // IF CLOUD_BUCKET has dots "." its a real domain, isn't neccessary https://storage.googleapis.com/
  if (CLOUD_BUCKET.indexOf('.') !== -1 && CLOUD_BUCKET.indexOf('.appspot.com') === -1) {
    return 'http://' + CLOUD_BUCKET + '/' + filename
  } else {
    return 'https://storage.googleapis.com/' + CLOUD_BUCKET + '/' + filename
  }
}
// [END public_url]

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START process]
function sendUploadToGCS (req, folder) {
  return new Promise((resolve, reject) => {
    if (!req.file) reject()

    var uuid = folder
    if (!folder) uuid = generateUUID()
    let extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'))
    const gcsname = uuid + '/' + req.file.originalname

    const file = bucket.file(gcsname)
    const stream = file.createWriteStream()

    stream.on('error', function (err) {
      req.file.cloudStorageError = err
      console.log(err)
      reject(err)
    })

    stream.on('finish', function () {
      req.file.cloudStorageObject = gcsname
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
      req.file.file_name = req.file.originalname
      req.file.folderId = uuid
      resolve(req)
    })

    stream.end(req.file.buffer)
  }) // return promise
}
// [END process]

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory and re-name to avoid
// conflicting with existing objects. This makes it straightforward to upload
// to Cloud Storage.
// [START multer]
//const Multer = require('multer')
//const multer = Multer({
//  inMemory: true,
//  fileSize: 5 * 1024 * 1024, // no larger than 5mb
//  rename: function (fieldname, filename) {
//    // generate a unique filename
//    return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
//  }
//})
// [END multer]

module.exports = {
  getPublicUrl: getPublicUrl,
  sendUploadToGCS: sendUploadToGCS,
//  multer: multer
}