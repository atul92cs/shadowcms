var express = require('express');
var bodyparser = require('body-parser');
var mysql=require('mysql');

var db=mysql.createConnection( {host:'trial.cpaoqpenaokn.us-east-2.rds.amazonaws.com',
	  user:'admin',
	  password:'savita92',
database:'shadowtrial'});

db.connect((error)=>{
    if(error)throw error;
	
	console.log('Database connected');
});

var port=process.env.PORT||8080;

var app = express();
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.post('/',function(req,res){
	res.send('App works');
});
app.get('/getAppointments/:vetid',function(req,res){
    /*code to show vet appointments*/
       var id=req.params.vetid;      
	  let sql= 'SELECT * FROM vet_booking WHERE vet_id=?';
      let query=db.query(sql,[id],function(err,rows,fields){
		   if(!err)
		   {
			   var response=[];
			   if(rows.length!=0)
			   {
				   for(var i=0;i<rows.length;i++)
                  {   
				   var bookingid=rows[i].booking_id;
				   var name=rows[i].user_name;
				   var contact=rows[i].user_contact;
				   var date=rows[i].booking_date;
			         response.push({bookingid,name,contact,date});
				 }
				 
				 
			   }
			   else
			   {
				   response.push({'response':'no data found'});
			   }
			   res.json({response});
		   }
		   else
		   {
			   res.status(404).send('error occured');
			 
		   }
	  });	  
	
});
app.post('/bookAppointment',function(req,res){
	
	   var bookingId=req.body.id;
	   var name=req.body.name;
	   var contact=req.body.contact;
	   var date=req.body.date;
	   var time=req.body.time;
	   var vetId=req.body.vet_id;
	   var cost=req.body.cost;
	   var remark=req.body.remark;
	   let body={booking_id:bookingId,user_name:name,user_contact:contact,booking_date:date,booking_time:time,vet_id:vetId,cost:cost,remark:remark};
        let sql='INSERT INTO vet_appointment SET ?';
		let query=db.query(sql,body,(err,result)=>
		{
			if(err)throw err;
			res.send('Appointment Booked');
		});
	   });

app.listen(port,function(){
      console.log('app started on port 8080');
  });