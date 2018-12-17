$(function(){
    $('.btn-login').on('tap',function(){
        var username=$('.username').val().trim();
        var password=$('.password').val().trim();
        if(!username){
            mui.alert( '请输入正确的用户名', '咆哮提示!!!', '好吧QAQ');
            return false;
        }
        if(!password){
            mui.alert( '请输入正确的密码', '咆哮提示!!!', '好吧QAQ');
            return false;
        }
        $.ajax({
            url:'/user/login',
            type:'post',
            data:{username:username,password:password},
            success:function(data){
                if(data.success){
                    // window.history.back();
                    //返回上一页(后退功能)
                    var returnUrl = getQueryString('returnUrl');
                    location = returnUrl;
                }else{
                    mui.toast(data.message,{ duration:'long', type:'div' }) 
                }
            }
        })

    });

    $('.btn-register').on('tap',function () {
		// 跳转到注册页面
		location = 'register.html';
    });

     // 根据url参数名取值
     function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        // console.log(r);
        if (r != null) {
            //转码方式改成 decodeURI
            return decodeURI(r[2]);
        }
        return null;
    }
})