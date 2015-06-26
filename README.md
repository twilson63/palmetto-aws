# Palmetto-aws

This is a PalmettoFlow adapter using AWS SNS and SQS as its pub/sub system. Using
SNS and SQS enables AWS Lambda to be leveraged as your backoffice services. Which
will make them very easy to manage and deploy.

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

## Contributing

pull requests are welcome

## Support
