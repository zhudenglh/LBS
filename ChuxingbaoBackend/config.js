// 阿里云配置
module.exports = {
  // OSS 配置
  oss: {
    region: 'oss-cn-hangzhou',
    accessKeyId: 'LTAI5tFvCkVVVvAQy7u28H7u',
    accessKeySecret: 'o2XyJ5XczqDQhB0fvyWHv2gwrpiy6s',
    bucket: 'chuxingbao-new'
  },

  // Tablestore 配置
  tablestore: {
    accessKeyId: 'LTAI5tFvCkVVVvAQy7u28H7u',
    accessKeySecret: 'o2XyJ5XczqDQhB0fvyWHv2gwrpiy6s',
    endpoint: 'https://chuxingbao-new.cn-hangzhou.ots.aliyuncs.com',
    instanceName: 'chuxingbao-new',
    tableName: 'posts'
  },

  // 服务器配置
  server: {
    port: 3000
  }
};
