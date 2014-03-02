$(document).ready(function() {
  $('#button-get').click(function(){
    if($('input[name|="user"]').val()) {
      $.ajax({
        url: '/api/get/' + $('input[name|="user"]').val(),
      }).done(function(data) {
        $('#tweet-list').html(data);
      });
    }
  });
  $('#button-generate').click(function() {
    if($('input[name|="user"]').val()) {
      user = $('input[name|="user"]').val();
      $.ajax({
        url: '/api/gen/' + user,
      }).done(function(data) {
        $('#tweet-result').html(data);
      });
    }
  });
});
