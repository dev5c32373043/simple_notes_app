$(document).on('click', '#create_note', function(){
  if(note_title.value.length > 3){
    $.post('/notes', {title: note_title.value, _csrf: csrfToken.value}).done(function(resp){
      csrfToken.value = resp.csrf
      $('.note-container').prepend(resp.item)
      note_title.value = ''
    })
  }else{
    Materialize.toast('Title must be greater then 3 symbols', 4000);
  }
})

$(document).on('click', "#edit_note", function(e){
  var parentE = $(e.target).parent().parent()
  parentE.find('.flow-text').css('display', 'none')
  parentE.find('input')[0].type = 'text'
  e.target.id = 'save_note'
  e.target.textContent = 'save'
})

$(document).on('click', '#save_note', function(e){
  var id = $(e.target).parent().parent().parent()[0].id
  var title = $(e.target).parent().parent().find('input')[0].value
  $.ajax({
    method: 'patch',
    url: "/notes/"+id,
    data: { _csrf: csrfToken.value, title: title }
  }).done(function(resp){
    csrfToken.value = resp.csrf
    var parentE = $(e.target).parent().parent()
    var titleContent = parentE.find('.flow-text')
    titleContent.text(title)
    titleContent.css('display', 'block')
    parentE.find('input')[0].type = 'hidden'
    e.target.id = 'edit_note'
    e.target.textContent = 'edit'
  })
})

$(document).on('click', '#delete_note', function(e){
  var target = $(e.target).parent().parent().parent()
  $.ajax({
    method: 'delete',
    url: "/notes/"+target[0].id,
    data: { _csrf: csrfToken.value }
  }).done(function(resp){
    csrfToken.value = resp.csrf
    target.remove()
  })
})
