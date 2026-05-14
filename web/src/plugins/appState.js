import { reactive } from 'vue';

        export default {
            install: (app) => {
                const _appState = reactive({ theme: 'Aura', darkTheme: false, fontSize: 16 });

                app.config.globalProperties.$appState = _appState;
            }
        };
        