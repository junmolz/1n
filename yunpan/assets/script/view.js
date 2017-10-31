
var content = document.querySelector('.content');
var conment = document.querySelector('.conment');
var files = user_data.files;
var data = user_data;




//**********************************************************
// 存储需要用的变量
var pan = {};
pan.menu = document.querySelector('.menu');
pan.delet = pan.menu.querySelector('.delete');
pan.creaetF = pan.menu.querySelector('.create-folder');
pan.selectAll = document.querySelector('.block');
pan.delet = pan.menu.querySelector('.delete');
pan.createF = pan.menu.querySelector('.create-folder');
pan.reName = pan.menu.querySelector('.re-name');
pan.moveTo = pan.menu.querySelector('.move-to');
pan.copyTo = pan.menu.querySelector('.copy-to');
pan.shadow = document.querySelector('.shadow');
pan.shadowAll = pan.shadow.querySelector('.all');
pan.shadowList = pan.shadow.querySelector('.list');
pan.shadowClose = pan.shadow.querySelector('.close');
pan.scroll = pan.shadow.querySelector('.scroll');
pan.prev = pan.shadowAll.children[0].children[0];
pan.file = user_data.files[0].children;
pan.creataFloderCheck = false;
pan.selectFloderCheck = false;
pan.contextmenu = document.querySelectorAll('.contextmenu');
pan.contextmenuSpansF = pan.contextmenu[0].querySelectorAll('span');
pan.contextmenuSpansC = pan.contextmenu[1].querySelectorAll('span');
//**********************************************************
// 本地存储
var localS = JSON.parse(localStorage.getItem("_data12"));
if (localS) {
  files = localS.files;
  data = localS;
  // console.log(localS);
  pan.file = localS.files[0].children;
}
 
(function () {
  conment.children[3].id = 0;
})();

createContentHtml(pan.file);
//**********************************************************
//点击进入相应文件夹
content.addEventListener('click', function(e) {
  // 如果在新建或者重命名中
  if(pan.creataFloderCheck) return;

  if(!e.target.id) return;
  var menuMany = document.querySelector('.menu-many');
  var current = getItemDataById(files,e.target.id*1);
  if (current.type ==='image') {
    pan.shadow.style.display = 'block';
    pan.shadowClose.style.display = 'block';
    pan.shadow.style.backgroundImage = 'url(' + current.url + ')';
    return;
  }
  createContentHtml(current.children);

  var len = conment.children.length;
  if (len>=3) {
    conment.children[1].style.display = 'block';
    conment.children[2].style.opacity = 1;
  }
  var span = document.createElement('span');
  var em = document.createElement('em');
  span.innerHTML = current.name;
  em.innerHTML = '>';
  span.id = current.id;

  conment.appendChild(em);
  conment.appendChild(span);
  conment.children[len-1].style.color = '#3b8cff';
});

// 点击目录进入相应文件夹
conment.onclick = function(e) {
  // e.stopPropagation();
  var file = pan.file;
  if(pan.creataFloderCheck) return;
  var len = conment.children.length;
  var current = {};

  //如果点击的是返回上一级
  if(e.target === conment.children[1]){
    if (len<=6) {
      createContentHtml(file);
      conment.removeChild(conment.lastElementChild);
      conment.removeChild(conment.lastElementChild);
      conment.children[3].style.color = '';
      conment.children[1].style.display = '';
      conment.children[2].style.opacity = 0;
      return;
    }
    conment.removeChild(conment.lastElementChild);
    conment.removeChild(conment.lastElementChild);
    len = conment.lastElementChild.id;
    current = getItemDataById(files,len*1);
    createContentHtml(current.children);
    conment.lastElementChild.style.color = '';
  }
// 点击全部文件
  if(e.target === conment.children[3]){
    createContentHtml(file);
    while(e.target.nextElementSibling) {
      conment.removeChild(e.target.nextElementSibling);
    }
    e.target.style.color = '';
    conment.children[1].style.display = '';
    conment.children[2].style.opacity = 0;
    return;
  }

  //如果点击的是其他祖先文件夹名

    if(e.target.id){

      current = getItemDataById(files,e.target.id*1);
      createContentHtml(current.children);
      while(e.target.nextElementSibling) {
        conment.removeChild(e.target.nextElementSibling);
      }
      e.target.style.color = '';
    }

}

//**********************************************************
//生成相应文件夹图标
 function createContentHtml(current) {
   var str = '';
   for (var i = 0; i < current.length; i++) {
     str += `<div class="folder-wrap">
       <span>✔</span>
       <div class="name">${current[i].name}</div>
     </div>`;
   }
   content.innerHTML = str;
   for (var i = 0; i < content.children.length; i++) {
     content.children[i].id = content.children[i].children[1].id = current[i].id ;
     content.children[i].pId = content.children[i].children[1].pId = current[i].pId ;
     if (current[i].type === 'image') {
    ;
      content.children[i].style.backgroundImage = 'url(' + current[i].url + ')';
     }
   }
   conment.firstElementChild.firstElementChild.innerHTML = content.children.length + '';
   if (!content.children.length) {
     content.style.backgroundImage = 'url(./image/null.png)';
   }else{
     content.style.backgroundImage = '';
   }

   // 还原菜单栏
   restoreMenu();
   // 生成文件夹右键菜单
   floderContextmenu();
 }

// 生成点击复制或者移动到后的多级菜单
function createList(data) {
  var scroll = pan.scroll;
  var shadowAll = pan.shadowAll;
  var str = '';
  if(pan.creataFloderCheck) return;
// 判断是否为文件夹（文件夹有children）
  for (var i = 0; i < data.length; i++) {
    if (!data[i].children) {
      continue;
    }
    str +=`<li><div data-index = ${data[i].id}><em class = "${data[i].children&&data[i].children.length>0?'':'active'}"></em><span>${data[i].name}</span></div>`;

    if(data[i].children.length){
      str +=`<ul>${createList(data[i].children)}
      </ul>`;
    }
    str +=`</li>`;
  }
  shadowAll.it = 0;
  shadowAll.style.top = '0';
  scroll.style.top = '0';
  return str;
}
// 给生成的多级菜单添加单击事件
function shadowAllAddClick(obj) {
  var taplist = obj.children;
  var scroll = pan.scroll;
  var shadowAll = pan.shadowAll;
  var total = shadowAll.querySelector('.total');
  total.classList.add('active');
  total.children[0].classList.add('open');
  total.children[1].classList.add('open');
  total.nextElementSibling.style.display ='block';
  // var prev = pan.prev;
  for (var i = 0; i < taplist.length; i++) {
    //添加点击事件
      taplist[i].firstElementChild.onclick = function () {
      // 将选中的项的id存下来
      // console.log(pan.prev,this);
      shadowAll.it = this.dataset.index*1;
      var next = this.nextElementSibling;
      if (this.classList.contains('active')) {
        if (next) {
          //展开或关闭当前操作的目录
          var tog = this.children[0].classList.toggle('open');
          this.children[1].classList.toggle('open');
          next.style.display =tog? 'block':'none';
          // shadowAllAddClick(next);
        }
      }else{
        pan.prev.classList.remove('active');
        this.classList.add('active');
        pan.prev = this;
      }

      customScroll(shadowAll,scroll);
    }

    var next = taplist[i].children[1];
    if(next){
      shadowAllAddClick(next);
    }
  }

}
// 右键菜单
// 生成文件夹右键菜单
floderContextmenu();
function floderContextmenu(){
  var kids = content.children;
  customContextmnu(kids,content,'0');
}
customContextmnu(content,content,'1');
function customContextmnu(target,scope,num){
    	var contextmenuWrap = document.querySelector('.contextmenu-wrap');
    	var contextmenu = document.querySelectorAll('.contextmenu')[num];
      var scopeBound = scope.getBoundingClientRect();

      if (target.length) {
        for (var i = 0; i < target.length; i++) {
          target[i].addEventListener('contextmenu',fn);
        }
      }else{
        if(target.length===0)return;
        target.addEventListener('contextmenu',fn);
      }

      function fn(e){
        e.preventDefault();
        if(pan.creataFloderCheck) return;
        if(num === '0'){
          e.stopPropagation();
          this.classList.add('active');
          this.firstElementChild.classList.add('active');
          this.select = true;
          pan.current = this.id*1;
          checkSelect();
          contextmenu.nextElementSibling.style.transform = 'scale(0)';
        }else{
          contextmenu.previousElementSibling.style.transform = 'scale(0)';
        }
  			contextmenu.style.transform = contextmenuWrap.style.transform = 'scale(1)';
        // 拿到鼠标点击时候的x、y坐标
        var x = e.pageX, y = e.pageY, l, t;

        // 如果要求范围的 - 菜单的宽度 比 鼠标的点击的x坐标 小
        // 说明要超出范围了
        if(x > scopeBound.right - contextmenu.offsetWidth){
          // 如果要超出了就让菜单显示在最大的left值的位置
          l = scopeBound.right - contextmenu.offsetWidth;
        }else{
          l = x;
        }

        if(y > scopeBound.bottom - contextmenu.offsetHeight){
          // 如果要超出了就让菜单显示在最大的left值的位置
          t = scopeBound.bottom - contextmenu.offsetHeight;
        }else{
          t = y;
        }

        contextmenuWrap.style.left = l + 'px';
        contextmenuWrap.style.top = t + 'px';

        }

    }
