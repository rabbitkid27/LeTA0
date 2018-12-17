$(function(){
    $('.btn-exit').on('tap',function(){
        $.ajax({
            url:'/user/logout',
            success:function(data){
                if(data.success){
                location = 'login.html?returnUrl='+location.href;
                }
            }
        });
    });
    $.ajax({
        url:'/user/queryUserMessage',
        success:function(data){
            console.log(data);
            if(data.error){
                location = 'login.html?returnUrl='+location.href;
            }else{
                $('.username').html(data.username);
                $('.phone').html(data.mobile);
            }
        }
    })
})