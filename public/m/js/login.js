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
                    window.history.back();
                    //返回上一页(后退功能)
                }else{
                    mui.toast(data.message,{ duration:'long', type:'div' }) 
                }
            }
        })

    });

    $('.btn-register').on('tap',function(){
        location='register.html';
    });
})