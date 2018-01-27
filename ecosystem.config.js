module.exports = {
  apps: [{
    name: 'OrderAPI',
    script: 'order.js',
    instances: 'max',
    exec_mode: 'cluster',
  },
  {
    name: 'MailAPI',
    script: 'mail.js',
    instances: 'max',
    exec_mode: 'cluster',
  },
  {
    name: 'InvoiceAPI',
    script: 'invoice.js',
    instances: 'max',
    exec_mode: 'cluster',
  },
  {
    name: "SmsAPI",
    script: 'sms.js',
    instances: 'max',
    exec_mode: 'cluster',
  }]
}
