## argo-flow启动

### 一、需要提前安装的软件以及工具

#### yarn

需要执行yarn config set ignore-engines true

#### stern

#### go1.18

#### 可开启build-kit版本的docker（这里使用的是docker19）

### 二、启动步骤

#### 1.将源码克隆到$(GOPATH)/src/github.com/argoproj/argo-workflows目录

argo-flow的源码只有放置到该目录才能正常启动，且代码默认需要寻找的kube-api的地址是localhost:6443，所以建议将代码克隆的kubernets集群的master节点上，这样无需对代码进行改动

#### 2.在kubernets的master节点设置映射

编辑/etc/hosts文件，将以下内容复制进去

127.0.0.1 dex
127.0.0.1 minio
127.0.0.1 postgres
127.0.0.1 mysql

#### 3.启动

进入的克隆好的项目的根目录，执行以下命令启动程序

首次启动执行这个： make start API=true UI=true PROFILE=mysql

非首次执行执行这个：make start API=true UI=true PROFILE=mysql FIRST_RUN=false

启动后可以访问主页即为启动成功，但此时并未启动完全，仍需要执行下面的第四步

#### 4.提交工作流

在可以访问argoflow主页后，并不能直接提交工作流，还需要进行跑镜像的过程，才可以开启功能

在项目根目录执行以下命令

make argoexec-image

注意该命令必须要求docker开启了buildkit功能，且虚拟机硬盘要足够大，不然回出现镜像分阶段构建出现上层镜像自动删除的情况。

