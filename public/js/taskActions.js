$(document).on('click', '#add_task', function(e){
  $(e.target).parent().parent()
  .after(
    "<li class='collection task'>" +
      "<input type='text' id='task_text' name='text' placeholder='Take a task'>" +
        "<i id='create_task' class='material-icons task-link btn-floating indigo'>add</i>" +
    "</li>"
  )
})

$(document).on('click', '#create_task', function(e){
  this.parentE = $(e.target).parent().parent();
  var id = this.parentE[0].id;
  var text = e.target.previousElementSibling.value;
  $.ajax({
    method: 'post',
    url: "/notes/"+id+"/tasks",
    data: {text: text, _csrf: csrfToken.value},
    context: this
  }).done(function(resp){
    csrfToken.value = resp.csrf
    this.parentElement.remove()
    this.parentE.append(resp.item)
  })
})

$(document).on('click', "input[type='checkbox']", function(e){
  var target = $(e.target).parent().parent()
  var taskId = target[0].id, noteId = target.parent()[0].id;
  $.ajax({
    method: 'patch',
    url: "/notes/"+noteId+"/tasks/"+taskId,
    data: { _csrf: csrfToken.value, status: e.target.checked }
  }).done(function(resp){
    csrfToken.value = resp.csrf
  })
})

$(document).on('click', '#delete_task', function(e){
  var target = $(e.target).parent().parent().parent()
  var taskId = target[0].id, noteId = target.parent()[0].id;
  $.ajax({
    method: 'delete',
    url: "/notes/"+noteId+"/tasks/"+taskId,
    data: { _csrf: csrfToken.value }
  }).done(function(resp){
    csrfToken.value = resp.csrf
    target.remove()
  })
})
