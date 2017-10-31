//
pan.shadowClose.onclick = function (){
  pan.shadow.style.display = '';
  this.style.display = 'none';
  pan.shadow.style.backgroundImage = '';
}
// 右键打开
pan.contextmenuSpansF[0].onclick = function(e) {

  var current = getItemDataById(files,pan.current);
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
}

//选中文件夹
content.addEventListener('click',select);
// 全选
pan.selectAll.onclick = function(){
  if (pan.creataFloderCheck) {
    return;
  }
  this.innerHTML = this.innerHTML?'':'✔';
  if (this.innerHTML) {
    doSelected(content);
    return;
  }
  cancelSelected(content);
}
//重命名文件夹
pan.reName.onclick =fnRename;
pan.contextmenuSpansF[6].onclick = fnRename;
function fnRename(e) {
  var current = haveSelected(content);
  if (current.length>1) return;
  createRename("rename",current);
}
//新建文件夹
pan.createF.onclick = fnCreatF;
pan.contextmenuSpansC[4].onclick = fnCreatF;
function fnCreatF(e){
  if (pan.creataFloderCheck) {
    return;
  }
  createRename("create");
  cancelSelected(content);
}


// 删除文件夹

pan.delet.onclick = fnDelet;
pan.contextmenuSpansF[7].onclick = fnDelet;
function fnDelet(e){

  if (pan.creataFloderCheck) {
    return;
  }
  pan.creataFloderCheck = true;
  var parent = null;
  popUp2(del,cal);
  function del(){
    for (var i = 0; i < content.children.length; i++) {
      if (content.children[i].select) {
        var current = getItemDataById(files,content.children[i].id*1);

        if(content.children[i].pId||content.children[i].pId==0){
          parents = getItemDataById(files,content.children[i].pId*1);
          arrDel(parents.children,current.index);
        }else{
          parents = files;
          arrDel(parents,current.index);
        }

        content.removeChild(content.children[i]);
        i--;
      }
    }
    checkSelect();
    // 存进本地存储
    localStorage1();
    pan.creataFloderCheck = false;
    conment.firstElementChild.firstElementChild.innerHTML = content.children.length + '';
    pan.selectAll.innerHTML = '';
  }
  function cal() {
    pan.creataFloderCheck = false;
  }
}

// 复制文件夹
pan.copyTo.addEventListener('click',function moveFloder(e){
  moveCopy(action,'copy');
});
pan.contextmenuSpansF[4].onclick = function moveFloder(e){
  moveCopy(action,'copy');
};
// 移动文件夹
pan.moveTo.addEventListener('click',function moveFloder(e) {
 moveCopy(action,'move');
});
pan.contextmenuSpansF[5].onclick = function moveFloder(e) {
 moveCopy(action,'move');
};
// 移动或复制文件夹的新建、确认或取消选项
function moveCopy(fn,condition) {
  if (pan.creataFloderCheck) {
    return;
  }

  var file = pan.file;
  var shadow = pan.shadow;
  var shadowMove = shadow.querySelector('.moveTo');
  var xx = shadow.querySelector('.xx');
  var newC = shadow.querySelector('.newC');
  var cancel = shadow.querySelector('.cancel');
  var ack = shadow.querySelector('.ack');
  var tops = shadow.querySelectorAll('.top');
  var shadowList = pan.shadowList;
  var shadowAll = pan.shadowAll;
  var scroll = pan.scroll;
  pan.prev = pan.shadowAll.children[0].children[0];
  shadow.style.display = 'block';
  shadowMove.style.display = 'block';
  shadowList.innerHTML = createList(file);
  clickMove(tops[0]);
  clickMove(tops[1]);
  shadowAllAddClick(shadowAll);
  customScroll(shadowAll,scroll);


  ack.onclick = function(){
    shadow.style.display = 'none';
    shadowMove.style.display = 'none';
    fn(condition);
    console.log('ack');
  }
  cancel.onclick = xx.onclick = function(){
    shadow.style.display = 'none';
    shadowMove.style.display = 'none';
    console.log('cancel');
    return false;
  }
  newC.onclick = function(){
    var target = getItemDataById(files,shadowAll.it);
    var current = pan.prev; // 当前选中的DOM元素
    var newEle,parent,div,addClick;
    current.children[0].classList.add('open');
    current.children[1].classList.add('open');
    current.children[0].classList.remove('active');
    if (current.nextElementSibling) {
      // current.nextElementSibling.style.display ='block';
      newEle = document.createElement('li');
      newEle.innerHTML = `<div data-index = ${data.maxId++}>
                        <em class="active"></em>
                        <span></span>
                        <input type="text" class="txt" value="">
                      </div>`;

      current.nextElementSibling.insertBefore(newEle,current.nextElementSibling.firstElementChild);
      div = newEle.querySelector('div');
      parent = current.nextElementSibling;
      addClick = newEle.parentNode;
      fn();
    }else{
      newEle = document.createElement('ul');
      newEle.innerHTML = `<li>
                        <div data-index = ${data.maxId++}>
                          <em class="active"></em>
                          <span></span>
                          <input type="text" class="txt" value="">
                        </div>
                      </li>`;
      current.parentNode.appendChild(newEle);
      parent = current.parentNode;
      addClick = newEle
      div = newEle.querySelector('div');
      var em = div.querySelector('em');
      fn();

    }
    function fn() {
      current.nextElementSibling.style.display ='block';
      // shadowAll.style.top =shadowAll.offsetTop - 35 + 'px';
      var txt = newEle.querySelector('.txt');
      var newObj = {};
      txt.focus();
      customScroll(shadowAll,scroll);
      var span = div.querySelector('span');
      txt.onblur = function () {
        if(txt.value){
          span.innerHTML = createName(txt.value,current.dataset.index*1,files);
          div.removeChild(txt);
          shadowAllAddClick(addClick);
          newObj.name = span.innerHTML;
          newObj.id = data.maxId-1;
          newObj.pId = current.dataset.index*1;
          newObj.children = [];
          getItemDataById(files,current.dataset.index*1).children.unshift(newObj);
        }else{
          if (em) {
            current.children[0].classList.add('active');
          }
          parent.removeChild(newEle);
        }
      }
    }
  }
}
// 在显示弹窗后的一系列操作
function action(condition) {
  var currentArr = [],current,parent,check;
  var pId = pan.shadowAll.it;
  var targetParent = getItemDataById(files,pId*1);
  var parentsId = getAllParentsById(files,pId).parentsId;

// 不能移动到自身及子文件夹下

  for (var i = 0; i < content.children.length; i++){
    if (content.children[i].select){
      if (parentsId.indexOf(content.children[i].id*1)>-1) {
        return  popUp('不能一定到自身及子文件夹下',false);
      }
    }
  }
  // 检测被选中的文件夹与目标文件夹子文件夹有无重名
  for (var i = 0; i < content.children.length; i++) {
    if (content.children[i].select) {
      current = getItemDataById(files,content.children[i].id*1);
      parent = getItemDataById(files,current.pId);
      check = checkName(current.name,pId,files);
      if (condition === 'move'&&current.pId===pId) {
        check = true;
      }
      // 不重名的移动过去
      if (check) {

        // 判断移动还是复制
        if (condition === 'move') {
          arrDel(parent.children,current.index);
          current.pId = targetParent.id;
          targetParent.children.unshift(current);
        }else{
          // 克隆一个对象放到目标对象的children中
          current = objClone(current,pId);
          targetParent.children.unshift(current);
        }
      }else{
        // 判断移动还是复制
        if (condition === 'copy'){
          current = objClone(current,pId);
        }
        //重名的放到数组中
        currentArr.push(current);
      }
    }
  }
  //没有就重新渲染当前文件夹下页面
  if (!currentArr.length) {
    createContentHtml(parent.children);
    localStorage1();
  }else{
    //有重名的，执行下列函数
    var shadow = pan.shadow;
    var shadowTip = shadow.querySelector('.tip');
    shadow.style.display = 'block';
    shadowTip.style.display = 'block';
    var xxx = shadow.querySelector('.xxx');
    var pass = shadow.querySelector('.pass');
    var cancel1 = shadow.querySelector('.cancel1');
    var two = shadow.querySelector('.two');
    var had = shadow.querySelector('.had');
    var move = shadow.querySelector('.move');
    var balabala = shadow.querySelector('.balabala');
    //添加点击事件
    balabala.children[0].onclick = function(){
      this.innerHTML = this.innerHTML?'':'✔';
      balabala.check = this.innerHTML?true:false;
    }
    //取消
    cancel1.onclick = xxx.onclick = function() {
      shadow.style.display = '';
      shadowTip.style.display = '';
      createContentHtml(parent.children);
    };
    // 跳过
    pass.onclick = function() {
      if (balabala.check) {
        while(1){
        if (fn1()) return;
        }
      }
      fn1();
      function fn1() {
        currentArr.shift();
        if(!currentArr.length){
          createContentHtml(parent.children);
          shadow.style.display = '';
          shadowTip.style.display = '';
          return true;
        }
        fn(currentArr);
      }

    }
    // 保留两个
      two.onclick = function() {
        if (balabala.check) {
          while(1){
          if (fn1()) return;
          }
        }
        localStorage1();
        fn1();
        function fn1() {
          // 使不重名
          currentArr[0].name = createName(currentArr[0].name,pId,files);

          // 判断移动还是复制
          if (condition === 'move'){
            var index = getItemDataById(files,currentArr[0].id).index;
            arrDel(parent.children,index);
            currentArr[0].pId = targetParent.id;
          }
          targetParent.children.unshift(currentArr[0]);
          currentArr.shift();
          if(!currentArr.length){
            createContentHtml(parent.children);
            shadow.style.display = '';
            shadowTip.style.display = '';
            return true;
          }
          fn(currentArr);
        }
    }
    fn(currentArr);
    function fn(currentArr) {
      had.children[1].innerHTML = move.children[1].innerHTML = currentArr[0].name;
      balabala.children[1].innerHTML = currentArr.length - 1 + '';
      if (currentArr.length<=1) {
        balabala.style.display = 'none';
      }else{
        balabala.style.display = 'block';
      }

    };
  }
}


  // 克隆对象
  function objClone(target,pId){
    var current = {};
    // var Id;
    current.name = target.name;
    current.pId = pId;
    current.id = pId = data.maxId++;
    current.type = target.type;
    if (target.type === 'image') {
      current.url = target.url;
      return current;
    }
    current.children = [];
    for (var i = 0; i < target.children.length; i++) {
      current.children[i] = objClone(target.children[i],pId);
    }
    return current;
  }
  // 存进本地存储
  function localStorage1() {
    var json = JSON.stringify(data);
    localStorage.setItem('_data12',json);
  }
  document.body.onclick = clearContextmenu;
  content.addEventListener('mousedown',clearContextmenu);
  function clearContextmenu(e) {
    var contextmenu = document.querySelectorAll('.contextmenu');
    contextmenu[0].parentNode.style.transform = contextmenu[0].style.transform = contextmenu[1].style.transform = 'scale(0)';
  };
