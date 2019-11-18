'use strict';

/**
 * 组织
 * @param app
 * @returns {Model<Document> | Model<T>}
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ServerSchema = new Schema({
    name: { type: String }, // 机器名称
    ip: { type: String, index: true },
    describe: { type: String },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    state: { type: Number, default: 1 }, // 状态 ， 1 正常，0 失败， -1 检测中
  });
  return mongoose.model('ServerNode', ServerSchema);
};
