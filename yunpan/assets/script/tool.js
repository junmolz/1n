// 根据指定的id，拿到数据中对应id的那个文件的数据。
function getItemDataById(data,Id) {
  var target = null;
    for (var i = 0; i < data.length; i++) {
      if(data[i].id === Id){
       target = data[i];
       target['index'] = i;
       return target;
      }
      if(!target && data[i].children&&data[i].children.length){
        target = getItemDataById(data[i].children,Id);
      }
    }

  return target;
}
// 根据指定的id找到这个数据它自己以及它所有的祖先数据
function getAllParentsById(data,Id) {
  var parents = [];
  var parentsId = [];
  var current = getItemDataById(data,Id);
  parents.push(current);
  parentsId.push(current.id);
  while(current.pId != undefined){
    current = getItemDataById(files,current.pId);
    parents.push(current);
    parentsId.push(current.id);
  }
  return {parents,parentsId};
}


// 删除数组任意位置元素
arrDel = function arrDel(arr,loc){
	    if(!arr.length) return;
	    var ret = arr[0];
	    for(var i=loc; i<arr.length; i++){
	    arr[i] = arr[i + 1];
    }
      arr.length--;
      return ret;
    }
//**********************************************************

//鼠标画框

function mouseBox(e){
  e.preventDefault();
  if(pan.creataFloderCheck) return;
  if (e.target!=content) {
    return;
  }
  var x = e.pageX, y = e.pageY;

  var div = document.createElement('div');
  div.style.left = x+'px';
  div.style.top = y+'px';
  // 此处将新创建的div放到了鼠标光标下，所以鼠标up事件对象不再是content
  div.style.position = 'absolute';
  div.style.width = 0;
  div.style.height = 0;
  div.style.backgroundColor = 'rgba(53, 143, 226, 0.35)';
  div.style.border = '1px solid #3b8cff';
  document.body.appendChild(div);
  document.onmousemove = function(e) {
     div.style.left = x>e.pageX? e.pageX+'px':x+'px';
     div.style.top = y>e.pageY? e.pageY+'px':y+'px';
     div.style.width = Math.abs(x - e.pageX) + 'px';
     div.style.height =  Math.abs(y - e.pageY) + 'px';
     // 判断有哪些文件夹被选中
     var target = content.children;
     for (var i = 0; i < target.length; i++) {
       if (duang(div,target[i])) {
         target[i].children[0].classList.add('active');
         target[i].classList.add('active');
         target[i].select = true;
       }else{
         target[i].children[0].classList.remove('active');
         target[i].classList.remove('active');
         target[i].select = false;
       }
     }
  }
  document.onmouseup = function(e) {
     document.onmousemove = document.onmouseup = null;
     document.body.removeChild(div);
     checkSelect();
  }

}
function duang(ele,target){
      var eleRect = ele.getBoundingClientRect();
      var targetRect = target.getBoundingClientRect();
      return eleRect.top <= targetRect.bottom&&eleRect.bottom >= targetRect.top&&eleRect.left <= targetRect.right&&eleRect.right >= targetRect.left;
    }



//**********************************************************
// 自定义滚动条
function customScroll(doc,scroll) {
  var docScrollH = doc.scrollHeight;
  var docClientH = doc.clientHeight;
  var docTop = doc.offsetTop;
  var scale = Math.min(docClientH/docScrollH,1);
  // 关闭最底下那层目录时底部会空出一片空格，要将doc的位置调整到合适点
  if(docClientH - docTop >= docScrollH){
    doc.style.top = docClientH - docScrollH + 'px';
  }

  if (scale>=1) {
    scroll.style.display = 'none';
  }else{
    scroll.style.display = '';
  }
  var differ, T;
  scroll.n = 0;scroll.i = 0;

  scroll.speed = docClientH *(1-scale)*scale/2;
  if (scale>0.7) {
    scroll.speed = docClientH *(1-scale);
  }
  scroll.style.height = docClientH * scale + 'px';
  mouseWheel(doc,  function up(){
      doc.animation = window.requestAnimationFrame(up);
      scrollAnimation('-1');
      scrollMove();
    }, function down() {
      doc.animation = window.requestAnimationFrame(down);
      scrollAnimation('1')

      scrollMove();
      });

  scroll.onmousedown = function (e) {
    e.preventDefault();
    differ = e.pageY - scroll.getBoundingClientRect().top;
    document.onmousemove = function(e){
      e.preventDefault();
      T = e.pageY - scroll.parentNode.getBoundingClientRect().top - differ;
      scrollMove();
    };
    document.onmouseup = function(){
      document.onmousemove = document.onmouseup = null;
    }
  }
  function scrollMove() {
    var scale = doc.clientHeight/doc.scrollHeight;
    T = T <= 0 ? 0 : T;
    T = T >= scroll.parentNode.clientHeight - scroll.offsetHeight? scroll.parentNode.clientHeight - scroll.offsetHeight : T;

    var scaleY = T/(scroll.parentNode.clientHeight*(1 - scale));
    doc.T = -1 * (doc.scrollHeight*(1 - scale))*scaleY;

    scroll.style.top = T + 'px';
    doc.style.top = doc.T + 'px';
    // console.log(scroll.n);

  }
  function scrollAnimation(dir) {
    T = scroll.offsetTop +2*dir;
    scroll.n = scroll.n +2*dir;

    if(scroll.n*dir >= scroll.speed){
      scroll.n = 0;

      window.cancelAnimationFrame(doc.animation);
      doc.animation = null;
    }
  }

}
function mouseWheel(ele, fnUp, fnDown){
  if(window.navigator.userAgent.indexOf('Firefox') != -1){
    ele.addEventListener('DOMMouseScroll', fn);
  }else{
    ele.addEventListener('mousewheel', fn);
  }
  window.cancelAnimationFrame(ele.animation);
  function fn(e){
    if(ele.animation) return;
    var dir;

    if(e.detail){
      dir = e.detail < 0 ? true : false;
    }

    if(e.wheelDelta){
      dir = e.wheelDelta > 0 ? true : false;
    }
    if(dir){
      fnUp && fnUp.call(ele);
    }else{
      fnDown && fnDown.call(ele);
    }

  }
}



//**********************************************************
//文件夹文件的相关


// 判断文件夹名是否可用
function checkName(newName,pId,data) {
  pId = pId * 1;

  var parent = getItemDataById(data,pId);

    for (var i = 0; i < parent.children.length; i++) {

      if(newName === parent.children[i].name){
        return false;
      }
    }

  return true;
}
// 自动生成不重复的文件名
function createName(name,pId,data) {
  var i = 0,newName = '';
  var count = name.indexOf('(');
  var num = name.substr(count+1,1)*1;
  if (count>-1 && typeof num ==='number') {
    name = name.substring(0, count);
    i = num;
  }
  newName = name;
  while(!checkName(newName,pId,data)){
    newName = `${name}(${++i})`;
  }
  return newName;
}
// 选中文件夹
function select(e) {
  if(pan.creataFloderCheck){
    if (e.target.classList.contains('text')) {
      e.target.focus();
    }
    return;
  }

   if (e.target.nodeName==='SPAN') {
      e.target.parentNode.classList.toggle('active');
      e.target.classList.toggle('active');
      e.target.parentNode.select = e.target.parentNode.select?false:true;
   }

   checkSelect();
}
// 检测是否有文件夹被选中
function checkSelect(){
  if(!content.children.length) return;
  var menuMany = document.querySelector('.menu-many');
  var myEquip = document.querySelector('.myEquip');
  var offLine = document.querySelector('.off-line');
  var count = 0;
  for (var i = 0; i < content.children.length; i++) {
    if (content.children[i].select) {
      count++;
    }
  }
  if (count<content.children.length) {
    pan.selectAll.innerHTML = '';
    if (count) {
      pan.selectAll.nextElementSibling.innerHTML = `已选择${count}个文件/文件夹`;
    }else{
      pan.selectAll.nextElementSibling.innerHTML = `全选`;
    }
  }else{
    pan.selectAll.innerHTML = '✔';
    pan.selectAll.nextElementSibling.innerHTML = `全选`;
  }
  if (count) {
    pan.selectFloderCheck = true;
    menuMany.style.display = 'block';
    myEquip.style.display = offLine.style.display = 'none';

  }else{
    pan.selectFloderCheck = false;
    menuMany.style.display = '';
    myEquip.style.display = offLine.style.display = '';
  }
}

// 找出被选中的文件夹或文件夹
function haveSelected(content) {
  var selectArr = [];
  var count = 0;
  for (var i = 0; i < content.children.length; i++) {
    if (content.children[i].select) {
      selectArr.push(content.children[i]);
    }
  }
  return selectArr;
}
//选中所有文件夹
function doSelected(content) {
  for (var i = 0; i < content.children.length; i++) {
    content.children[i].select = true;
    content.children[i].classList.add('active');
    content.children[i].firstElementChild.classList.add('active');
  }
  checkSelect();
}

//取消所有选中
function cancelSelected(content) {
  for (var i = 0; i < content.children.length; i++) {
    content.children[i].select = false;
    content.children[i].classList.remove('active');
    content.children[i].firstElementChild.classList.remove('active');
  }
  // 还原菜单栏
  restoreMenu();
}
// 新建或者重命名
function createRename(condition,current) {
  if(pan.creataFloderCheck){
     return;
  }
  pan.creataFloderCheck = true;
  var div = document.createElement('div');
  var pId = conment.lastElementChild.id;

  var parents = getItemDataById(files,pId*1);
  if (condition ==='create') {
    var divInfo = {};
    div.innerHTML = `<span>✔</span>
                      <div class="name"></div>
                      <div class="rename">
                        <input type="text" class="text" value = ''>
                        <a class = "a0">✔</a>
                        <a class = "a1">✘</a>
                      </div>`;
      div.classList.add('folder-wrap');
      content.insertBefore(div,content.firstElementChild);
     // 新建文件夹需要的
      div.id = data.maxId++;
      divInfo['id'] = div.id*1;
      divInfo['pId'] = pId*1;
      divInfo['floder'] = 'floder';
      divInfo['children'] = [];
      var name = div.querySelector('.name');
      floderContextmenu(div);

  }else{
    div.innerHTML  = `<input type="text" class="text" value = ''>
                      <a class = "a0">✔</a>
                      <a class = "a1">✘</a>`;
    div.classList.add('rename');
    current[0].appendChild(div);
    var name = current[0].querySelector('.name');
    var self = getItemDataById(files,current[0].id*1);
  }
    var text = div.querySelector('.text');
    var as = div.querySelectorAll('a');

    text.focus();
    as[0].onclick = function(e){
      e.stopPropagation();
      var check = checkName(text.value,pId,files);
      if (condition ==='rename'&&name.innerHTML == text.value) {
        check = true;
      }
      if(check){

        if (condition ==='create'){

          popUp('新建文件夹成功',check);
        }else{
          popUp('重命名成功',check);
          if(text.value){
            parents.children[self.index].name = text.value;
          }
        }

      }else{
        popUp('命名冲突，请重新输入',check);
        return;
      }

      if(text.value){
        name.innerHTML = text.value;
      }else{
        if (condition ==='create'){
          name.innerHTML = createName('新建文件夹', pId,files);
        }
      }
      pan.creataFloderCheck = false;
      if (condition ==='create'){
        div.removeChild(this.parentNode);
        divInfo['name'] = name.innerHTML;
        parents.children.unshift(divInfo);
      }else{
        current[0].removeChild(div);
      }
      // 存进本地存储
      localStorage1();
      conment.firstElementChild.firstElementChild.innerHTML = content.children.length + '';
    }
    as[1].onclick = function(e){
      e.stopPropagation();

      pan.creataFloderCheck = false;
      if (condition ==='create'){
        content.removeChild(div);
      }else{
        current[0].removeChild(div);
      }
    }
}
// 还原菜单栏
function restoreMenu() {
  var menuMany = document.querySelector('.menu-many');
  var myEquip = document.querySelector('.myEquip');
  var offLine = document.querySelector('.off-line');
  pan.selectAll.innerHTML = '';
  pan.selectAll.nextElementSibling.innerHTML = `全选`;
  menuMany.style.display = '';
  myEquip.style.display = offLine.style.display = '';
}
//**********************************************************
// 提示弹窗1
function popUp(content,condition) {
  var popBox = document.querySelector('.pop-up');
  popBox.style.top = '0px';
  if(!condition){
    popBox.style.backgroundColor = 'rgb(203, 51, 51)';
  }else{
    popBox.style.backgroundColor = '';
  }
  popBox.innerHTML = content;
  setTimeout("document.querySelector('.pop-up').style.top = '-40px'",900);
}
// 提示弹窗2
function popUp2(fn1,fn2) {
  var popBox = document.querySelector('.pop-up1');

  var kids = popBox.children;
  popBox.style.top = '0px';
  kids[1].onclick = function() {
    if(typeof fn1 ==='function'){
      fn1();
    }
    popBox.style.top = '';
  }
  kids[2].onclick = function() {
    if(typeof fn2 ==='function'){
      fn2();
    }
    popBox.style.top = '';
  }

}

// 点击拖拽
function clickMove(ele) {
  if (ele.onmousedown) {
    return;
  }
  ele.onmousedown = function(e) {
    // e.stopPropagation();
    e.preventDefault();
    ele.style.zIndex = 9;
    var boxX =e.pageX - ele.parentNode.getBoundingClientRect()['left'];var boxY =e.pageY - ele.parentNode.getBoundingClientRect()['top'];

    document.onmousemove = function(e) {

      var l = e.pageX - boxX - ele.parentNode.offsetParent.getBoundingClientRect().left;
      var t = e.pageY - boxY - ele.parentNode.offsetParent.getBoundingClientRect().top;
      l = l <= 0 ? 0 : l;
      t = t <= 0 ? 0 : t;
      if(l>=ele.parentNode.offsetParent.clientWidth- ele.parentNode.offsetWidth)
      l = ele.parentNode.offsetParent.clientWidth- ele.parentNode.offsetWidth;

      if(t>=ele.parentNode.offsetParent.clientHeight- ele.parentNode.offsetHeight)
      t = ele.parentNode.offsetParent.clientHeight - ele.parentNode.offsetHeight;
      ele.parentNode.style.left = l + 'px';
      ele.parentNode.style.top = t + 'px';
     }
     document.onmouseup = function(e) {
       document.onmousemove = document.onmouseup = null;
  }

  }

}
