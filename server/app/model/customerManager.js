'use strict';

/**
 * 客户
 * @param app
 * @returns {Model<Document> | Model<T>}
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const CustomerSchema = new Schema({
    name: { type: String }, // 机器名称
    describe: { type: String },
    domain: { type: String },
    server: { type: Schema.Types.ObjectId, ref: 'ServerNode' },
    serverVersion: { type: String },
    versionName: { type: String }, // 容器的版本
    containerName: { type: String }, // 容器名称
    port: { type: Number },
    hardwareResource: {}, // 硬件资源
    expiryDate: { type: Date },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    state: { type: Number, default: 1 }, // 状态 ，0 异常 1 正常，2 已关闭
  });
  return mongoose.model('Customer', CustomerSchema);
};
