// start by creating data so we don't have to type it in each time
let TaskArray = [];

// define a constructor to create movie objects
let TaskObject = function (taskName, taskEstimatedTime) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.taskName = taskName;
    this.taskEstimatedTime= taskEstimatedTime;
}


/*TaskArray.push(new TaskObject("Do the laundry", 20));*/



let selectedGenre = "not selected";

document.addEventListener("DOMContentLoaded", function () {

    createList();

// add button events ************************************************************************
    
document.getElementById("buttonAdd").addEventListener("click", function () {
    let newTask = new TaskObject(document.getElementById("taskName").value, document.getElementById("taskEstimatedTime").value)

        $.ajax({
            url : "/AddTask",
            type: "POST",
            data: JSON.stringify(newTask),
            contentType: "application/json; charset=utf-8",
             success: function (result) {
                console.log(result);
                TaskArray = JSON.parse(result);
                
            }
        });
    
            document.location.href = "index.html#tasks";

    });
    
    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("taskName").value = "";
        document.getElementById("taskEstimatedTime").value = "";
    });

    /*$(document).bind("change", "#select-genre", function (event, ui) {
        selectedGenre = $('#select-genre').val();
    });*/

    /*document.getElementById("delete").addEventListener("click", function () {
        let localParm = localStorage.getItem('parm');  // get the unique key back from the dictionairy
        deleteMovie(localParm);
        createList();  // recreate li list after removing one
        document.location.href = "index.html#tasks";  // go back to movie list 
    });*/

// 2 sort button event methods
    document.getElementById("buttonSortTime").addEventListener("click", function () {
        TaskArray.sort(dynamicSort("Title"));
        createList();
        document.location.href = "index.html#tasks";
    });

    document.getElementById("buttonSortAlphabetical").addEventListener("click", function () {
        TaskArray.sort(dynamicSort("Genre"));
        createList();
        document.location.href = "index.html#tasks";
    });

/*    document.getElementById("buttonSubsetComedy").addEventListener("click", function () {
       
        createListSubset("Comedy");  // recreate li list after removing one
        //document.location.href = "index.html#ListSome";  // go back to movie list 
    });

    document.getElementById("buttonSubsetDrama").addEventListener("click", function () {
       
        createListSubset("Drama");  // recreate li list after removing one
        //document.location.href = "index.html#ListSome";  // go back to movie list 
    });*/
// end of add button events ************************************************************************

  
  
// page before show code *************************************************************************
    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#tasks", function (event) {   // have to use jQuery 
        createList();
    });

    $(document).on("pagebeforeshow", "#ListSome", function (event) {   // have to use jQuery 
        // clear prior data
        var divTaskList = document.getElementById("divTaskListSubset");
        while (divTaskList.firstChild) {    // remove any old data so don't get duplicates
            divTaskList.removeChild(divTaskList.firstChild);
        };
    });

    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#details", function (event) {   
        let localParm = localStorage.getItem('parm');  // get the unique key back from the dictionairy
        let localID = GetArrayPointer(localParm); // map to which array element it is
        
        // next step to avoid bug in jQuery Mobile,  force the movie array to be current
        TaskArray = JSON.parse(localStorage.getItem('TaskArray'));  
      // no longer using pointer -1 now that we have real keys
      // document.getElementById("oneTitle").innerHTML = "The title is: " + TaskArray[localID-1].Title;

        document.getElementById("oneTitle").innerHTML = "The title is: " + TaskArray[localID].Title;
        document.getElementById("oneYear").innerHTML = "Year released: " + TaskArray[localID ].Year;
        document.getElementById("oneGenre").innerHTML = "Genre: " + TaskArray[localID ].Genre;
        document.getElementById("oneWoman").innerHTML = "Leading Woman: " + TaskArray[localID].Woman;
        document.getElementById("oneMan").innerHTML = "Leading Man: " + TaskArray[localID].Man;
        document.getElementById("oneURL").innerHTML = TaskArray[localID].URL;
    });
 
// end of page before show code *************************************************************************

});  
// end of wait until document has loaded event  *************************************************************************



// next 2 functions ( createList and createListSubset ) could be combined into 1 with a little work
// such as I could pass in a variable which said which divTaskList div it should draw
function createList() {
    // clear prior data
    var divTaskList = document.getElementById("divTaskList");
    while (divTaskList.firstChild) {    // remove any old data so don't get duplicates
        divTaskList.removeChild(divTaskList.firstChild);
    };
    var ul = document.createElement('ul');
    TaskArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        // adding a class name to each one as a way of creating a collection
        li.classList.add('oneTask'); 
        // use the html5 "data-parm" to encode the ID of this particular data object
        // that we are building an li from
        li.setAttribute("data-parm", element.ID);
        li.innerHTML = element.ID + ":  " + element.taskName + "  " + element.taskEstimatedTime;
        ul.appendChild(li);
    });
    divTaskList.appendChild(ul)

    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneTask");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
        // get that data-parm we added for THIS particular li as we loop thru them
        var parm = this.getAttribute("data-parm");  // passing in the record.Id
        // get our hidden <p> and save THIS ID value in the localStorage "dictionairy"
        localStorage.setItem('parm', parm);
        // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
        // current movie array and save it to localStorage as well.
        let stringTaskArray = JSON.stringify(TaskArray); // convert array to "string"
        localStorage.setItem('TaskArray', stringTaskArray);
        // now jump to our page that will use that one item
        document.location.href = "index.html#details";
        });
    });

};
 

function createListSubset(whichType) {
    // clear prior data
    var divTaskList = document.getElementById("divTaskListSubset");
    while (divTaskList.firstChild) {    // remove any old data so don't get duplicates
        divTaskList.removeChild(divTaskList.firstChild);
    };
    var ul = document.createElement('ul');
    TaskArray.forEach(function (element,) {
        if (element.Genre === whichType) {
            // use handy array forEach method
            var li = document.createElement('li');
            // adding a class name to each one as a way of creating a collection
            li.classList.add('oneTask');
            // use the html5 "data-parm" to encode the ID of this particular data object
            // that we are building an li from
            li.setAttribute("data-parm", element.ID);
            li.innerHTML = element.ID + ":  " + element.Title + "  " + element.Genre;
            ul.appendChild(li);
        }
    });
    divTaskList.appendChild(ul)

    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneTask");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
            // get that data-parm we added for THIS particular li as we loop thru them
            var parm = this.getAttribute("data-parm");  // passing in the record.Id
           
            localStorage.setItem('parm', parm);
            // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
            // current movie array and save it to localStorage as well.
            let stringTaskArray = JSON.stringify(TaskArray); // convert array to "string"
            localStorage.setItem('TaskArray', stringTaskArray);
            // now jump to our page that will use that one item
            document.location.href = "index.html#details";
            });
        });
 
};

// remove a movie from array
function deleteMovie(which) {
    console.log(which);
    let arrayPointer = GetArrayPointer(which);
    TaskArray.splice(arrayPointer, 1);  // remove 1 element at index 
}

// cycles thru the array to find the array element with a matching ID
function GetArrayPointer(localID) {
    console.log(TaskArray);
    console.log(localID);
    for (let i = 0; i < TaskArray.length; i++) {
        if (localID === TaskArray[i].ID) {
            return i;
        }
    }
}

/**
 *  https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
* Function to sort alphabetically an array of objects by some specific key.
* 
* @param {String} property Key of the object to sort.
*/
function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}
