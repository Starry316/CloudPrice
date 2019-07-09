const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  roleList: state => state.user.roleList,
  phone: state => state.user.phone,
  email: state => state.user.email,
  introduction: state => state.user.introduction,
  permission_routes: state => state.permission.routes,

}
export default getters
