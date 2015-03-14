//$() is a jQuery Selector which is an easy way to fetch an item from the page; specify the class, id, or tag of the element(s) you want
//searches throguht DOM tree to find id=template and stores each class=item in an array format that's accessible in the variable itemTemplate
var itemTemplate = $('#templates .item')
var list = $('#list')

//function that creates a copy of the itemTemplate, adds data to the new item, and append the new item to the list element
var addItemToPage = function(itemData) {
	//close() creates a copy of a selected element
	var item = itemTemplate.clone()
	//attr() allows you to get and alter attributes stored in HTML; stores the id of an item from the data-id attribute
	item.attr('data-id',itemData.id)
	//find() helps find element nested in other elements; get description text
	item.find('.description').text(itemData.description)
	if(itemData.completed) {
		//add a class to the element
		item.addClass('completed')
	}
	list.append(item)
}

/* 
//IN CONSOLE THIS LINE ADDS NEW ITEM TO LIST:
item = { description: 'a new item', id: 9000, completed: false}
addItemToPage(item)
*/

///////////////////////////////////////////////

//makes a request
var loadRequest = $.ajax({
  type: 'GET',
  url: "https://listalous.herokuapp.com/lists/misstmarshall/"
})

//updates the page when the request succeeds
loadRequest.done(function(dataFromServer) {
  var itemsData = dataFromServer.items

  itemsData.forEach(function(itemData) {
    addItemToPage(itemData)
  })
})


//start listening for when the user submits the form at the top of the page after pressing enter
$('#add-form').on('submit', function(event) {
  //prevent page from refreshing
  event.preventDefault()
  var itemDescription = event.target.itemDescription.value
  //alert('trying to create a new item with a description ' + itemDescription)
	
	//creates an AJAX request to the server to create an item with the description provided
	var creationRequest = $.ajax({
	  type: 'POST',
	  url: "http://listalous.herokuapp.com/lists/misstmarshall/items",
	  data: { description: itemDescription, completed: false }
	})

	//call function created at the top of the page that adds an item to the list in the HTML DOM tree using the data sent back from the server
	creationRequest.done(function(itemDataFromServer) {
	  addItemToPage(itemDataFromServer)
	  $('#create').val('')
	})
})

////////////////////////////////////////////////////

//add event listener to listen to a button click on the complete-button
$('#list').on('click', '.complete-button', function(event) {
    //alert('trying to complete an item!')

    //get necessary info needed from the page to make changes
	var item = $(event.target).parent()
	var isItemCompleted = item.hasClass('completed')
	var itemId = item.attr('data-id')
	//alert('clicked item ' + itemId + ', which has completed currently set to ' + isItemCompleted)

	//make request to the server to update the data stored
	var updateRequest = $.ajax({
    type: 'PUT',
    url: "https://listalous.herokuapp.com/lists/misstmarshall/items/" + itemId,
    data: { completed: !isItemCompleted }
	})

	//update the html to indicate a complete action
	updateRequest.done(function(itemData) {
	    if (itemData.completed) {
	      item.addClass('completed')
	    } else {
	      item.removeClass('completed')
	    }
	})
})

///////////////////////////////////////////////////////

//add event listener to listen to a button click on the delete-button
$('#list').on('click', '.delete-button', function(event) {
    //alert('trying to delete an item!')

    //get necessary info needed from the page to make changes
	var item = $(event.target).parent()
	var itemId = item.attr('data-id')
	//alert('clicked item ' + itemId + ', which has completed currently set to ' + isItemCompleted)
	
	//make request to the server to update the data stored
	var updateRequest = $.ajax({
    type: 'DELETE',
    url: "https://listalous.herokuapp.com/lists/misstmarshall/items/" + itemId,
    data: {  }
	})

	//update the html to delete the item
	updateRequest.done(function(itemData) {
	    item.remove();
	}) 
})

///////////////////////////////////////////////////////////
