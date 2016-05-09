$(document).ready(function(){
    $('.delete-genre').on('click', function(){
        var id = $(this).data('id');
		var url = '/genres/delete/'+id;
		if(confirm('Delete Genre?')){
			$.ajax({
				url: url,
				type:'DELETE',
				success: function(result){
					console.log('Deleting genre...');
					window.location.href='/genres';
				},
				error: function(err){
					console.log(err);
				}
			});
		}
    });
});