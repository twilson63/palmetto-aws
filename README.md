# Palmetto-aws

This is a PalmettoFlow adapter using AWS SNS and SQS as its pub/sub system. Using
SNS and SQS enables AWS Lambda to be leveraged as your back office services. Which
will make them very easy to manage and deploy.

## AWS Lambda

This is perfect for AWS Lambda backoffice services, because you can trigger Lambda
functions from SNS, and you lambda message can write to SQS. Using Amazon DynamoDb
is the best storage option, but you can use publicly accessible data sources, like
https://cloudant.com/, https://www.firebase.com/, or https://redislabs.com

## Getting Started

You will first want to setup a SNS Topic and a SQS Queue, both of these need to
have permissions that enables the IAM ACCESS User of this adapter to SNS `publish`,
SQS `receiveMessage` and SQS `deleteMessage`.

If you are having trouble post an issue to the repository.

## AWS Credentials

You will want to make sure your application is setup to pass the aws credentials
to the adapter, this can happen several different ways:

http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html

## Usage

This adapter is mainly for clients or components not services, you would use the
palmetto-aws-lambda repo to create services that work with this adapter.

``` js
var palmetto = require('@twilson63/palmetto-aws')
var uuid = require('uuid')
var ee = palmetto({
  topic: 'arn:aws:sns:us-east-1:[acct]:[topic]',
  queue: 'https://sqs.us-east-1.amazonaws.com/[acct]/rxnorm-svc'
})
var uid = uuid.v4()
ee.on(uid, function (event) {
  console.log(event)
})

ee.emit('send', {
  to: 'service',
  from: uid,
  subject: 'myservice',
  verb: 'create',
  object: { foo: 'bar' }
})
```

## Create Topic and Queue

``` js
var AWS = require('aws-sdk')

var sns = new AWS.SNS({ region: 'us-east-1'})
var sqs = new AWS.SQS({ region: 'us-east-1'})

sns.createTopic({ Name: '[topic]' }, function (err, res) {
  if (err) return console.log(err)
  console.log(res)
})

sqs.createQueue({ QueueName: '[queue]'}, function (err, res) {
  if (err) return console.log(err)
  console.log(res)
})
```

## Delete Topic and Queue

Removing Topic and Queue

``` js
var AWS = require('aws-sdk')

var sns = new AWS.SNS({ region: 'us-east-1'})
var sqs = new AWS.SQS({ region: 'us-east-1'})


sqs.deleteQueue({ QueueUrl: 'https://sqs.us-east-1.amazonaws.com/[acct]/[queue]'}, function (err, res) {
  console.log(err)
  console.log(res)
})


sns.deleteTopic({ TopicArn: 'arn:aws:sns:us-east-1:[acct]:[topic]'}, function (err, res) {
  console.log(res)

})
```

## Contributing

pull requests are welcome

## Support
