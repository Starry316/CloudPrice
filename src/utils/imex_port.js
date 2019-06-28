/* 读取部分的操作start */
/*FileReader共有4种读取方法：
1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
2.readAsBinaryString(file)：将文件读取为二进制字符串
3.readAsDataURL(file)：将文件读取为Data URL
4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'*/

var wb;//读取完成的数据
var rABS = false; //是否将文件读取为二进制字符串

//文件流转BinaryString
function fixdata(data) {
  var o = "",
    l = 0,
    w = 10240;
  for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
  return o;
}

//导入
function importfun(obj,callback) {
  if(!obj.files) {
    return;
  }
  var f = obj.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var data = e.target.result;
    if(rABS) {
      wb = XLSX.read(btoa(fixdata(data)), {//手动转化
        type: 'base64'
      });
    } else {
      wb = XLSX.read(data, {
        type: 'binary'
      });
    }
    //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
    //wb.Sheets[Sheet名]获取第一个Sheet的数据
    callback(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]))
  };
  if(rABS) {
    reader.readAsArrayBuffer(f);
  } else {
    reader.readAsBinaryString(f);
  }
}

/* 读取部分的操作end */

/* 导出部分的操作start */

var tmpDown; //导出的二进制对象
function downloadExl(obj,json,callback,type) {
  var tmpdata = json[0];
  json.unshift({});
  var keyMap = []; //获取keys
  //keyMap =Object.keys(json[0]);
  for (var k in tmpdata) {
    keyMap.push(k);
    json[0][k] = k;
  }
  var tmpdata = [];//用来保存转换好的json
  json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
    v: v[k],
    position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
  }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
    v: v.v
  });
  var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
  var tmpWB = {
    SheetNames: ['mySheet'], //保存的表标题
    Sheets: {
      'mySheet': Object.assign({},
        tmpdata, //内容
        {
          '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
        })
    }
  };
  tmpDown = new Blob([s2ab(XLSX.write(tmpWB,
    {bookType: (type == undefined ? 'xlsx':type),bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
  ))], {
    type: ""
  }); //创建二进制对象写入转换好的字节流
  var href = URL.createObjectURL(tmpDown); //创建对象超链接
  obj.dom.href = href; //绑定a标签
  obj.dom.download = obj.filename;// 下载的文件名
  callback();
  setTimeout(function() { //延时释放
    URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
  }, 100);
}

//字符串转字符流
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

// 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
function getCharCol(n) {
  let temCol = '',
    s = '',
    m = 0
  while (n > 0) {
    m = n % 26 + 1
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
}


/* 导出部分的操作end */

/* 这是导入导出公用的方法 */
// 将最后返回的数据按照自己定义的字段进行格式化
function formatfun(res,obj,callback) {
  var result = [];// 将返回的结果经过格式化后返回
  for(var i=0;i<res.length;i++) {
    // 外层循环，遍历所有的数据
    var result_json = {};// 每一次的外层循环进行一次置空
    for(var j=0;j<obj.format.length;j++) {
      // 内层循环将Excel中的标题替换为相应的字段
      var old = obj.format[j].old;
      var _new = obj.format[j].new;
      result_json[_new] = res[i][old];
    }
    result.push(result_json)
  }
  callback(result)
}



var imExPortPlugin = {
  "import":function (obj) {
    importfun(obj.dom,function (res) {
      // console.log(res)
      formatfun(res,obj,function (data) {
        obj.success(data);// 返回最终结果
      })
    })
  },
  "export":function (obj) {
    var jsono = obj.data;// 需要导出的数据
    formatfun(jsono,obj,function (res) {
      // 转化格式成功
      // res为转化格式后的数组
      downloadExl(obj,res,function () {
        // 下载成功
        obj.success()
      })
    })
  }
}


export function importObj(obj) {
  importfun(obj.dom,function (res) {
    // console.log(res)
    formatfun(res,obj,function (data) {
      obj.success(data);// 返回最终结果
    })
  })
}
export function exportObj(obj) {
  var jsono = obj.data;// 需要导出的数据
  formatfun(jsono,obj,function (res) {
    // 转化格式成功
    // res为转化格式后的数组
    downloadExl(obj,res,function () {
      // 下载成功
      obj.success(res)
    })
  })
}
