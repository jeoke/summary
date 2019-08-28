document.getElementById("file1").addEventListener('change', preview, false);
 //图片上传预览
 function preview(){
    var x = document.getElementById("file1");//获取上传控件
    if(!x || !x.files){
        return;
    }
    var patn = /\.jpg$|\.jpeg$|\.gif$|\.png$/i;
    if(patn.test(x.value)){
        var y = document.getElementById("img1"); //获取图片控件
        reader = new FileReader();
        var srcName;
        reader.addEventListener('load', function(){
            srcName = this.result;
        if(y){
            y.src = srcName ;
        }else{
            var img = document.createElement('img');
            img.setAttribute('src', srcName );
            img.setAttribute('width', '120px');
            img.setAttribute('height', '90px');
            img.setAttribute('id','img1');
            document.getElementById('form1').appendChild(img);
        }
        },false);
        reader.readAsDataURL(x.files[0]);
        
    }else{
        alert('请选择图片文件');
        document.getElementById('form1').reset();
        document.getElementById('form1').removeChild(document.getElementById('img1'));
    }
 }