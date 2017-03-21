var express = require('express');
var router = express.Router();
var engine = require('../engine');
var authenticate=require('../authenticate')
var generateID=require('../generateSession')
const config = require('../config');


function log(m,req){
	console.log(req.connection.remoteAddress,m);
}

router.post('/', function (req, res, next) {
  if(req.body.fieldlist){
	log("GETFIELDS",req); 
	var appid=req.body.appid;	
	var uid=req.body.userid;	
	const sessId = generateID();
    authenticate({id:uid,directory:"WINDOWS10"},sessId).then(()=>{
      return engine.getFields( {
        cookie:config.cookieName+"=" +sessId	+ '; Path=/; HttpOnly; Secure',
		appId: appid,
      })
    }).then((lst)=>{
      res.cookie(config.cookieName, sessId, { expires: 0, httpOnly: true });
      res.status(200).send(lst)
    }).catch((err)=>{
		res.status(500).send(err)
		}
	)  
  }
  else	
  if(req.body.doclist){
	log("GETAPPS",req);  
	var uid=req.body.userid;	
	const sessId = generateID();
    authenticate({id:uid,directory:"WINDOWS10"},sessId).then(()=>{
      return engine.getApps( {
        cookie:config.cookieName+"=" +sessId	+ '; Path=/; HttpOnly; Secure'
      })
    }).then((lst)=>{
      res.cookie(config.cookieName, sessId, { expires: 0, httpOnly: true });
      res.status(200).send(lst)
    }).catch((err)=>{
		res.status(500).send(err)
		}
	)    
  }
  else
  if(req.body.clear){
	log("CLEAR",req);  
    var appid=req.body.appid;
    var uid=req.body.userid;
    const sessId = generateID();
    authenticate({id:uid,directory:"WINDOWS10"},sessId).then(()=>{
      return engine.clearAll( {
        cookie:config.cookieName+"=" +sessId	+ '; Path=/; HttpOnly; Secure',
        appId: appid,
      })
    }).then(()=>{
      res.cookie(config.cookieName, sessId, { expires: 0, httpOnly: true });
      res.status(200).send({appid:appid})
    }).catch((err)=>{
		res.status(500).send(err)
		}
	)  
  }
  else
  if(req.body.field && req.body.value) {
	log("SET",req); 
    const sessId = generateID();
    authenticate({id:req.body.userid,directory:"WINDOWS10"},sessId).then(()=>{
      return engine.setSelection( {
        cookie:config.cookieName+"=" +sessId	+ '; Path=/; HttpOnly; Secure',
        appId: req.body.appid,
        fieldName: req.body.field,
        value: req.body.value
      })
    }).then(()=>{
      res.cookie(config.cookieName, sessId, { expires: 0, httpOnly: true });
      res.status(200).send({appid:req.body.appid})
    }).catch((err)=>{
		res.status(500).send(err)
		}
	)  
  }
  else{
	log("NADA",req); 
    res.status(200).send({})
  }
});

module.exports = router;
