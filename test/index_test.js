var QUEUE = 'https://sqs.us-east-1.amazonaws.com/[acct]/[queue]'
var TOPIC = 'arn:aws:sns:us-east-1:[acct]:[topic]'
var uuid = require('uuid')
var rewire = require('rewire')

var test = require('tap').test


var palmetto = rewire('../')
var ee = palmetto({
  topic: TOPIC,
  queue: QUEUE
})

test('create a new topic', function () {

  palmetto.__set__('AWS', {
    SNS: SNS,
    SQS: SQS
  })

  var uid = uuid.v4()

  ee.on(uid, function (event) {
    console.log('successfully created topic')
    t.ok(true)
    t.end()
  })

  setTimeout(function() {
    ee.emit('send', {
      to: 'topic',
      from: uid,
      subject: 'newTopic',
      verb: 'create',
      object: {
        foo: 'bar'
      }
    })
  }, 1000)

  function SNS (o)  {
    t.equals(o.region, 'us-east-1')
  }

  SNS.prototype.publish = function (params, cb) {
    cb(null, true)
  }

  function SQS (o) {
    t.equals(o.region, 'us-east-1')
  }

  SQS.prototype.receiveMessage = function (params, cb) {
    console.log(params)
    cb(null, { Messages: [{ Body: JSON.stringify({ok: true }) }]})
  }

  SQS.prototype.deleteMessage = function (params, cb) {
    cb(null)
  }

})
