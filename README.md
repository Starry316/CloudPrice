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

# 接口 /api
## 用户信息接口 /account

### 注册
```
/register
POST
Request: 
{
    email:      String 非空
    username:   String 以英文字母或汉字开头（其余可以是英文、汉字、数字），一个汉字算2个字符，长度共 4-16  
    password:   String 长度 8-16，必须同时包含数字、字母
    code:       String 非空
}

```
### 登录
```
/login
POST
Request: 
{
	username : string,
	password : string
}
Response : 
{
    除 password 外，所有数据库中属性的键值对 
}

```
### 注销
```
/logout
POST
Response : 

```
### 获取用户身份

```
/role
GET

Response : 
{
	role: 用户身份
}

```

### 修改密码
```
/modifyPassword
POST
Request: 
{
	originPassword : string,
	newPassword : string
}

```
### 修改个人信息
```
/modifyProfile
POST
Request: 
{
	introduction : string,
	phone : string
}
```
## 云服务模块接口 /cloud
### 获取当前服务器列表
```
/list/{page}
GET
Response : 
{
  list: [ Server ], 服务器列表
}
	
Server
{
  id: int, 
  location: string, 机房位置
  type: string,  型号
  os: string, 操作系统
}
```
### 获取可用型号，机房信息
```
/serverInfo
GET
Response :
{
  typeList: [ string ] 目前有的服务器型号列表
  serverRoomList: [ string ] 目前可用的机房列表
}

```
### 待定 获取历史服务器价格和预测价格 
```
/price
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
  timeData:[date]  只要月日不要年
}

	
```
### 预测价格（暂停用，与历史价格合并）
```
/cloud/predict
POST
Request:

Response:

```
## 待定 管理员用户管理模块接口
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


