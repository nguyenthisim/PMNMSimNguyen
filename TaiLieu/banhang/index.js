var express = require("express");
var app= express();
app.use(express.static("public"));
app.set("view engine","ejs");
var path = require('path');
var server = require("http").Server(app);
var io = require("socket.io")(server);


var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
app.set("views","./views");
app.listen(3000);
var pg= require("pg");
var config={
	user:'postgres',
	database:'banhang',
	password:'35351335',
	host:'localhost',
	port:5432,
	max:10,
	idleTimeoutMillis:3000,
};

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage }).single('uploadfile');


var pool = new pg.Pool(config);

var numUsers = 0;
var mangUsers=[];

/*
io.on("connection",function(socket){

	socket.on("client-send-Username",function(data){
		if(mangUsers.indexOf(data)>=0){
			socket.emit("server-send-dki-thatbai");
		}else{
			mangUsers.push(data);
			socket.Username=data;
			socket.emit("server-send-dki-thanhcong",data);
			//io.socket.emit("server-send-danhsach-Users",mangUsers);

		}
	});

	socket.on("logout",function(){
		mangUsers.splice(mangUsers.indexOf(socket.Username),1);
		io.broadcast.emit("server-send-danhsach-Users",mangUsers);
	});

	socket.on("user-send-message",function(data){
		io.socket.emit("server-send-message",{un:socket.Username,nd:data});
	});

});

*/
io.on('connection', function(socket){
	 console.log('user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
app.get("/",function(req,res){
	pool.connect(function(err,client,done){
	if(err){
		return console.log('error');
	}
	client.query('select * from video',function(err, result){
		done();
		if(err){
			res.end();
			return console.log('err on runnign query',err);
		}
		res.render("home",{data:result});
	});
});
	
});

app.get("/video/list",function(req,res){
	pool.connect(function(err,client,done){
	if(err){
		return console.log('error');
	}
	client.query('select * from video',function(err, result){
		done();
		if(err){
			res.end();
			return console.log('err on runnign query',err);
		}
		res.render("list",{data:result});
	});
});
});
app.get("/video/delete/:id",function(req,res){
	pool.connect(function(err,client,done){
	if(err){
		return console.log('error');
	}
	client.query('delete from video where id='+req.params.id,function(err, result){
		done();
		if(err){
			res.end();
			return console.log('err on runnign query',err);
		}
		res.redirect("../list");
	});
});
});
app.get("/video/add",function(req,res){
	res.render("add");
});
app.post("/video/add",urlencodedParser,function(req,res){
	upload(req, res, function (err) {
    if (err) {
          res.send("loi");
    } else{
    	if(req.file==undefined){
    		res.send("File chua duoc chon!");
    	}else{
    		pool.connect(function(err,client,done){
			if(err){
				return console.log('error');
			}
			var sqlinsert="insert into video (id,tieude,mota,key,image) values('"+req.body.id+"','"+req.body.tieude+"','"+req.body.mota+"','"+req.body.key+"','"+req.file.originalname+"')";
			client.query(sqlinsert,function(err, result){
				done();
				if(err){
					res.end();
					return console.log('err on runnign query',err);
				}
				res.redirect("./list");
			});
		});
    	}
    }
 })
  });
app.get("/video/edit/:id",function(req,res){
	var id= req.params.id;
	pool.connect(function(err,client,done){
	if(err){
		return console.log('error');
	}
	client.query('select * from video where id='+id,function(err, result){
		done();
		if(err){
			res.end();
			return console.log('err on runnign query',err);
		}
		res.render("edit",{data:result.rows[0]});
	});
});
});
app.post("/video/edit/:id",urlencodedParser,function(req,res){
	var id= req.params.id;
	upload(req, res, function (err) {
    if (err) {
          res.send("loi upload");
    } else{
    	if(typeof(req.file)=='undefined'){
    		pool.connect(function(err,client,done){
			if(err){
				return console.log('error');
			}
			client.query("update video set tieude='"+req.body.tieude+"',mota='"+req.body.mota+"',key='"+req.body.key+"' where id="+id ,function(err, result){
				done();
				if(err){
					res.end();
					return console.log('err on runnign query',err);
				}
				res.redirect("../list");
			});
		});
    	}else{
    		pool.connect(function(err,client,done){
			if(err){
				return console.log('error client from pool');
			}
			client.query("update video set tieude='"+req.body.tieude+"',mota='"+req.body.mota+"',key='"+req.body.key+"',image='"+req.file.originalname+"' where id="+id ,function(err, result){
				done();
				if(err){
					res.end();
					return console.log('err on runnign query',err);
				}
				res.redirect("../list");
			});
		});
    	}
    }
 })
  });
app.get("/login",function(req,res){
	res.render("login");
});

app.get("/login/:name",function(req,res){
	var name= req.params.name;
	pool.connect(function(err,client,done){
	if(err){
		return console.log('error');
	}
	client.query('select * from quantri where name='+name,function(err, result){
		done();
		if(err){
			res.end();
			return console.log('err on runnign query',err);
		}
		res.redirect("../list");
	});
});
});

app.get("/tintuc/listtintuc",function(req,res){
	pool.connect(function(err,client,done){
	if(err){
		return console.log('error');
	}
	client.query('select * from tintuc',function(err, result){
		done();
		if(err){
			res.end();
			return console.log('err on runnign query',err);
		}
		res.render("listtintuc",{data:result});
	});
});
});
app.get("/tintuc/add",function(req,res){
	res.render("addnews");
});

app.post("/tintuc/add",urlencodedParser,function(req,res){
	upload(req, res, function (err) {
    if (err) {
          res.send("loi");
    } else{
    	if(req.file==undefined){
    		res.send("File chua duoc chon!");
    	}else{
    		pool.connect(function(err,client,done){
			if(err){
				return console.log('error');
			}
			var sqlinsert="insert into tintuc (id,tacgia,tieude,noidung,hinhanh) values('"+req.body.id+"','"+req.body.tacgia+"','"+req.body.tieude+"','"+req.body.noidung+"','"+req.file.originalname+"')";
			client.query(sqlinsert,function(err, result){
				done();
				if(err){
					res.end();
					return console.log('err on runnign query',err);
				}
				res.redirect("./listtintuc");
			});
		});
    	}
    }
 })
  });
app.get("/tintuc/delete/:id",function(req,res){
	pool.connect(function(err,client,done){
	if(err){
		return console.log('error');
	}
	client.query('delete from tintuc where id='+req.params.id,function(err, result){
		done();
		if(err){
			res.end();
			return console.log('err on runnign query',err);
		}
		res.redirect("../listtintuc");
	});
});
});


app.get("/tintuc/edit/:id",function(req,res){
	var id= req.params.id;
	pool.connect(function(err,client,done){
	if(err){
		return console.log('error');
	}
	client.query('select * from tintuc where id='+id,function(err, result){
		done();
		if(err){
			res.end();
			return console.log('err on runnign query',err);
		}
		res.render("editnews",{data:result.rows[0]});
	});
});
});
app.post("/tintuc/edit/:id",urlencodedParser,function(req,res){
	var id= req.params.id;
	upload(req, res, function (err) {
    if (err) {
          res.send("loi upload");
    } else{
    	if(typeof(req.file)=='undefined'){
    		pool.connect(function(err,client,done){
			if(err){
				return console.log('error');
			}
			client.query("update tintuc set tacgia='"+req.body.tacgia+"',tieude='"+req.body.tieude+"',noidung='"+req.body.noidung+"',hinhanh='"+req.body.hinhanh+"' where id="+id ,function(err, result){
				done();
				if(err){
					res.end();
					return console.log('err on runnign query',err);
				}
				res.redirect("../listtintuc");
			});
		});
    	}else{
    		pool.connect(function(err,client,done){
			if(err){
				return console.log('error client from pool');
			}
			client.query("update tintuc set tacgia='"+req.body.tacgia+"',tieude='"+req.body.tieude+"',noidung='"+req.body.noidung+"',hinhanh='"+req.file.originalname+"' where id="+id ,function(err, result){
				done();
				if(err){
					res.end();
					return console.log('err on runnign query',err);
				}
				res.redirect("../listtintuc");
			});
		});
    	}
    }
 })
  });

app.get("/cusnews",function(req,res){
	pool.connect(function(err,client,done){
	if(err){
		return console.log('error');
	}
	client.query('select * from tintuc',function(err, result){
		done();
		if(err){
			res.end();
			return console.log('err on runnign query',err);
		}
		res.render("cusnews",{data:result});
	});
});
});
app.get("/info",function(req,res){
	pool.connect(function(err,client,done){
	if(err){
		return console.log('error');
	}
	client.query('select * from canhan',function(err, result){
		done();
		if(err){
			res.end();
			return console.log('err on runnign query',err);
		}
		res.render("info",{data:result});
	});
});
});
