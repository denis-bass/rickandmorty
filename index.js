const { createApp } = Vue;
createApp({
    data() {
        return {
            personages: [],
            loading: true,
            searchText: '',
            nextPage: 1
        }
    },
    computed: {
        filteredPersonages() {
            return this.personages.filter(personages =>
                personages.name.toLowerCase().includes(this.searchText.toLowerCase())
            );
        }
    },
    created() {
        // todo o momento que acontecer o evento
        this.fetchPersonages();
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        async fetchPersonages() {
            try {
                const response = await fetch(`https://rickandmortyapi.com/api/character?page=${(this.nextPage)}`)
                const data = await response.json();
                const personageDetailsPromises = data.results.map(async personages => this.fetchPersonageData(personages.url))
                const personageDetails = await Promise.all(personageDetailsPromises)
                this.personages = [... this.personages, ... personageDetails];
                this.nextPage++
                this.loading = false;
            } catch (error) {
                console.error(error)
            }
            console.log(this.personages);
        },
        async fetchPersonageData(url){
            try {
                const response = await fetch(url);
                const data = await response.json();
                return {
                    id: data.id,
                    name: data.name,
                    image: data.image,
                    species: data.species,
                    origin:data.origin,
                    showDetails: true,
                }
            } catch (error) {
                console.error(error)
            }
        },
        getTypeClass(type) {
            const typeClassMap = {
                human: "Human",
                fire: 'fire',
                grass: 'grass',
                water: 'water',
                bug: 'bug',
                normal: 'normal',
                poison: 'poison',
                electric: 'electric',
                fairy: 'fairy',
                fighting: 'fighting',
                ground: 'ground',
                rock: 'rock',
                ghost: 'ghost',
                dragon: 'dragon',
                ice: 'ice',
                psychic: 'psychic',
                steel: 'steel',
                dark: 'dark',
                flying: 'flying'
            }

            return typeClassMap[type] || ''
        },
        handleScroll(){
            //pega o topo da pagina mais a altura dele total.... y e x
            const bottomOfPage = document.documentElement.scrollTop + window.innerHeight  === document.documentElement.offsetHeight;
            if(bottomOfPage && !this.loading){
                this.loading = true;
                this.fetchPersonages();
            }
        }
    }

}).mount("#app");