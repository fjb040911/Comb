# Comb
## 在为客户提供SaaS应用的时候你也许会有如下需求
1. 为不同客户分配不同的子域名。<br> 例如:<br>客户A使用 https://a.domain.com , <br>客户B使用 https://b.domain.com , <br>... ,<br> 客户N使用 https://n.domain.com
2. 服务端为客户A和客户B（客户N）提供完全相互独立，物理隔离的应用
3. 基于上面一点，特殊定制某个客户的需求，并不影响其他客户
4. 迭代升级可以灰度升级
5. 升级和回退版本都直观安全
6. 监控每个客户系统资源状况
7. 新增或者修改客户二级域名代理时，不会中断对外服务（不重启Nginx）

### 架构拓扑图如下所示
![alt 架构和拓扑图](https://github.com/fjb040911/Comb/blob/master/docImgs/jg.png)

## 快速开始
### 注意，开始搭建此架构前，你需要具备如下条件
1. 一个可用域名，映射到一台服务器（以下称这台服务器为 Comb Server）的公网IP上
2. 集群中的所有机器都已经安装了Docker([docs](https://docs.docker.com/install/linux/docker-ce/ubuntu/))
3. Comb Server需要安装Docker Compose ([docs](https://docs.docker.com/compose/install/))
4. Comb Server需要安装并启动MongoDB

### 搭建步骤
Step1
```
git clone https://github.com/fjb040911/Comb.git
cd Comb
docker-compose up -d
```
