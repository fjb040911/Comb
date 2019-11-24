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
此时会在 Comb Server 服务器上启动一个由 Nginx+lua+redis 组成的动态域名代理服务。

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
