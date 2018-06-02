AWS.config.region = 'us-east-2'; // Region
AWS.config.credentials = new AWS.Credentials('AKIAIIJSX36YXAFMTD2A', 'KBDM4WCox9HtqmBCwsbJiDGGHRsLTOzY/wABRsFY');
var dynamodb2 = new AWS.DynamoDB();
var datumVal2 = new Date() - 86400000;
var params2 = { 
                TableName: 'IoT_Home_Gas',
                KeyConditionExpression: '#id = :iottopic and #ts >= :datum',
                ExpressionAttributeNames: {
                  "#id": "deviceid",
                  "#ts": "Time"
                },
                ExpressionAttributeValues: {
                  ":iottopic": { "S" : "Gas"},
                  ":datum": { "S" : datumVal2.toString()}
                }
             };     
/* Create the context for applying the chart to the HTML canvas */
var gctx = $("#gasgraph").get(0).getContext("2d");
/* Set the options for our chart */
var options = { 
                responsive: true,
                showLines: true,
                scales: {
                  xAxes: [{
                    display: false
                  }],
                  yAxes: [{
                    ticks: {
                      beginAtZero:true
                    }
                  }]
                } 
              };
/* Set the inital data */
var ginit = {
  labels: [],
  datasets: [
    {
        label: "Gas Metano PPM",
        backgroundColor: 'rgba(204,229,255,0.5)',
        borderColor: 'rgba(153,204,255,0.75)',
        data: []
    }
  ]
};
var gasgraph = new Chart.Line(gctx, {data: ginit, options: options});
$(function() {
  getData2();
  $.ajaxSetup({ cache: false });
  setInterval(getData2, 10000);
});
/* Makes a scan of the DynamoDB table to set a data object for the chart */
function getData2() {
  dynamodb2.query(params2, function(err, data) {
    if (err) {
      console.log(err);
      return null;
    } else {
// placeholders for the data arrays
      var gasValues = [];
      var labelValues = [];
// placeholders for the data read
      var gasRead = 0.0;
      var timeRead = "";
// placeholders for the high/low markers
      var gasHigh = -999.0;
      var gasLow = 999.0;
      var gasHighTime = "";
      var gasLowTime = "";
for (var i in data['Items']) {
        // read the values from the dynamodb JSON packet
        gasRead = parseFloat(data['Items'][i]['payload']['M']['Gas']['N']);
        //timeRead = new Date(data['Items'][i]['payload']['M']['datetime']['S']);
// check the read values for high/low watermarks
        if (gasRead < gasLow) {
          gasLow = gasRead;
          gasLowTime = timeRead;
        }
        if (gasRead > gasHigh) {
          gasHigh = gasRead;
          gasHighTime = timeRead;
        }
// append the read data to the data arrays
        gasValues.push(gasRead);
        labelValues.push(timeRead);
      }
// set the chart object data and label arrays
      gasgraph.data.labels = labelValues;
      gasgraph.data.datasets[0].data = gasValues;
// redraw the graph canvas
      gasgraph.update();
// update the high/low watermark sections
      $('#g-high').text(Number(gasHigh).toFixed(2).toString() + ' PPM' + gasHighTime);
      $('#g-low').text(Number(gasLow).toFixed(2).toString() + ' PPM' + gasLowTime);
}
  });
}
