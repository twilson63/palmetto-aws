var AWS = require('aws-sdk')

var sns = new AWS.SNS({ region: 'us-east-1'})
var sqs = new AWS.SQS({ region: 'us-east-1'})

var EventEmitter = require('events').EventEmitter
var ee = new EventEmitter()

module.exports = function (config) {
  if (!config.topic) throw new Error('topic arn required!')
  if (!config.queue) throw new Error('queue name required!')

  // subscribe
  var params = {
    QueueUrl: config.queue,
    WaitTimeSeconds: 2
  }
  sqs.receiveMessage(params, handleMessage)

  function handleMessage (err, data) {
    //console.log('received message')
    //console.log('data')
    if (err) return console.log(err)
    console.log(data)
    if (data.Messages) {
      var main = data.Messages[0]
      var body = JSON.parse(main.Body)
      sqs.deleteMessage({
        QueueUrl: config.queue,
        ReceiptHandle: main.ReceiptHandle
      }, function (e, v) {
        if (!e) {
          console.log(body)
          if (body.to) { ee.emit(body.to, body) }
        }
        sqs.receiveMessage(params, handleMessage)
      })
      return
    }
    sqs.receiveMessage(params, handleMessage)
  }
  // publish
  ee.on('send', function (event) {
    event.queue = config.queue
    sns.publish({
      TopicArn: config.topic,
      Message: JSON.stringify(event)
    }, function (err, res) {
      if (err) return console.log(JSON.stringify(err))
      console.log(res)
    })
  })
  //
  return ee
}
