
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getMoreDetailsOfPokemon = (pokemonNumber) => {
    const URL = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`;

    return fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            let stats = data.stats.map(stat => stat.base_stat);

            const otherDetails = {
                height: (data.height) / 10,
                weight: (data.weight) / 10,
                hp: data.stats.find((stat) => stat.stat.name).base_stat,
                attack: stats[1],
                defense: stats[2],
                specialAttack: stats[3],
                specialDefense: stats[4],
                speed: stats[5],
                name: data.name,
            };

            otherDetails.name = otherDetails.name[0].toUpperCase() + data.name.substring(1);

            // Cria o modal
            const modal = document.createElement('div');
            modal.classList.add('modal');

            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');

            // Cabeçalho do modal
            const header = document.createElement("div");
            header.classList.add("modal-header");
            const title = document.createElement("h2");
            title.textContent = otherDetails.name;
            header.appendChild(title);
            modalContent.appendChild(header);

            // Cria o conteúdo do modal com as informações do Pokémon
            const modalHTML = `
                <h2>Pokémon: ${otherDetails.name}</h2>
                <p>Peso: ${otherDetails.weight} Kg</p>
                <p>Altura: ${otherDetails.height} m</p>
                <p>Velocidade: ${otherDetails.speed} Km/h</p>
                <p>Ataque: ${otherDetails.attack} pt</p>
                <p>Defesa: ${otherDetails.defense} pt</p>
                <p>Ataque Especial: ${otherDetails.specialAttack} pt</p>
                <p>Defesa Especial: ${otherDetails.specialDefense} pt</p>
            `;

            modalContent.innerHTML = modalHTML;

            // Adiciona o conteúdo do modal ao modal
            modal.appendChild(modalContent);

            // Adiciona o modal ao documento
            document.body.appendChild(modal);

            // Fecha o modal ao clicar fora dele
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.remove();
                }
            });
        })
        .catch((error) => console.log(error));
}

pokeApi.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
