
export default {
  name: 'menu-online',
  components: {},
  props: [],
  data () {
    return {
      test: "test"
    };
  },
  computed: {

  },
  mounted () {

  },
  methods: {
  logout() {
    localStorage.clear();
    location.reload();
  },
  }
}


