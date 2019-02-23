document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  const toyCollectionDiv = document.querySelector('#toy-collection')
  let toyArray = []
  let addToy = false
  const newToyForm = document.querySelector('.add-toy-form')

  // YOUR CODE HERE
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
      // submit listener here
    } else {
      toyForm.style.display = 'none'
    }
  })

  //fetch all the toys
  fetch ('http://localhost:3000/toys')
  .then(function (response){
    return response.json()
  })
  .then(function (data){
    toyArray = data
    renderAllToys(toyArray)
  })

  //fetch call to post from form and create a new toy
  newToyForm.addEventListener('submit', function(e){
    e.preventDefault()
    let name = document.querySelector('#name').value
    let image = document.querySelector('#image').value
    let data = {
      name: name,
      image: image,
      likes: 0,
    }
    fetch('http://localhost:3000/toys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(function(response){
      return response.json()
    })
    .then(function(data){
      toyArray.push(data)
      renderAllToys(toyArray)
    })
  })

  //fetch call for liking a toy (patch to edit the # of likes a toy has and update DB with that info)
  toyCollectionDiv.addEventListener('click', function(e){
    if (e.target.previousElementSibling.id === 'likes') {
      let toy = toyArray.find(p => p.id == e.target.parentElement.id)
      let likes = e.target
      let likesText = likes.previousElementSibling
      let currentLikes = parseInt(likesText.innerText)

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "likes": `${++currentLikes}`
        })
      })
      .then(function(response){
        return response.json()
      })
      .then(function(data){
        let updatedToy = data

        toyArray.map(toy => {
          if (updatedToy.id == toy.id) {
            likesText.innerText = `${updatedToy.likes} Likes`
          }
        })
      })
    } else if (e.target.dataset.action === 'delete') {
      console.log(e.target)
      let toy = toyArray.find(p => p.id == e.target.parentElement.id)
      // debugger
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "DELETE"
      })
      .then(function(response){
        e.target.parentElement.remove()
      })
    }

  })

  console.log("DOM is fully loaded")

  //render all toys
  function renderAllToys(toys){
    toys.map(renderSingleToy).join('')
  }

  //render single toy
  function renderSingleToy(toy){
    const toyCollectionDiv = document.querySelector('#toy-collection')
    toyCollectionDiv.innerHTML += `
      <div id="${toy.id}" class="card">
        <h2>${toy.name}</h2>
          <img src=${toy.image} class="toy-avatar" />
            <p data-id="${toy.id}" id="likes">${toy.likes} Likes </p>
        <button data-id="${toy.id}" id="like-btn">Like <3</button>
        <button data-action="delete" data-id="${toy.id}" id="delete-btn">Delete Toy :(</button>
      </div>
      `
  }
})
