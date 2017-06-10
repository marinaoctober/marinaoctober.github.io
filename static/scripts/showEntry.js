$(document).ready(function(){
  $('#saveButton').click(function() {
    ref = window.location.href
    ref = ref.replace('show', 'save')
    window.location.href = ref
  })
});
