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
            return this.personages.filter(character =>
                character.name.toLowerCase().includes(this.searchText.toLowerCase())
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
                const response = await fetch(`https://rickandmortyapi.com/api/character?offset=${(this.nextPage - 1) * 60}&limit=60`)
                const data = await response.json();
                const personageDetailsPromises = data.results.map(async character => this.fetchPokemonData(character.url))
                const pokemonDetails = await Promise.all(pokemonDetailsPromises)
                this.personages = [... this.personages, ... pokemonDetails];
                this.nextPage++
                this.loading = false;
            } catch (error) {
                console.error(error)
            }
        },
        async fetchPersonageData(url){
            try {
                const response = await fetch(url);
                const data = await response.json();
                return {
                    id: data.id,
                    name: data.name,
                    showDetails: true,
                }
            } catch (error) {
                console.error(error)
            }
        },
        getTypeClass(type) {
            const typeClassMap = {
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
                this.fetchPokemons();
            }
        }
    }

}).mount("#app");