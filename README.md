## argo-flow启动

### 一、需要提前安装的软件以及工具

#### yarn，stern，node16+，go1.18，可开启build-kit版本的docker（这里使用的是docker19）

### 二、启动步骤

#### 1.将源码克隆到$(GOPATH)/src/github.com/argoproj/目录，并修改项目文件夹名字为argo-workflows

argoworkflow的源码只有放置到该目录才能正常启动，且代码默认需要寻找的kube-api的地址是localhost:6443，所以建议将代码克隆的kubernets集群的master节点上，这样无需对代码进行改动

#### 2.在kubernets的master节点设置映射

编辑/etc/hosts文件，将以下内容复制进去

127.0.0.1 dex
127.0.0.1 minio
127.0.0.1 postgres
127.0.0.1 mysql

#### 3.安装前端依赖

进入到根目录/ui目录执行：

yarn config set ignore-engines true

yarn install

```
若项目依赖拉取出现错误可执行尝试几次如下操作并重新yarn install
$  yarn cache clean
$  yarn --update-checksums
```

若仍拉取错误，可执行

```
yarn config set registry https://registry.npm.taobao.org
yarn config list
yarn install
```

#### 4.修改项目使得项目可以使用ip访问

```
$ 依赖安装好后修改node_modules/webpack-dev-server/lib/Server.js 将checkHost方法的返回值改为true（因版本不同，可能该函数会调用别的函数，总之将最终的真正调用的返回值修改即可
```



#### 5.启动

进入项目的根目录，执行以下命令启动程序：

首次启动执行这个： make start API=true UI=true PROFILE=mysql

非首次执行执行这个：make start API=true UI=true PROFILE=mysql FIRST_RUN=false

启动后可以访问主页即为启动成功，但此时并未启动完全，仍需要执行下面的第四步

#### 4.开启可提交工作流功能

在可以访问argoflow主页后，并不能直接提交工作流，还需要进行跑镜像的过程，才可以开启功能

这里有a/b两种选择：

a.执行我已经制作好的镜像文件：

​    下载百度云地址：

​    链接:https://pan.baidu.com/s/1eT8Fz8tWq2eKiMGrRoXUFA 
​    提取码:6jzs

​    下载后执行

​    docker load --input argoexec.tar

b.自己重新执打镜像：

​    在项目根目录执行：

​    make argoexec-image（注意该命令必须要求docker开启了buildkit功能，且虚拟机硬盘要足够大，不然回出现镜像分阶段构建出现上层镜像自动删除的情况。）



