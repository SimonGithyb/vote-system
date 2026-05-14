<template>
    <div class="flex items-center">
        <ul class="flex list-none m-0 p-0 gap-2 items-center">
            <li>
                <button type="button"
                    title="Toggle Dark Mode"
                    class="inline-flex w-8 h-8 p-0 items-center justify-center surface-0 dark:surface-800 border border-surface-200 dark:border-surface-600 rounded cursor-pointer transition-colors hover:surface-100 dark:hover:surface-700"
                    @click="onThemeToggler">
                    <i :class="`dark:text-white pi ${iconClass}`" />
                </button>
            </li>
            <li>
                <button type="button"
                    title="Change Theme Colors"
                    @click="visible = true"
                    class="inline-flex w-8 h-8 p-0 items-center justify-center surface-0 dark:surface-800 border border-surface-200 dark:border-surface-600 rounded cursor-pointer transition-colors hover:surface-100 dark:hover:surface-700">
                    <i class="pi pi-palette dark:text-white"></i>
                </button>
            </li>
        </ul>

        <Dialog v-model:visible="visible" modal header="Theme Customization" :style="{ width: '28rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="flex flex-col gap-6 items-center text-center py-2">
                <!-- Custom Primary Color -->
                <div class="flex flex-col gap-3 items-center w-full">
                    <span class="text-sm font-bold uppercase tracking-wider">Elements Color</span>
                    <div class="flex items-center gap-4">
                        <div class="flex flex-col items-center gap-1 mr-2">
                            <ColorPicker v-model="customPrimaryHex" @change="onCustomColorChange" />
                            <span class="text-[10px] opacity-60">Custom</span>
                        </div>
                        <div v-for="color in primaryPresets" :key="color.name" 
                            @click="updatePrimaryHex(color.hex, color.name)"
                            class="w-6 h-6 rounded-full cursor-pointer border-2 transition-transform hover:scale-125"
                            :style="{ backgroundColor: color.hex, borderColor: selectedPrimaryName === color.name ? 'var(--p-primary-color)' : 'transparent' }">
                        </div>
                    </div>
                </div>

                <!-- Presets and Font -->
                <div class="flex flex-col gap-6 w-full">
                    <div class="flex flex-col gap-3 items-center w-full">
                        <span class="text-sm font-bold uppercase tracking-wider">Preset</span>
                        <SelectButton v-model="$appState.theme" @update:modelValue="onPresetChange"
                            :options="presets" :unselectable="false" class="w-full flex justify-center" />
                    </div>
                    <div class="flex flex-col gap-2 items-center">
                        <span class="text-sm font-bold uppercase tracking-wider">Font Size</span>
                        <div class="flex items-center gap-2">
                            <Button icon="pi pi-minus" @click="decrementFontSize" severity="secondary" rounded text size="small" />
                            <span class="font-bold min-w-[2rem]">{{ $appState.fontSize }}</span>
                            <Button icon="pi pi-plus" @click="incrementFontSize" severity="secondary" rounded text size="small" />
                        </div>
                    </div>
                </div>

                <!-- Toggles -->
                <div class="flex flex-col gap-3 w-full border-t border-surface-200 dark:border-surface-700 pt-4">
                    <div class="flex items-center justify-between w-full px-4">
                        <span class="text-sm font-medium">Ripple Effect</span>
                        <ToggleSwitch :modelValue="rippleActive" @update:modelValue="onRippleChange" />
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-center w-full">
                    <Button label="Done" icon="pi pi-check" @click="visible = false" class="btn-submit px-8" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script>
import { updatePreset, updateSurfacePalette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import Noir from '@/presets/Noir.js';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import ToggleSwitch from 'primevue/toggleswitch';
import ColorPicker from 'primevue/colorpicker';

const presets = { Aura, Lara, Nora, Noir };

export default {
    components: {
        Dialog, Button, SelectButton, ToggleSwitch, ColorPicker
    },
    data() {
        return {
            visible: false,
            iconClass: 'pi-moon',
            presets: Object.keys(presets),
            selectedPrimaryName: 'blue',
            customPrimaryHex: '3b82f6',
            selectedSurfaceColor: 'slate',
            primaryPresets: [
                { name: 'emerald', hex: '#10b981' },
                { name: 'green', hex: '#22c55e' },
                { name: 'blue', hex: '#3b82f6' },
                { name: 'indigo', hex: '#6366f1' },
                { name: 'purple', hex: '#a855f7' },
                { name: 'amber', hex: '#f59e0b' },
                { name: 'rose', hex: '#f43f5e' },
            ],
            surfaces: [
                { name: 'slate', palette: { 0: '#ffffff', 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' } },
                { name: 'gray', palette: { 0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' } },
                { name: 'zinc', palette: { 0: '#ffffff', 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' } },
                { name: 'soho', palette: { 0: '#ffffff', 50: '#f4f4f4', 100: '#e8e9e9', 200: '#d2d2d4', 300: '#bbbcbe', 400: '#a5a5a9', 500: '#8e8f93', 600: '#77787d', 700: '#616268', 800: '#4a4b52', 900: '#34343d', 950: '#1d1e27' } }
            ]
        };
    },
    methods: {
        onThemeToggler() {
            const root = document.documentElement;
            root.classList.toggle('p-dark');
            root.setAttribute('data-bs-theme', root.classList.contains('p-dark') ? 'dark' : 'light');
            this.iconClass = this.iconClass === 'pi-moon' ? 'pi-sun' : 'pi-moon';
        },
        hexToRgb(hex) {
            hex = hex.replace('#', '');
            if (hex.length === 3) hex = hex.split('').map(s => s + s).join('');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return { r, g, b };
        },
        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },
        lightenDarkenColor(hex, amt) {
            const rgb = this.hexToRgb(hex);
            const r = Math.max(0, Math.min(255, rgb.r + amt));
            const g = Math.max(0, Math.min(255, rgb.g + amt));
            const b = Math.max(0, Math.min(255, rgb.b + amt));
            return this.rgbToHex(r, g, b);
        },
        generatePalette(baseHex) {
            if (!baseHex.startsWith('#')) baseHex = '#' + baseHex;
            return {
                50: this.lightenDarkenColor(baseHex, 100),
                100: this.lightenDarkenColor(baseHex, 80),
                200: this.lightenDarkenColor(baseHex, 60),
                300: this.lightenDarkenColor(baseHex, 40),
                400: this.lightenDarkenColor(baseHex, 20),
                500: baseHex,
                600: this.lightenDarkenColor(baseHex, -20),
                700: this.lightenDarkenColor(baseHex, -40),
                800: this.lightenDarkenColor(baseHex, -60),
                900: this.lightenDarkenColor(baseHex, -80),
                950: this.lightenDarkenColor(baseHex, -100)
            };
        },
        updatePrimaryHex(hex, name = 'custom') {
            this.selectedPrimaryName = name;
            this.customPrimaryHex = hex.replace('#', '');
            this.applyPrimaryTheme(hex);
        },
        onCustomColorChange(event) {
            this.updatePrimaryHex(event.value);
        },
        applyPrimaryTheme(hex) {
            const palette = this.generatePalette(hex);
            updatePreset({
                semantic: {
                    primary: palette,
                    colorScheme: {
                        light: { primary: { color: '{primary.500}', contrastColor: '#ffffff' } },
                        dark: { primary: { color: '{primary.400}', contrastColor: '{surface.900}' } }
                    }
                }
            });
        },
        updateSurface(surface) {
            this.selectedSurfaceColor = surface.name;
            updateSurfacePalette(surface.palette);
        },
        onPresetChange(value) {
            this.$appState.theme = value;
            updatePreset(presets[value]);
        },
        onFontSizeChange(value) {
            document.documentElement.style.fontSize = `${value}px`;
        },
        incrementFontSize() { if (this.$appState.fontSize < 24) { this.$appState.fontSize++; this.onFontSizeChange(this.$appState.fontSize); } },
        decrementFontSize() { if (this.$appState.fontSize > 10) { this.$appState.fontSize--; this.onFontSizeChange(this.$appState.fontSize); } },
        onRippleChange(value) { this.$primevue.config.ripple = value; }
    },
    computed: {
        rippleActive() { return this.$primevue.config.ripple; }
    },
    mounted() {
        this.onFontSizeChange(this.$appState.fontSize);
        this.updatePrimaryHex('#3b82f6', 'blue');
        this.updateSurface(this.surfaces[0]);
    }
};
</script>
