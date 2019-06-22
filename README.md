## 实训前端
基于vue-admin-template搭建

目录说明
  - mock/ 用于接口测试 可以先不看
  - public/ 静态资源 不用看
  - src
    - api/ 接口请求方法 配置请求url 方法等``
    - assets/ 资源文件
    - components/ 公用组件 不用管
    - layout/ 页面框架 不用管
    - router/ 路由跳转配置 写完页面后，在这里配置路由跳转 
    - store/ vuex相关存储 存储用户登录信息等
    - utils/ 一些工具js 不用管
    - views/ 主要页面 本次项目需要的实际页面都放在这里

1. 需要安装node.js和npm  
https://nodejs.org/en/download/
2. 推荐使用 WebStorm IDE  
用山大学生邮箱验证可以免费使用
3. 项目结构看上去很复杂但实际上需要看一看的就是views，api和router目录下的内容
4. 有不懂的问我就可以

# 接口
## 用户信息接口
### 注册
```
/user/signup
POST
Request: 
{
	username : string,
	password : string,
	introduction : string 个人介绍
	avatar : string 头像url
}
Response : 
{
	token : "userToken"	
}
```
### 登录
```
/user/login
POST
Request: 
{
	username : string,
	password : string
}
Response : 
{
	token : "userToken"	
}
```
### 注销
```
/user/logout
POST
Response : 

```
### 获取用户信息
先登录获取token 再用token获取用户信息
```
/user/info
GET
Request : 
{
	token: string
}
Response : 
{
	role: 用户身份
	introduction : string 个人介绍
	avatar : string 头像url
	name : string 用户名
}

```
### 修改密码
```
/user/modifyPassword
POST
Request: 
{
	originPassword : string,
	newPassword : string
}
Response : 
{
	token : "userToken"	
}
```
### 修改个人信息
```
/user/modifyProfile
POST
Request: 
{
	introduction : string,
	//todo 其他数据
}
Response : 
{
	token : "userToken"	
}
```


## 云服务模块接口
### 获取当前服务器列表
```
/cloud/list/{page}
GET

Response : 
{
  list: [ Server ], 服务器列表
  typeList: [ string ] 目前有的服务器型号列表
  serverRoomList: [ string ] 目前可用的机房列表
}
	
Server
{
  id: int, 
  serverRoom: string, 机房位置
  type: string,  型号
  os: string, 操作系统
}
```


### 获取历史服务器价格和预测价格
```
/cloud/price
GET
Request : 
{
  start_time:date
  end_time:date
  sever_type:string,服务器型号
  sever_room:string,服务器机房
  os:string,操作系统
}

Response : 
{
  expectedData：[double]
  actualData：[double]
}

	
```
### 预测价格（暂停用，与历史价格合并）
```
/cloud/predict
POST
Request:

Response:

```
## 管理员用户管理模块接口
### 获取用户列表
需要管理员权限
```
/manager/userlist
GET
Request:

Response:
{
	list : 
	[
		User
	]
}

User
{
	uid: int
	name: string
	role: int
}
```


