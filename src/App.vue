<template>
  <div id="app">
    <div>
      <b-jumbotron>
        <template #header
          >PokeLog <img :src="pokeBall" id="pokeBall"
        /></template>
        <template #lead>
          Biblioteca que reúne todos os pokemons catalogados até o momento.
        </template>
        <hr class="my-4" />
        <p>
          Graças as expedições de Ash e sua equipe conseguimos listar vários
          pokemons, e aqui é onde todos estão.
        </p>
      </b-jumbotron>
    </div>
    <div>
      <h3>Viu algum pokemon por aí e quer saber mais sobre ele?</h3>
      <h5>você pode inserir o nome do pokemon aqui e conferir seus dados.</h5>
      <b-input-group id="search">
        <b-input-group-prepend id="searchIcon" is-text @click="searchPokemon()">
          <b-icon icon="search"></b-icon>
        </b-input-group-prepend>
        <b-form-input
          type="search"
          placeholder="Nome"
          v-model="searchField"
        ></b-form-input>
      </b-input-group>
      <b-alert
        show
        variant="success"
        v-if="this.searchFlag === 200"
        style="width: 500px; margin: 0 auto"
        >Pokemon encontrado com sucesso!</b-alert
      >
      <b-alert
        show
        variant="danger"
        v-if="this.searchFlag === 404"
        style="width: 500px; margin: 0 auto"
        >Oops... parece que não encontramos esse pokémon :(</b-alert
      >
      <b-alert
        show
        variant="danger"
        v-if="this.inputEmpty"
        style="width: 500px; margin: 0 auto; text-align: center"
        >É necessário preencher o campo de busca*</b-alert
      >

      <div
        class="pokeCards"
        style="margin-top: 2rem"
        v-if="this.pokeSearch[0] !== undefined"
      >
        <div v-for="(pokemon, index) in pokeSearch" :key="'poke' + index">
          <b-card
            :title="pokemon.name"
            :img-src="imageUrl + pokemon.id + '.png'"
            img-alt="Image"
            img-top
            tag="article"
            style="padding: 1rem; min-width: 10rem; max-width: 18rem"
            class="mb-2"
            ><b-card-text>
              {{
                pokemon.types.map((typeInfo) => typeInfo.type.name).join(" | ")
              }}
            </b-card-text>
            <b-button
              v-b-modal.modal-1
              variant="outline-primary"
              @click="showDetail(pokemon)"
              >MAIS DETALHES</b-button
            >
          </b-card>
        </div>
      </div>
    </div>
    <div class="listAll">
      <h3>Viu algum pokemon por aí mas não faz ideia de qual seja?</h3>
      <h5>
        você pode conferir no catálogo de pokemons e acabar de vez com sua
        dúvida.
      </h5>
      <b-button
        variant="outline-primary"
        class="listBtnAll"
        @click="listAll"
        v-if="showAll"
        >LISTAR TODOS POKEMONS</b-button
      >
      <b-button
        variant="outline-primary"
        class="listBtnAll"
        @click="initialState"
        v-else
        >LIMPAR DADOS</b-button
      >
      <div v-if="this.pokemons2 != undefined">
        <!-- <div v-for="(pokemon, index) in displayedRecords" :key="'poke' + index">
          <p>{{ pokemon.name }}</p>
        </div> -->
        <div class="pokeCards2">
          <div
            v-for="(pokemon, index) in displayedRecords"
            :key="'poke' + index"
          >
            <b-card
              :title="pokemon.name"
              :img-src="imageUrl + pokemon.id + '.png'"
              img-alt="Image"
              img-top
              tag="article"
              style="padding: 1rem; min-width: 10rem; max-width: 18rem"
              class="mb-2"
              ><b-card-text>
                {{
                  pokemon.types
                    .map((typeInfo) => typeInfo.type.name)
                    .join(" | ")
                }}
              </b-card-text>
              <b-button
                v-b-modal.modal-1
                variant="outline-primary"
                @click="showDetail(pokemon)"
                >MAIS DETALHES</b-button
              >
            </b-card>
          </div>
        </div>

        <pagination
          :records="pokemons2.length"
          v-model="page"
          :per-page="perPage"
          :options="{
            texts: {
              count:
                'Amostras de {from} a {to} de {count} espécies coletadas|{count} records|One record',
            },
          }"
        >
        </pagination>
      </div>
    </div>
    <h2 class="museum">Catálogo de Pokemons</h2>
    <h3 style="font-size: 24px">
      Espécies trazidas por Ash de sua recente expedição.
    </h3>
    <h5>Aproveite, pode ser quer você não veja-os novamente por aqui.</h5>
    <div class="pokeCards">
      <div v-for="(pokemon, index) in pokemons" :key="'poke' + index">
        <b-card
          :title="pokemon.name"
          :img-src="imageUrl + pokemon.id + '.png'"
          img-alt="Image"
          img-top
          tag="article"
          style="padding: 1rem; min-width: 10rem; max-width: 18rem"
          class="mb-2"
          ><b-card-text>
            {{
              pokemon.types.map((typeInfo) => typeInfo.type.name).join(" | ")
            }}
          </b-card-text>
          <b-button
            v-b-modal.modal-center
            variant="outline-primary"
            @click="showDetail(pokemon)"
            >MAIS DETALHES</b-button
          >
        </b-card>
      </div>
    </div>
    <b-modal
      id="modal-center"
      centered
      :title="'Informações coletadas sobre ' + this.pokemonDetail.name"
      v-if="show"
      ok-only
    >
      <h4>{{ this.pokemonDetail.name }}</h4>
      <img class="detailImg" :src="imageUrl + this.pokemonDetail.id + '.png'" />
      <div class="container">
        <div class="primeira-secao">
          <div class="item">
            <span>{{ this.pokemonDetail.stats[0].base_stat }}</span>
            <span>HP</span>
          </div>

          <div class="item">
            <span>{{ this.pokemonDetail.stats[1].base_stat }}</span>
            <span>Base Attack</span>
          </div>
          <div class="item">
            <span>{{ this.pokemonDetail.stats[2].base_stat }}</span>
            <span>Base Defense</span>
          </div>
          <div class="item">
            <span>{{ this.pokemonDetail.stats[3].base_stat }}</span>
            <span>Special Attack</span>
          </div>
        </div>
        <div class="segunda-secao">
          <div class="item">
            <span>{{
              this.pokemonDetail.types
                .map((typeInfo) => typeInfo.type.name)
                .join(" | ")
            }}</span
            ><span>type</span>
          </div>
          <div class="item">
            <span>{{ this.pokemonDetail.weight / 10 }}Kg</span
            ><span>peso (kg)</span>
          </div>
          <div class="item">
            <span>{{ this.pokemonDetail.height / 10 }}m</span>
            <span>altura (m)</span>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import pokeBall from "./assets/pokeball.svg";
import Pagination from "vue-pagination-2";

export default {
  name: "App",
  components: { Pagination },
  data() {
    return {
      pokemonPromises: [],
      pokemonPromises2: [],
      show: false,
      searchFlag: "",
      showAll: true,
      inputEmpty: false,
      pokemons: [],
      pokemons2: [],
      pokemonDetail: [],
      searchField: "",
      pokeSearch: [],
      apiUrl: "https://pokeapi.co/api/v2/pokemon/",
      apiUrlType: "https://pokeapi.co/api/v2/type/",
      imageUrl: "https://pokeres.bastionbot.org/images/pokemon/",
      pokeBall,
      page: 1,
      perPage: 6,
    };
  },
  methods: {
    initialState() {
      this.showAll = true;
      this.pokemons2 = [];
    },
    listAll() {
      this.fetchPokemon2();
      this.showAll = false;
    },
    fetchPokemon() {
      let getPokemonUrl = (id) => `${this.apiUrl}${id}`;
      for (let p = 1; p <= 150; p++) {
        this.pokemonPromises.push(
          fetch(getPokemonUrl(p)).then((response) => {
            return response.json();
          })
        );
      } //varrendo todos os pokemons disponiveis e transformando os dados em JSON.
      Promise.all(this.pokemonPromises).then((pokemon) => {
        this.pokemons = pokemon; //copiando o dado para o array.
        this.pokemons.sort(() => 0.5 - Math.random()); //sorteando elementos aleatorios do array.
        this.pokemons = this.pokemons.slice(0, 8); //selecionando apenas 8
      });
    },
    fetchPokemon2() {
      this.pokemons2 = [];
      let getPokemonUrl = (id) => `${this.apiUrl}${id}`;
      for (let p = 1; p <= 150; p++) {
        this.pokemonPromises2.push(
          fetch(getPokemonUrl(p)).then((response) => {
            return response.json();
          })
        );
      } //varrendo todos os pokemons disponiveis e transformando os dados em JSON.
      Promise.all(this.pokemonPromises2).then((pokemon) => {
        this.pokemons2 = pokemon; //copiando o dado para o array.
        // this.pokemons2.sort(() => 0.5 - Math.random());
      });
    },
    showDetail(index) {
      this.pokemonDetail = index;
      this.show = true;
    },
    fetchPokemonSearch() {
      let getPokemonName = (name) => `${this.apiUrl}${name}`;
      // let getPokemonType = (type) => `${this.apiUrlType}${type}`;
      let pokePromise = [];
      pokePromise.push(
        fetch(getPokemonName(this.searchField.toLowerCase())).then(
          (pokemon) => {
            if (pokemon.status === 200) {
              this.searchFlag = pokemon.status;
              return pokemon.json();
            } else if (pokemon.status === 404) {
              this.searchFlag = pokemon.status;
              return;
            }
          }
        )
      );
      Promise.all(pokePromise).then((result) => {
        this.pokeSearch = result;
      });
    },
    searchPokemon() {
      if (this.searchField !== "") {
        this.fetchPokemonSearch();
        this.inputEmpty = false;
      } else {
        this.pokeSearch = [];
        this.searchFlag = "";
        this.inputEmpty = true;
      }
    },
  },
  computed: {
    displayedRecords() {
      const startIndex = this.perPage * (this.page - 1);
      const endIndex = startIndex + this.perPage;
      return this.pokemons2.slice(startIndex, endIndex);
    },
  },
  created() {
    this.fetchPokemon();
  },
};
</script>

<style>
h2,
h3,
h5 {
  text-align: center;
  padding: 0.5rem;
}

.museum {
  margin-top: 2rem;
}
.card-img-top {
  width: 200px !important;
  height: 200px !important;
}
.pokeCards {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  max-width: 1000px;
  margin: 1rem auto;
  text-transform: capitalize;
  /* align-items: center; */
}
.mb-2:hover {
  cursor: pointer;
  transform: translate(2px, -2px);
  box-shadow: 1px 1px 10px 10px #00000011;
  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
}

#modal-center {
  text-transform: capitalize;
  display: flex;
  text-align: center;
}

#search {
  width: 40%;
  margin: 1rem auto;
}
@media (max-width: 768px) {
  #search {
    width: 70%;
  }
}

#searchIcon:hover {
  cursor: pointer;
  transform: translate(1px, 0px);
  /* box-shadow: 1px #00000011; */
  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
}

#pokeBall {
  width: 55px;
}

.detailImg {
  width: 160px;
  height: 160px;
}

.container {
  text-align: initial;
  display: flex;
  flex-direction: column;
}

.primeira-secao {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  border-bottom: 1px dashed black;
  padding-bottom: 0.8rem;
}
.segunda-secao {
  display: flex;
  justify-content: space-between;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.listAll {
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pokeCards2 {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  max-width: 860px;
  margin: 2rem auto;
  text-transform: capitalize;
}

.VuePagination {
  justify-content: center;
  text-align: center;
}
.pagination {
  justify-content: center;
}

.listBtnAll {
  margin-top: 2rem;
}
</style>
