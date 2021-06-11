class ApiService {
  baseUrl = 'http://localhost:3000/api/films';

  async getAll() {
    const response = await fetch(this.baseUrl);
    return response.json();
  }

  async getById(pFilmId) {
    const response = await fetch(`${this.baseUrl}/${pFilmId}`);
    return response.json();
  }

  async create(pNewFilm) {
    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
      }),
      body: pNewFilm
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

  async delete(pFilmId) {
    const requestOptions = {
      method: 'DELETE'
    };
    const response = await fetch(`${this.baseUrl}/${pFilmId}`, requestOptions);
    return response.json();
  }

  // Update image
  // async update(image) {
  //   const requestOptions = {
  //     method: 'PUT',
  //     headers: new Headers({
  //       'Accept': 'application/json',
  //     }),
  //     body: image
  //   }
  //   const response = await fetch(`${this.baseUrl}/${image}`, requestOptions);
  //   return response.json();
  // }

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
    editId: ''
    // editImg: '',
    // isEditImg: false
  },
  async created() {
    this.apiService = new ApiService();
    const response = await this.apiService.getAll();
    const { ok } = response;
    if (ok) {
      this.films = response.films;
    }
    else {
      this.error = response.error;
    }
  },
  methods: {
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

      if (this.isEdit) {
        await this.apiService.update(this.editId, formData);
      } else {
        formData.append("image", this.image);
        await this.apiService.create(formData);
      }

      const response = await this.apiService.getAll();
      const { ok } = response;
      if (ok) {
        this.films = response.films;
      }
      else {
        this.error = response.error;
      }
      this.title = '';
      this.description = '';
      this.score = undefined;
      this.director = '';
      this.image = null;
    },
    onClickEDit: async function (selectedFilm) {
      this.title = selectedFilm.title;
      this.description = selectedFilm.description;
      this.score = selectedFilm.score;
      this.director = selectedFilm.director;
      this.editId = selectedFilm.id;
      this.isEdit = true;
    },
    onClickDelete: async function (pFilmId) {
      console.log(pFilmId);
      await this.apiService.delete(pFilmId);
      const response = await this.apiService.getAll();
      const { ok } = response;
      if (ok) {
        this.films = response.films;
      }
      else {
        this.error = response.error;
      }
    },
    onClickEditImg: async function (selectedImg) {

      const { value: file } = await Swal.fire({
        title: 'Select image',
        input: 'file',
        inputAttributes: {
          'accept': 'image/*',
          'aria-label': 'Upload your profile picture'
        }
      })

      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          Swal.fire({
            title: 'Your uploaded picture',
            imageUrl: e.target.result,
            imageAlt: 'The uploaded picture'
          })
        }
        reader.readAsDataURL(file)
      }

      // this.image = selectedImg.image;
      // this.editImg = selectedImg.id;
      // this.isEditImg = true;

      // const response = await this.apiService.getAll();
      // const { ok } = response;
      // if (ok) {
      //   this.image = response.image;
      // }
      // else {
      //   this.error = response.error;
      // }


    }


  }

})


