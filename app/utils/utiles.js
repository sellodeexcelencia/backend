var Config = require('../../config.json')
var Errores = require('./errors.js')
var Permissions = require('./permissions.js')
var Jwt = require('jsonwebtoken')
var Crypto = require('crypto')
var Nodemailer = require('nodemailer')

module.exports = {
  // This one is used in development.
  unimplementedMethod: function () {
    return { info: 'Unimplemented Method' }
  },
  //
  informError: function (num) {
    return { error: Errores[num] }
  },
  // This one is used to validate input arguments.
  isPositiveInteger: function (num) {
    if (!num) return false
    num = parseInt(num)
    return num === 0 || ((num | 0) > 0 && num % 1 === 0)
  },
  // This one is used to validate input arguments.
  isArrayOfPositiveIntegers: function (array) {
    if (!Array.isArray(array) || array.length === 0) return false
    for (var i = 0; i < array.length; i++) {
      if (!this.isPositiveInteger(array[i])) return false
    }
    return true
  },
  // This one is used to validate input arguments.
  isTimeStamp: function (timestamp) {
    return (new Date(timestamp)).getTime() > 0
  },
  // This one is used to clean the data before a SQL query.
  filterSqlInjection: function (txt) {
    // TODO implement method
    return txt
  },
  // This one is used in the authorization controller.
  decode: function (token) {
    return Jwt.decode(token, Config.secret)
  },
  // This one is used in the authorization controller.
  sign: function (user) {    
    return Jwt.sign(user, Config.secret)
  },
  // This one is used in the authorization controller.
  createHmac: function (algorithm) {
    return Crypto.createHmac(algorithm, Config.secret)
  },
  authorize: function (token, permit) {
    return new Promise((resolve, reject) => {
      var Session = require('../models/session.js')
      var SessionModel = new Session()
      // Remove Bearer Basic or any other attribute
      if (token) {
        token = token.split(' ')
        token = token[token.length - 1]
      }
      SessionModel.getByParams({ token: token }).then((session) => {
        if (session.length !== 1) {
          if (permit === Permissions.NONE) resolve(true)
          throw this.informError(100)
        }

        var now = new Date()
        if (now > session[0].expires) throw this.informError(101)

        var user = this.decode(token)
        for (var i in user.permissions) {
          if (user.permissions[i] === permit) {
            resolve(user)
          }
        }
        if (permit === Permissions.NONE) resolve(user)
        else throw this.informError(100)
      }).catch((err) => { reject(err) })
    })
  },
  sendEmail: function (to, cc, bcc, subject, body, attachment) {
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        if(!to){
          reject("no receipt")
        }
        var transporter = Nodemailer.createTransport( Config.smtp )
        var mailOptions = {
          from: Config.smtp.from, // sender address
          to: to, // list of receivers
          cc: cc,
          bcc: bcc,
          subject: subject, // Subject line
          html: body // plaintext body
        }
        //send Mail
        // send mail with defined transport object
        console.log('sending mail')
        console.log(mailOptions)
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
          }
          resolve()
        })
      },100)
    })
  },
  writeExcelFile: function(data){
    let dmt = require('../../public/admin/translate.js');
    var d = []
    data.forEach(function(item){
      let row = []
      let titles = []
      for(let i in item){
        if(i.indexOf('id_') == 0){
          continue
        }
        if(i.indexOf('motives') == 0){
          continue
        }
        if(item['current_status'] === 5 && i.indexOf('rate') === 0 && i.indexOf('is_active')){
          continue
        }
        if(i.indexOf('current_status') == 0){
          continue
        }
        if(i.indexOf('history') == 0){
          continue
        }
        titles.push(dmt.translate.es[i] || i)
        if(typeof item[i] === 'object'){
          if(item[i] instanceof Date){
            row.push(item[i])
          }else{
            if(item[i] instanceof Array){
              let val = []
              for(var j = 0 ; j < item[i].length ; j++){
                let v =item[i][j] ? item[i][j].name || item[i][j].text || item[i][j].description || '' : ''
                v += item[i][j].user_type ? ': '+item[i][j].user_type.name : ''
                if(v != ''){
                  val.push(v) 
                }
              }
              row.push(val.join(", "))
            }else{
              let val = item[i] ? item[i].name || item[i].text || item[i].description || '' : ''
              row.push(val)  
            }
            
          }
        }else{
          if(item[i] === 0){
            row.push(0)
          }else{
            row.push(item[i] || '')
          }
        }
      }
      if(d.length==0){
        d.push(titles)
      }
      d.push(row)
    })
    let XLSX = require("xlsx")
    let wopts = { bookType:'xlsx', type:'buffer' }
    let sheet = XLSX.utils.aoa_to_sheet(d)
    let workbook = {SheetNames:['Hoja 1'],Sheets:{'Hoja 1':sheet}}
    /*workbook.Props = {
      Title: "SheetJS Test",
      Subject: "Tests",
      Author: "Devs at SheetJS",
      Manager: "Sheet Manager",
      Company: "SheetJS",
      Category: "Experimentation",
      Keywords: "Test",
      Comments: "Nothing to say here",
      LastAuthor: "Not SheetJS",
      CreatedDate: new Date()
    }*/
    let r =  XLSX.write(workbook,wopts)
    return r
  },
  parseExcelFile: function (filename) {
    function charArray(charA, charZ) {
      var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0)
      for (; i <= j; ++i) {
        a.push(String.fromCharCode(i))
      }
      return a
    }
    function getRange(position) {
      var c = ""
      var r = ""
      for (let i = 0; i < position.length; i++) {
        if (isNaN(Number.parseInt(position.charAt(i)))) {
          c += position.charAt(i)
        } else {
          r = Number.parseInt(position.substring(i))
          break
        }
      }
      return { c: c, r: r }
    }
    var XLSX = require("xlsx")
    var workbook = XLSX.readFile(filename)
    var sheet_name_list = workbook.SheetNames
    let col_names = []
    let data = []
    /* iterate through sheets */
    sheet_name_list.forEach(function (y) {
      var worksheet = workbook.Sheets[y]
      var range = worksheet["!ref"].split(":")
      var init = getRange(range[0])
      var end = getRange(range[1])
      var cols = charArray(init.c, end.c)
      for (let r = init.r; r <= end.r; r++) {
        if (r == 1) {
          for (let i in cols) {
            let c = cols[i]
            col_names.push(worksheet[c + r].w)
          }
        } else {
          let d = {}
          for (let i in cols) {
            let c = cols[i]
            if (worksheet[c + r] === undefined) {
              continue
            }
            d[col_names[i]] = worksheet[c + r].w
          }
          data.push(d)
        }
      }
    })
    return { col_names: col_names, data: data }
  },
  uploadFileToGCS : function (folder, file, owner, type) {
    return new Promise((resolve, reject) => {
      console.log('saving image')
      var fs = require('fs')
      let now = new Date()
      let destdir = __dirname + '/../../public'
      let fname= '/uploads/'
      fname += now.getTime()
      console.log('fname := '+fname)
      if(file.path.lastIndexOf('.') > -1){
        fname += file.path.substring(file.path.lastIndexOf('.'))
        console.log('fname with extension:= '+fname)
      }
      const source = fs.createReadStream(file.path)
      const dest = fs.createWriteStream(destdir+fname)
      source.on('end', ()=>{
        resolve(fname)
      });
      source.on('error', reject)
      source.pipe(dest)
    })
    var google_cloud_storage = require('../../gcp/cloud_storage.js')
    var fs = require('fs')
		if (file.name == '') {
			file.name = "NO_NAME";
		}
		let read_file = fs.readFileSync(file.path);
		let req = {
			file: {
				fieldname: type,
				originalname: file.name,
				mimetype: file.type,
				buffer: read_file,
				size: file.size,
			}
		}
		let promise = google_cloud_storage.sendUploadToGCS(req)
		return promise.then((media) => {
			return media.file.cloudStoragePublicUrl
		})
  },
  uploadFilesToGCS : function (folder, files, owner) {
    let i = 0
    const length = files.length

    if (i<length){
      uploadFileToGCS(folder,files[i],owner,files[i].type).then((current_file)=>{
        if (current_file.file && current_file.file.cloudStoragePublicUrl && i<length) {
          uploadFilesToGCS(folder,files.shift(),owner)
        }
      })
    } else {

    }

    
  },
  JSONToCSVConvertor : function(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    //this will remove the blank-spaces from the title and replace it with an underscore
    var fileName = ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    //var link = document.createElement("a");    
    //link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    //link.style = "visibility:hidden";
    //link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    //document.body.appendChild(link);
    //link.click();
    //document.body.removeChild(link);
    return CSV
  }
}
