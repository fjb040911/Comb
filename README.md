# Comb
## 在为客户提供SaaS应用的时候你也许会有如下需求
1. 为不同客户分配不同的子域名。<br> 例如:<br>客户A使用 https://a.domain.com , <br>客户B使用 https://b.domain.com , <br>... ,<br> 客户N使用 https://n.domain.com
2. 服务端为客户A和客户B（客户N）提供完全相互独立，物理隔离的应用
3. 基于上面一点，特殊定制某个客户的需求，并不影响其他客户
4. 迭代升级可以灰度升级
5. 升级和回退版本都直观安全
6. 监控每个客户系统资源状况
7. 新增或者修改客户二级域名代理时，不会中断对外服务（不重启Nginx）

### 简单讲每个二级域名请求可被直接代理到内网服务器集群中的指定容器和端口上
### 架构拓扑图如下所示
![alt 架构和拓扑图](https://github.com/fjb040911/Comb/blob/master/docImgs/jg.png)

## 快速开始
### 注意，开始搭建此架构前，你需要具备如下条件
1. 一个可用域名，映射到一台服务器（以下称这台服务器为 Comb Server）的公网IP上
2. 集群中的所有机器都已经安装了Docker([docs](https://docs.docker.com/install/linux/docker-ce/ubuntu/))
3. Comb Server需要安装Docker Compose ([docs](https://docs.docker.com/compose/install/))
4. Comb Server需要安装并启动MongoDB

### 搭建步骤
Step1 -- 搭建 Ceryx 服务
```
git clone https://github.com/fjb040911/Comb.git
cd Comb
docker-compose up -d
```
此时会在 Comb Server 服务器上启动一个由 Nginx+lua+redis 组成的高性能动态域名代理服务。

Step2 -- 搭建动态域名代理管理和服务节点容器管理的API服务
```
cd Comb/server
npm install
npm start
or 
npm run dev
```
注： Comb/client 是一个简单直观的Demo

Step3 -- 内网集群中的节点机器上部署容器管理服务
```
git clone https://github.com/fjb040911/serviceNode.git
cd serviceNode
npm install
npm start
```
访问内网的节点机器的7777端口API，可以管理这台机器上面的服务容器。包括：获取服务版本，创建服务容器，升级、停止、继续运行、删除某个容器等操作

Step4 -- release你的软件版本
在节点机器上
```
docker build -t gs:version
```
## Comb Server管理API
### 新增一个服务器节点
```
POST /api/server/add
data = {
 ip, // 集群内网ip，必填
 name, // 机器名称，选填
 describe, // 对机器的描述
}
```
### 查询所有的服务节点
```
GET /api/server/list
```
### 删除一台服务节点
```
GET /api/server/:id/delete
```
### 查询客户列表（集群内部的容器列表）
```
POST /api/cust/list

```
### 新增客户。会在指定的服务器上创建客户信息，并且生成外网的动态代理
```
POST /api/cust/add
data = {
  name, // 客户名称
  describe, // 客户描述信息
  domain, // 要访问客户的服务容器时候的二级域名。例如：打算用 https://abc.domain.com 访问到该用户的服务，这个值就填 abc
  serverVersion, // 客户的服务使用的版本的id
  versionName, // 客户的服务使用的版本的tag名称
}
```
### 启停客户的服务容器
```
GET /api/cust/:custId/server/:action
custId: 客户信息的_id
action: 要对容器执行的动作，stop 暂停， start 开始运行

```
### 升级服务器
例如release了新版本，现在要把其中某些客户的服务版本升级。内部是生成一个新版本的容器，再把Nginx的动态代理修改到新容器上，停止删除旧容器。
所以升级的过程中服务并不会中断，客户的体验是平滑无缝切换到新版本
```
POST /api/cust/:custId/server/upgrade
custId: 客户信息的_id
data = {
  serverVersion,
  versionName
}
```
