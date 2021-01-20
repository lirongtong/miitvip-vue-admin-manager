declare module '*.vue' {
	import { defineComponent } from 'vue'
	const component: ReturnType<typeof defineComponent>
	export default component
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'