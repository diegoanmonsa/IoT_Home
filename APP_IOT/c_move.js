AWS.config.region = 'us-east-2'; // Region
AWS.config.credentials = new AWS.Credentials('AKIAIIJSX36YXAFMTD2A', 'KBDM4WCox9HtqmBCwsbJiDGGHRsLTOzY/wABRsFY');
var dynamodb3 = new AWS.DynamoDB();
var params3 = { 
                TableName: 'IoT_Home_Movement',
                KeyConditionExpression: '#id = :iottopic',
                ExpressionAttributeNames: {
                  "#id": "deviceid",
                },
                ExpressionAttributeValues: {
                  ":iottopic": { "S" : "Movement"},
                }
             };  
var context = document.querySelector("#movement").getContext('2d');
context.beginPath();
context.strokeStyle="black";
context.arc(16, 16, 15, 0, 2 * Math.PI, false);
context.fill();
context.stroke();
context.closePath();
context.fillStyle = "green";

$(function() {
  getData3();
  $.ajaxSetup({ cache: false });
  setInterval(getData3, 5000);
});

function getData3() {
  dynamodb3.query(params3, function(err, data) {
    if (err) {
      console.log(err);
      return null;
    } else {
    	for (var i in data['Items']) {
        // read the values from the dynamodb JSON packet
        m = parseFloat(data['Items'][i]['payload']['M']['Movement']['N']);
        }
        if (m > 0) {
			context.beginPath();
			context.strokeStyle="black";
			context.arc(16, 16, 15, 0, 2 * Math.PI, false);
			context.fill();
			context.stroke();
			context.closePath();
          	context.fillStyle = "red";
        } else{
			context.beginPath();
			context.strokeStyle="black";
			context.arc(16, 16, 15, 0, 2 * Math.PI, false);
			context.fill();
			context.stroke();
			context.closePath();
        	context.fillStyle = "green";
        }
    }
  });	
}

