class ApiService {
  baseUrl = 'http://localhost:3000/api/films';

  async getAll() {
    const response = await fetch(this.baseUrl);
    return response.json();
  }

  async getById(filmId) {
    const response = await fetch(`${this.baseUrl}/${filmId}`);
    return response.json();
  }

  async create(newFilm) {
    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
      }),
      body: newFilm
    }
    const response = await fetch(this.baseUrl, requestOptions);
    return response.json();
  }

  async update(id, data) {
    const requestOptions = {
      method: 'PUT',
      headers: new Headers({
        'Accept': 'application/json',
      }),
      body: data
    }
    const response = await fetch(`${this.baseUrl}/${id}`, requestOptions);
    return response.json();
  }

  async updateImg(id, data) {
    const requestOptions = {
      method: 'PUT',
      headers: new Headers({
        'Accept': 'application/json',
      }),
      body: data
    }
    const response = await fetch(`${this.baseUrl}/image/${id}`, requestOptions);
    return response.json();
  }

  async delete(pFilmId) {
    const requestOptions = {
      method: 'DELETE'
    };
    const response = await fetch(`${this.baseUrl}/${pFilmId}`, requestOptions);
    return response.json();
  }

  async deleteImg(id, data) {
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-type': 'application/json',
        'Accept': 'application/json'
      })
    }
    const response = await fetch(`${this.baseUrl}/image/delete/${id}`, requestOptions);
    return response.json();
  }

}

const app = new Vue({
  el: '#app',
  data: {
    films: [],
    error: '',
    apiService: null,
    title: '',
    description: '',
    score: undefined,
    director: '',
    image: null,
    isEdit: false,
    showForm: false,
    showList: true,
    editId: '',
    savedImage: '',
  },
  async created() {
    this.apiService = new ApiService();
    this.loadFilms();
  },
  methods: {
    loadFilms: async function () {
      const response = await this.apiService.getAll();
      const { ok } = response;
      if (ok) {
        this.films = response.films;
      }
      else {
        this.error = response.error;
      }
    },
    onReset: function () {
      this.title = '';
      this.description = '';
      this.score = undefined;
      this.director = '';
      this.image = null;
      this.editId = '';
      this.savedImage = '';

      this.showForm = false;
      this.showList = true;
      this.isEdit = false;
    },
    removeError: function () {
      this.error = '';
    },
    onClickAdd: function () {
      this.showForm = true;
      this.showList = false;
    },
    onClickEDit: function (selectedFilm) {
      this.title = selectedFilm.title;
      this.description = selectedFilm.description;
      this.score = selectedFilm.score;
      this.director = selectedFilm.director;
      this.editId = selectedFilm.id;
      this.showForm = true;
      this.showList = false;
      this.isEdit = true;
    },
    onChangeImage(event) {
      console.log("Event: ", event.target.files);
      this.image = event.target.files[0];
    },
    onClickSendFilm: async function () {
      let formData = new FormData();
      formData.append("title", this.title);
      formData.append("description", this.description);
      formData.append("score", this.score);
      formData.append("director", this.director);

      try {
        let response;
        if (this.isEdit) {
          response = await this.apiService.update(this.editId, formData);
        } else {
          formData.append("image", this.image);
          response = await this.apiService.create(formData);
        }

        const { ok } = response;
        if (ok) {
          this.loadFilms();
          this.onReset();
        }
        else {
          this.error = response.error;
        }

      } catch (error) {
        this.error = 'Something goes wrong.';
      }

    },
    onClickDelete: async function (FilmId) {
      try {
        let response = await this.apiService.delete(FilmId);
        const { ok } = response;
        if (ok) {
          this.loadFilms();
        }
        else {
          this.error = response.error;
        }
      } catch (error) {
        this.error = 'Something goes wrong.';
      }
    },
    onClickEditImg: function (id, selectedImg) {
      this.editId = id;
      this.savedImage = selectedImg;
    },
    onSaveEditImg: async function () {
      let formData = new FormData();
      formData.append("savedImage", this.savedImage);
      formData.append("image", this.image);

      try {
        let response = await this.apiService.updateImg(this.editId, formData);
        const { ok } = response;
        if (ok) {
          this.loadFilms();
          this.savedImage = '';
          this.editId = '';
          this.image = null;
        }
        else {
          this.error = response.error;
        }
        const closeModal = document.getElementById("closeModal");
        closeModal.click();
      } catch (error) {
        this.error = 'Something goes wrong.';
      }

    },
    onDeleteImg: async function (id, selectedImg) {
      const data = { savedImage: selectedImg };

      try {
        let response = await this.apiService.deleteImg(id, data);
        const { ok } = response;
        if (ok) {
          this.loadFilms();
        }
        else {
          this.error = response.error;
        }
      } catch (error) {
        this.error = 'Something goes wrong.';
      }

    }

  }

})


