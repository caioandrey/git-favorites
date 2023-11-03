import { GithubUser } from "./githubuser.js"



export class Favorites {
    constructor(root) { 
        this.root = document.querySelector(root)
        this.load()

    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário já cadastrado')
            }


            const user = await GithubUser.search(username)
            
            if(user.login === undefined) {
                throw new Error('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch (error) {
            alert(error.message)
        }
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favotires:')) || []
    }

    save() {
        localStorage.setItem('@github-favotires:', JSON.stringify(this.entries))
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}




export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        this.notfav = document.querySelector('.notfav')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
       

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input') 
            this.notfav.style.display = "none"

            this.add(value)
        }
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
             tr.remove()
        })
    }

    update() {
        this.removeAllTr()

        
        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.loguim
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
               const isOk = confirm('Tem certeza que deseja deletar está linha?')

               if(isOk) {
                this.delete(user);

                if (this.entries.length === 0) {
                    this.notfav.style.display = "block"
                }

                
               }
            }

            
            this.tbody.append(row)
        })

    }
      
   
    createRow() { 
        const tr = document.createElement('tr')

        tr.innerHTML = `
     
            <td class="user">
                <img src="https://github.com/caioandrey.png" alt="">
                <a href="https://github.com/caioandrey" target="_blank">
                    <p>Caio Andrey</p>
                    <span>caioandrey</span>
                </a>
            </td>
            <td class="repositories">
                2
            </td>
            <td class="followers">
                87
            </td>
            <td>
                <button class="remove">Remove</button>
            </td>
   
     `

        return tr
    }
}

    
        


    