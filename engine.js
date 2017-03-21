const enigma = require('enigma.js');
const qixSchema = require('./node_modules/enigma.js/schemas/qix/3.1/schema.json');
const WebSocket = require("ws");
const promise = require('q');
const configuration = require('./config');
const fs=require('fs');

function getConfig(cook){
return {
    schema: qixSchema,
    session: {
        host: configuration.hostname,
		unsecure:true
    },
    createSocket: (url) => {
        return new WebSocket(url, {
			rejectUnauthorized: false,
            ca: fs.readFileSync(configuration.certificates.root),
            cert: fs.readFileSync(configuration.certificates.client),
            key: fs.readFileSync(configuration.certificates.client_key),
            headers: {
				Cookie: cook
            }
        });
    }
}
}
function unique(a) {
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i].qName === a[j].qName)
                a.splice(j--, 1);
        }
    }
    return a;
};

function getFields(options) {
    return new Promise(function (resolve, reject) {
        enigma.getService('qix', getConfig(options.cookie)).then((qix) => {
            const g = qix.global;
            var curApp;
            g.openDoc(options.appId).then(app => {
				curApp = app;
				return app.getTablesAndKeys({"qcx": 1000,"qcy": 1000},{"qcx": 0,"qcy": 0},30, false, false)
                }
			).then(function(rep){
				var fields=[];
				rep.qtr.map(function(el){return fields=fields.concat(el.qFields)})
				fields=unique(fields);
				resolve(fields);
				}
			).catch((err)=>{
				console.log("ERROR on getfield", err);
				reject(err);
				}
			)
        })
    });
}

function getApps(options) {
    return new Promise(function (resolve, reject) {
        enigma.getService('qix', getConfig(options.cookie)).then((qix) => {
            const g = qix.global;
            g.getDocList().then(lst => {
				resolve(lst);
            }
            );
        }).catch((err)=>{
			console.log("ERROR on getapps", err);
			reject(err);
			}
			)
    });
}

function setSelection(options) {
    return new Promise(function (resolve, reject) {
        enigma.getService('qix', getConfig(options.cookie)).then((qix) => {
            const g = qix.global;
            var curApp;
            g.openDoc(options.appId).then(app => {
                    curApp = app;
					return app.abortModal(true);
                }
			).then(()=>{
					curApp.clearAll();
                    return curApp.getField(options.fieldName);
				}
			).then((field) => {
                   return field.select(options.value,false,true);
                }
            ).then(()=> {
                    curApp.session.close();
                    resolve();
                }
            ).catch((err)=>{
				console.log("ERROR on selection", err);
				reject(err);
				}
			);
        })
    });
}
function clearAll(options) {
	 return new Promise(function (resolve, reject) {
        enigma.getService('qix', getConfig(options.cookie)).then((qix) => {
            const g = qix.global;
            var curApp;
           g.openDoc(options.appId).then(app => {
                    curApp = app;
					return app.abortModal(true);
                }
			).then(()=>{
				return curApp.clearAll();
				}
			).then(()=> {
                    curApp.session.close();
                    resolve();
                }
            ).catch((err)=>{
				console.log("ERROR on clearall", err);
				reject(err);
				}
			);
        })
    });
}


module.exports = {
    setSelection: setSelection,
	getApps:getApps,
	getFields: getFields,
    clearAll: clearAll
};
