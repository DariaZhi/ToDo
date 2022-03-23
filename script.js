const storage = localStorage.getItem('data')
const parsedStorage = storage ? JSON.parse(storage) : []

const data = parsedStorage
console.log(data)
const formCreateElement = document.querySelector('#formCreate')
const listTodo = document.querySelector('#list')


formCreateElement.addEventListener('submit', handleSubmitFormCreate)
listTodo.addEventListener('change', handleCrossOutTodo) // обработчик событий
listTodo.addEventListener('click', handleRemoveTodo)
listTodo.addEventListener('click', handleEditTodo)
listTodo.addEventListener('submit', handleSubmitFormEdit)
window.addEventListener('beforeunload', () => { 
    const string = JSON.stringify('data')
    localStorage.setItem('data', string)
}
)

document.addEventListener('DOMContentLoaded', () => render())


function handleSubmitFormCreate(event) {
    event.preventDefault()

    const date = new Date()
    const todo = {
        id: date.getTime(),
        createdAt: date,
        isChecked: false
    }

    const formData = new FormData(formCreateElement)

    for (let [name, value] of formData) {
        console.log(name, value)
        todo[name] = value
    }

    data.push(todo)


    formCreateElement.reset()

    render()

}


function handleSubmitFormEdit(event) {
    event.preventDefault()

    const { target } = event // const target = event.target

    const inputElement = target.querySelector('input[name="title"]')

    const { value } = inputElement

    console.log(value)

    const { id } = target.dataset

    console.log(target.dataset)

    data.forEach((item) => {
        if (item.id == id)
            console.log(item)
        item.title = value
    })

    const parentElement = target.closest('.island__item')
    parentElement.classList.remove('island__item_edit')

    render()
}



function todoTemplate({ title, id, isChecked, createdAt, priority, estimate }) {
    const checkedAttr = isChecked ? 'checked' : ''
    const creationDate = buildDate(createdAt)
    const stars = buildPriority(priority)
    const h = setEstimate(estimate)

    return `
       <div class="island__item ${isChecked ? 'island__item_checked' : ''}">
          <div class="form-check d-flex align-items-center">
              <input 
                 class="form-check-input" 
                 type="checkbox" 
                 ${checkedAttr}
                 id="${id}"
                 data-id="${id}">

              <label class="form-check-label ms-3 me-3" for="${id}">
                 ${title}
              </label>

              <form class="form-edit"
                    data-id=${id}>
                   <input 
                   class="form-control"
                   name="title"
                   value=${title}>
                   <button class="btn btn-sm ms-3 me-3 btn-save"
                   type="submit">
                       save
                   </button>
              </form>

              <time class="ms-auto me-2">${creationDate}</time>
            
              <span class="badge pe-3">${stars}</span>


              <span class="badge estimate pe-3">${h}</span> 
               
              <button
                 class="btn btn-sm me-3 btn-danger btn-edit" 
                 type="button" 
                 data-role="edit"
                 data-id="${id}">
                   edit
              </button>

              <button
                 class="btn btn-sm btn-danger btn-remove" 
                 type="button" 
                 data-role="remove"
                 data-id="${id}">
                    🗑️
              </button>
          </div>
       </div>
   `
}



function handleCrossOutTodo(event) {
    const { target } = event
    const { id } = target.dataset

    data.forEach((item) => {
        if (item.id == id) {
            item.isChecked = target.checked
        }
    })

    const parentElement = target.closest('.island__item') // находим родительский элемент
    parentElement.classList.toggle('island__item_checked')  // добавляем класслист и идем в css чтобы сделать чекнутое todo перечеркнутым и отправить в конец списка

}



function handleRemoveTodo(event) {
    const { target } = event

    if (target.dataset.role != 'remove') return

    const { id } = target.dataset

    data.forEach((item, index) => {
        if (item.id == id) {
            delete data[index]
        }
    })

    render()
}

function handleEditTodo(event) {
    const { target } = event

    if (target.dataset.role != 'edit') return

    const parentElement = target.closest('.island__item')

    parentElement.classList.add('island__item_edit')

    console.log('edit')

}




function transformData(date) {
    return date < 10 ? `0${date}` : date
}

function buildDate(date) {

    let day = transformData(date.getDate())
    let month = transformData(date.getMonth() + 1)
    let year = date.getFullYear()

    return `${day}.${month}.${year}`
}




function buildPriority(count) {
    let stars = ''
    for (let i = 0; i < count; i++) {
        stars = stars + '🌟'
    }

    return stars

}




function setEstimate(time) {
    if (time == 0) {
        return ' '
    } else {
        return (time + 'h')
    }
}




function render() {

    data.forEach((todo) => {
        const template = todoTemplate(todo)   

        result = result + template
    })

    listTodo.innerHTML = result
}









