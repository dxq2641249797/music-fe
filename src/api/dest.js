// 引入axios
import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: 'localhost', // api的base_url  Vue项目可以根据 process.env.BASE_API，React可以在这里定义
  timeout: 50000, // 请求超时时间
  withCredentials: true, // 跨域携带cookie
  xsrfCookieName: 'xsrf-token'  //当创建实例的时候配置默认配置
})  


// 添加请求拦截器，这里面可以配置一下每次请求都需要携带的参数，比如 token，timestamp等等，根据项目自己配置
service.interceptors.request.use(
  function(config) {
    // 每次请求带上token和用户编号
    // if (store.getters.token) {
    // config.headers['Token'] = getToken()
    // config.headers['Authorization'] = store.getters.userId
    // }
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // 每次请求带上时间戳 防刷处理
    if (config.method === 'get' || config.method === 'delete') {
      config.params = {
        ...config.params,
        timestamp: Date.parse(new Date()) / 1000
      }
    } else if (config.method === 'post' || config.method === 'put') {
      config.data = {
        ...config.data,
        timestamp: Date.parse(new Date()) / 1000
      }
    } else {
      config.data = {
        ...config.data,
        timestamp: Date.parse(new Date()) / 1000
      }
    }
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)


// 添加响应拦截器 ，这里的 response是接收服务器返回后的结果，也可以在这里做一些状态判断
service.interceptors.response.use(
  response => {
    /**
     * 判断服务器请求是否成功
     * @method if
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    if (response.status !== 200) {
      return Promise.reject(new Error('网络异常，请稍后重试'))
    }
    const res = response.data
    if (res.success) {
      return res
    }
  },
  error => {
    return Promise.reject(error)
  }
)
// 提供axios给外部调用
const base = {
  success(response, startTime, method, silence = false) {
    const data = response.body;
    const errno = data.meta.code;
    // eslint-disable-next-line no-underscore-dangle
    if (errno === 0) {
      return data.data || {};
    }
    if (errno === -13) {
      // 用户未登陆 跳转
      // loginOut();
      // window.location.reload();
    }
    if (!silence) {
      // Vue.prototype.$Notice.config({
      //   top: 80,
      // });
      // Vue.prototype.$Notice.error({
      //   title: i18n.t('common.errorTitle'),
      //   desc: msg,
      // });
    }
    return new Promise((resolve, reject) => {
      reject(data);
    });
  },
  error(err, silence = false) {
    if (err.status !== 0) {
      if (!silence) {
        // Vue.prototype.$Notice.config({
        //   top: 80,
        // });
        // Vue.prototype.$Notice.error({
        //   title: i18n.t('common.errorTitle'),
        //   desc: i18n.t('common.errorDesc'),
        // });
      }
    }
    return new Promise((resolve, reject) => {
      reject(err);
    });
  },
  get(url, options = {}) {
    const startTime = new Date().getTime();
    return service.get(url, options)
      .then(response => this.success(response, startTime, 'get', options.silence), err => this.error(err, options.silence));
  },
  post(url, body, options = {}) {
    const startTime = new Date().getTime();
    return service.post(url, body, options)
      .then(response => this.success(response, startTime, 'post', options.silence), err => this.error(err, options.silence));
  },
  put(url, body, options = {}) {
    const startTime = new Date().getTime();
    return service.put(url, body, options)
      .then(response => this.success(response, startTime, 'put', options.silence), err => this.error(err, options.silence));
  },
  delete(url, options = {}) {
    const startTime = new Date().getTime();
    return service.delete(url, options)
      .then(response => this.success(response, startTime, 'delete', options.silence), err => this.error(err, options.silence));
  },
}

export default base
